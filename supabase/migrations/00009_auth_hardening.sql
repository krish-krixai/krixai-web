-- Migration: 00009_auth_hardening.sql
-- Description: Hardens SECURITY DEFINER RPCs with explicit membership checks and search_paths. Scopes idempotency keys to workspace.

-- 1. Fix Idempotency Key scope
ALTER TABLE public.usage_records DROP CONSTRAINT IF EXISTS usage_records_idempotency_key_key;
ALTER TABLE public.usage_records ADD CONSTRAINT usage_records_workspace_id_idempotency_key_key UNIQUE (workspace_id, idempotency_key);

-- 2. Harden authorize_scan
CREATE OR REPLACE FUNCTION public.authorize_scan(p_workspace_id UUID, p_idempotency_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sub RECORD;
  v_exists BOOLEAN;
BEGIN
  -- Verify membership
  IF NOT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = p_workspace_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: Not a member of this workspace';
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.usage_records WHERE workspace_id = p_workspace_id AND idempotency_key = p_idempotency_key) INTO v_exists;
  IF v_exists THEN
    RETURN TRUE; 
  END IF;

  SELECT * INTO v_sub FROM public.workspace_subscriptions 
  WHERE workspace_id = p_workspace_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF v_sub.scans_used >= v_sub.included_scans THEN
    RETURN FALSE;
  END IF;

  UPDATE public.workspace_subscriptions 
  SET scans_used = scans_used + 1, updated_at = NOW()
  WHERE workspace_id = p_workspace_id;

  INSERT INTO public.usage_records (workspace_id, idempotency_key, status)
  VALUES (p_workspace_id, p_idempotency_key, 'RESERVED');

  RETURN TRUE;
END;
$$;

-- 3. Harden release_scan
CREATE OR REPLACE FUNCTION public.release_scan(p_workspace_id UUID, p_idempotency_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
BEGIN
  -- Verify membership
  IF NOT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = p_workspace_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: Not a member of this workspace';
  END IF;

  SELECT status INTO v_status FROM public.usage_records WHERE workspace_id = p_workspace_id AND idempotency_key = p_idempotency_key;
  
  IF v_status = 'RESERVED' THEN
    DELETE FROM public.usage_records WHERE workspace_id = p_workspace_id AND idempotency_key = p_idempotency_key;
    
    UPDATE public.workspace_subscriptions 
    SET scans_used = GREATEST(0, scans_used - 1), updated_at = NOW()
    WHERE workspace_id = p_workspace_id;
  END IF;
END;
$$;

-- 4. Harden finalize_scan
CREATE OR REPLACE FUNCTION public.finalize_scan(p_workspace_id UUID, p_idempotency_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify membership
  IF NOT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = p_workspace_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: Not a member of this workspace';
  END IF;

  UPDATE public.usage_records 
  SET status = 'FINALIZED', finalized_at = NOW()
  WHERE workspace_id = p_workspace_id AND idempotency_key = p_idempotency_key AND status = 'RESERVED';
END;
$$;

-- 5. Harden get_workspace_usage_stats
CREATE OR REPLACE FUNCTION public.get_workspace_usage_stats(p_workspace_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sub RECORD;
  v_provider_stats JSON;
  v_daily_stats JSON;
BEGIN
  -- Verify membership
  IF NOT EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = p_workspace_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: Not a member of this workspace';
  END IF;

  SELECT * INTO v_sub FROM public.workspace_subscriptions WHERE workspace_id = p_workspace_id;
  IF NOT FOUND THEN
    RETURN '{}'::JSON;
  END IF;

  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::JSON) INTO v_provider_stats
  FROM (
    SELECT COALESCE(provider, 'Unknown') as name, COUNT(*) as scans
    FROM public.scan_events
    WHERE workspace_id = p_workspace_id 
      AND created_at >= v_sub.period_start 
      AND created_at <= v_sub.period_end
    GROUP BY COALESCE(provider, 'Unknown')
    ORDER BY scans DESC
  ) t;

  SELECT COALESCE(json_agg(row_to_json(d)), '[]'::JSON) INTO v_daily_stats
  FROM (
    SELECT date_trunc('day', created_at) as day, COUNT(*) as scans
    FROM public.scan_events
    WHERE workspace_id = p_workspace_id 
      AND created_at >= v_sub.period_start 
      AND created_at <= v_sub.period_end
    GROUP BY date_trunc('day', created_at)
    ORDER BY day ASC
  ) d;

  RETURN json_build_object(
    'provider_breakdown', v_provider_stats,
    'daily_trend', v_daily_stats
  );
END;
$$;

-- 6. Harden confirm_razorpay_payment
CREATE OR REPLACE FUNCTION public.confirm_razorpay_payment(
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_razorpay_signature TEXT,
  p_scans_to_add INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  -- Lock the order
  SELECT * INTO v_order FROM public.razorpay_orders 
  WHERE razorpay_order_id = p_razorpay_order_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Verify membership (must be an OWNER or ADMIN to confirm payment for this workspace)
  IF NOT EXISTS (
    SELECT 1 FROM public.workspace_members 
    WHERE workspace_id = v_order.workspace_id AND user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ) THEN
    RAISE EXCEPTION 'Forbidden: Not authorized to confirm payment for this workspace';
  END IF;

  -- Only process if status is CREATED
  IF v_order.status != 'CREATED' THEN
    RETURN TRUE; -- Already processed
  END IF;

  -- Update order status
  UPDATE public.razorpay_orders 
  SET 
    status = 'PAID',
    razorpay_payment_id = p_razorpay_payment_id,
    razorpay_signature = p_razorpay_signature,
    updated_at = NOW()
  WHERE id = v_order.id;

  -- Upsert subscription
  INSERT INTO public.workspace_subscriptions (workspace_id, plan_name, included_scans, period_start, period_end, scans_used, updated_at)
  VALUES (
    v_order.workspace_id, 
    v_order.plan_name, 
    p_scans_to_add, 
    NOW(), 
    NOW() + INTERVAL '30 days', 
    0, 
    NOW()
  )
  ON CONFLICT (workspace_id) 
  DO UPDATE SET 
    plan_name = EXCLUDED.plan_name,
    included_scans = public.workspace_subscriptions.included_scans + EXCLUDED.included_scans,
    period_end = GREATEST(public.workspace_subscriptions.period_end, NOW()) + INTERVAL '30 days',
    updated_at = NOW();

  RETURN TRUE;
END;
$$;
