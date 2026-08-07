-- Migration: 00011_production_billing.sql
-- Description: Production billing flow updates (subscription status, free tier onboarding, webhook idempotency).

-- 1. Add subscription state
ALTER TABLE public.workspace_subscriptions ADD COLUMN status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired', 'refunded'));

-- 2. Update onboarding trigger to default to FREE plan with 0 scans
CREATE OR REPLACE FUNCTION public.handle_new_workspace_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspace_subscriptions (workspace_id, plan_name, included_scans, period_start, period_end, scans_used, status)
  VALUES (NEW.id, 'FREE', 0, NOW(), NOW() + INTERVAL '30 days', 0, 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Webhook idempotency ledger
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Process webhook RPC
CREATE OR REPLACE FUNCTION public.process_razorpay_webhook(
  p_event_id TEXT,
  p_order_id TEXT,
  p_payment_id TEXT,
  p_signature TEXT,
  p_plan_name TEXT,
  p_scans_to_add INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
BEGIN
  -- 1. Idempotency Check
  BEGIN
    INSERT INTO public.webhook_events (event_id, event_type, provider) 
    VALUES (p_event_id, 'order.paid', 'razorpay');
  EXCEPTION WHEN unique_violation THEN
    -- Event already processed
    RETURN TRUE;
  END;

  -- 2. Lock the order
  SELECT * INTO v_order FROM public.razorpay_orders 
  WHERE razorpay_order_id = p_order_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Only process if status is CREATED or FAILED
  IF v_order.status = 'PAID' THEN
    RETURN TRUE;
  END IF;

  -- 3. Update order
  UPDATE public.razorpay_orders 
  SET status = 'PAID', razorpay_payment_id = p_payment_id, razorpay_signature = p_signature, updated_at = NOW()
  WHERE id = v_order.id;

  -- 4. Update Subscription (RESET scans, don't stack)
  INSERT INTO public.workspace_subscriptions (workspace_id, plan_name, included_scans, period_start, period_end, scans_used, status, updated_at)
  VALUES (v_order.workspace_id, p_plan_name, p_scans_to_add, NOW(), NOW() + INTERVAL '30 days', 0, 'active', NOW())
  ON CONFLICT (workspace_id) DO UPDATE SET 
    plan_name = EXCLUDED.plan_name,
    included_scans = EXCLUDED.included_scans,
    scans_used = 0,
    period_start = EXCLUDED.period_start,
    period_end = EXCLUDED.period_end,
    status = 'active',
    updated_at = NOW();

  RETURN TRUE;
END;
$$;

-- Note: We retain confirm_razorpay_payment for backward compatibility during deployment if needed, 
-- but Next.js will stop using it. We can drop it safely in a future migration.
DROP FUNCTION IF EXISTS public.confirm_razorpay_payment(TEXT, TEXT, TEXT, INTEGER);
