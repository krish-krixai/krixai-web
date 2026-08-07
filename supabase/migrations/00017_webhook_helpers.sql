-- Migration: 00017_webhook_helpers.sql
-- Description: Adds a helper RPC to fetch razorpay_orders securely for webhooks without RLS blocks.

CREATE OR REPLACE FUNCTION public.get_razorpay_order_for_webhook(p_order_id TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order json;
BEGIN
  SELECT row_to_json(r) INTO v_order
  FROM public.razorpay_orders r
  WHERE razorpay_order_id = p_order_id;
  
  RETURN v_order;
END;
$$;
