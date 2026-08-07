-- Migration: 00006_razorpay_transactions.sql
-- Description: Adds tables for tracking Razorpay orders and payments, and mapping them to workspace subscriptions.

-- 1. Create razorpay_orders table
CREATE TABLE public.razorpay_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  plan_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('CREATED', 'PAID', 'FAILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_razorpay_orders_workspace ON public.razorpay_orders(workspace_id);
CREATE INDEX idx_razorpay_orders_razorpay_id ON public.razorpay_orders(razorpay_order_id);

-- RLS
ALTER TABLE public.razorpay_orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view workspace orders"
  ON public.razorpay_orders FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

-- 2. RPC Function for confirming payment and updating subscription atomically
CREATE OR REPLACE FUNCTION public.confirm_razorpay_payment(
  p_razorpay_order_id TEXT,
  p_razorpay_payment_id TEXT,
  p_razorpay_signature TEXT,
  p_scans_to_add INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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
