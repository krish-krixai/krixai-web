-- Migration: 00014_invoicing_and_tax.sql
-- Description: Adds invoices table with strict GST breakdown and refund handling.

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL REFERENCES public.razorpay_orders(razorpay_order_id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE,
  
  -- Customer Details
  billing_name TEXT NOT NULL,
  billing_address TEXT NOT NULL,
  billing_state TEXT NOT NULL,
  billing_pin_code TEXT NOT NULL,
  billing_country TEXT NOT NULL,
  tax_id_gstin TEXT,
  
  -- Supplier Details (Snapshot)
  supplier_legal_name TEXT NOT NULL,
  supplier_address TEXT NOT NULL,
  supplier_gstin TEXT NOT NULL,
  
  -- Financials
  subtotal_amount INTEGER NOT NULL,
  cgst_amount INTEGER NOT NULL DEFAULT 0,
  sgst_amount INTEGER NOT NULL DEFAULT 0,
  igst_amount INTEGER NOT NULL DEFAULT 0,
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  sac_code TEXT NOT NULL DEFAULT '998313',
  
  status TEXT NOT NULL CHECK (status IN ('DRAFT', 'PAID', 'VOID', 'REFUNDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_invoices_workspace ON public.invoices(workspace_id);
CREATE INDEX idx_invoices_order ON public.invoices(razorpay_order_id);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workspace invoices"
  ON public.invoices FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

-- Function to auto-generate invoice numbers when status transitions to PAID
-- Uses Financial Year scope (e.g. INV-FY2627-0001)
CREATE OR REPLACE FUNCTION public.assign_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  next_val INT;
  fy_str TEXT;
  curr_month INT;
  curr_year INT;
BEGIN
  IF NEW.status = 'PAID' AND OLD.status != 'PAID' AND NEW.invoice_number IS NULL THEN
    curr_month := EXTRACT(MONTH FROM NOW());
    curr_year := EXTRACT(YEAR FROM NOW());
    
    -- Indian FY is April 1 to March 31
    IF curr_month < 4 THEN
      fy_str := format('FY%s%s', to_char(NOW() - interval '1 year', 'YY'), to_char(NOW(), 'YY'));
    ELSE
      fy_str := format('FY%s%s', to_char(NOW(), 'YY'), to_char(NOW() + interval '1 year', 'YY'));
    END IF;
    
    -- Create sequence if it doesn't exist for the FY
    EXECUTE format('CREATE SEQUENCE IF NOT EXISTS invoice_seq_%s', fy_str);
    
    EXECUTE format('SELECT nextval(''invoice_seq_%s'')', fy_str) INTO next_val;
    
    NEW.invoice_number := format('INV-%s-%s', fy_str, lpad(next_val::TEXT, 4, '0'));
    NEW.paid_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_invoice_paid
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_invoice_number();

-- Update webhook RPC to mark invoice as PAID
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
  WHERE razorpay_order_id = p_order_id;

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

-- New RPC for processing refund webhooks
CREATE OR REPLACE FUNCTION public.process_razorpay_refund(
  p_event_id TEXT,
  p_order_id TEXT
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
    VALUES (p_event_id, 'payment.refunded', 'razorpay');
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

  IF v_order.status = 'REFUNDED' THEN
    RETURN TRUE;
  END IF;

  -- 3. Update order status
  UPDATE public.razorpay_orders 
  SET status = 'REFUNDED', updated_at = NOW()
  WHERE id = v_order.id;

  -- 4. Update invoice status (revoke PAID status)
  UPDATE public.invoices
  SET status = 'REFUNDED'
  WHERE razorpay_order_id = p_order_id;

  -- 5. Revoke Subscription Entitlement
  UPDATE public.workspace_subscriptions
  SET status = 'refunded', included_scans = 0, updated_at = NOW()
  WHERE workspace_id = v_order.workspace_id;

  RETURN TRUE;
END;
$$;
