-- Migration: 00018_atomic_fulfillment.sql
-- Description: Enforces strict atomicity during Razorpay webhook fulfillment.

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
  v_row_count INTEGER;
BEGIN
  -- 1. Idempotency Check
  BEGIN
    INSERT INTO public.webhook_events (event_id, event_type, provider) 
    VALUES (p_event_id, 'order.paid', 'razorpay');
  EXCEPTION WHEN unique_violation THEN
    RETURN TRUE;
  END;

  -- 2. Lock the order
  SELECT * INTO v_order FROM public.razorpay_orders 
  WHERE razorpay_order_id = p_order_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Atomic failure: Order % not found', p_order_id;
  END IF;

  IF v_order.status = 'PAID' THEN
    RETURN TRUE;
  END IF;

  -- 3. Update order
  UPDATE public.razorpay_orders 
  SET status = 'PAID', razorpay_payment_id = p_payment_id, razorpay_signature = p_signature, updated_at = NOW()
  WHERE id = v_order.id;

  -- 4. Update invoice status (Strict Atomicity Check)
  UPDATE public.invoices
  SET status = 'PAID', paid_at = NOW()
  WHERE razorpay_order_id = p_order_id;

  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  IF v_row_count = 0 THEN
    RAISE EXCEPTION 'Atomic failure: No draft invoice found for order %', p_order_id;
  END IF;

  -- 5. Update Subscription (RESET scans, don't stack)
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
