-- Migration: 00015_webhook_entitlement_fix.sql
-- Description: Adds detailed statuses, active invoice tracking, and safe failed/refunded webhook handlers.

-- 1. Fix razorpay_orders status constraint
ALTER TABLE public.razorpay_orders DROP CONSTRAINT IF EXISTS razorpay_orders_status_check;
ALTER TABLE public.razorpay_orders ADD CONSTRAINT razorpay_orders_status_check CHECK (status IN ('CREATED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'));

-- 2. Fix invoices status constraint
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
ALTER TABLE public.invoices ADD CONSTRAINT invoices_status_check CHECK (status IN ('DRAFT', 'PENDING', 'PAID', 'FAILED', 'VOID', 'REFUNDED', 'PARTIALLY_REFUNDED'));

-- 3. Fix workspace_subscriptions status constraint
ALTER TABLE public.workspace_subscriptions DROP CONSTRAINT IF EXISTS workspace_subscriptions_status_check;
ALTER TABLE public.workspace_subscriptions ADD CONSTRAINT workspace_subscriptions_status_check CHECK (status IN ('pending', 'active', 'past_due', 'canceled', 'expired', 'refunded'));

-- 4. Add active_invoice_id to workspace_subscriptions
ALTER TABLE public.workspace_subscriptions ADD COLUMN active_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- 5. Safe failed payment RPC
CREATE OR REPLACE FUNCTION public.process_razorpay_payment_failed(
  p_event_id TEXT,
  p_order_id TEXT,
  p_payment_id TEXT,
  p_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
BEGIN
  -- Idempotency Check
  BEGIN
    INSERT INTO public.webhook_events (event_id, event_type, provider) 
    VALUES (p_event_id, 'payment.failed', 'razorpay');
  EXCEPTION WHEN unique_violation THEN
    RETURN TRUE;
  END;

  -- Lock the order
  SELECT * INTO v_order FROM public.razorpay_orders 
  WHERE razorpay_order_id = p_order_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Never overwrite a PAID or REFUNDED invoice/order from a payment.failed event
  IF v_order.status IN ('PAID', 'REFUNDED', 'PARTIALLY_REFUNDED') THEN
    RETURN TRUE;
  END IF;

  -- Update order status
  UPDATE public.razorpay_orders 
  SET status = 'FAILED', razorpay_payment_id = p_payment_id, updated_at = NOW()
  WHERE id = v_order.id;

  -- Update invoice status
  UPDATE public.invoices
  SET status = 'FAILED'
  WHERE razorpay_order_id = p_order_id AND status != 'PAID';

  RETURN TRUE;
END;
$$;

-- 6. Update paid webhook RPC to link active_invoice_id
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
  v_invoice_id UUID;
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
    RETURN FALSE;
  END IF;

  IF v_order.status = 'PAID' THEN
    RETURN TRUE;
  END IF;

  -- 3. Update order
  UPDATE public.razorpay_orders 
  SET status = 'PAID', razorpay_payment_id = p_payment_id, razorpay_signature = p_signature, updated_at = NOW()
  WHERE id = v_order.id;

  -- 4. Update invoice status
  UPDATE public.invoices
  SET status = 'PAID', paid_at = NOW()
  WHERE razorpay_order_id = p_order_id
  RETURNING id INTO v_invoice_id;

  -- 5. Update Subscription (RESET scans, don't stack)
  INSERT INTO public.workspace_subscriptions (workspace_id, plan_name, included_scans, period_start, period_end, scans_used, status, active_invoice_id, updated_at)
  VALUES (v_order.workspace_id, p_plan_name, p_scans_to_add, NOW(), NOW() + INTERVAL '30 days', 0, 'active', v_invoice_id, NOW())
  ON CONFLICT (workspace_id) DO UPDATE SET 
    plan_name = EXCLUDED.plan_name,
    included_scans = EXCLUDED.included_scans,
    scans_used = 0,
    period_start = EXCLUDED.period_start,
    period_end = EXCLUDED.period_end,
    status = 'active',
    active_invoice_id = EXCLUDED.active_invoice_id,
    updated_at = NOW();

  RETURN TRUE;
END;
$$;

-- 7. Update refund RPC for partial refunds & invoice checking
DROP FUNCTION IF EXISTS public.process_razorpay_refund(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.process_razorpay_refund(
  p_event_id TEXT,
  p_order_id TEXT,
  p_refund_id TEXT,
  p_amount INTEGER,
  p_currency TEXT,
  p_is_full_refund BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_invoice_id UUID;
  v_active_invoice_id UUID;
BEGIN
  -- 1. Idempotency Check using both event_id and refund_id combined
  BEGIN
    INSERT INTO public.webhook_events (event_id, event_type, provider) 
    VALUES (p_event_id || '_' || p_refund_id, 'payment.refunded', 'razorpay');
  EXCEPTION WHEN unique_violation THEN
    RETURN TRUE;
  END;

  -- 2. Lock the order
  SELECT * INTO v_order FROM public.razorpay_orders 
  WHERE razorpay_order_id = p_order_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- 3. Update order status
  IF p_is_full_refund THEN
    UPDATE public.razorpay_orders SET status = 'REFUNDED', updated_at = NOW() WHERE id = v_order.id;
  ELSE
    UPDATE public.razorpay_orders SET status = 'PARTIALLY_REFUNDED', updated_at = NOW() WHERE id = v_order.id;
  END IF;

  -- 4. Update invoice status & get its ID
  IF p_is_full_refund THEN
    UPDATE public.invoices SET status = 'REFUNDED' WHERE razorpay_order_id = p_order_id RETURNING id INTO v_invoice_id;
  ELSE
    UPDATE public.invoices SET status = 'PARTIALLY_REFUNDED' WHERE razorpay_order_id = p_order_id RETURNING id INTO v_invoice_id;
  END IF;

  -- 5. Revoke Subscription Entitlement ONLY IF:
  -- - it is a full refund
  -- - the refunded invoice is the invoice currently granting the active subscription.
  IF p_is_full_refund THEN
    SELECT active_invoice_id INTO v_active_invoice_id FROM public.workspace_subscriptions WHERE workspace_id = v_order.workspace_id;
    
    IF v_active_invoice_id = v_invoice_id THEN
      UPDATE public.workspace_subscriptions
      SET status = 'refunded', included_scans = 0, active_invoice_id = NULL, updated_at = NOW()
      WHERE workspace_id = v_order.workspace_id;
    END IF;
  END IF;

  RETURN TRUE;
END;
$$;
