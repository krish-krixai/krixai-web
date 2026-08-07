-- Migration: 00016_order_insert_policy.sql
-- Description: Adds missing table grants and INSERT RLS policies for razorpay_orders and invoices tables.

-- Grant table privileges to authenticated users
GRANT SELECT, INSERT, UPDATE ON TABLE public.razorpay_orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.invoices TO authenticated;

-- Drop them if they exist so we can recreate them cleanly
DROP POLICY IF EXISTS "Users can insert workspace orders" ON public.razorpay_orders;
DROP POLICY IF EXISTS "Users can insert workspace invoices" ON public.invoices;

-- Allow users to create orders for their workspaces
CREATE POLICY "Users can insert workspace orders"
  ON public.razorpay_orders FOR INSERT
  TO authenticated
  WITH CHECK (workspace_id IN (SELECT public.get_my_workspaces()));

-- Allow users to create invoices for their workspaces
CREATE POLICY "Users can insert workspace invoices"
  ON public.invoices FOR INSERT
  TO authenticated
  WITH CHECK (workspace_id IN (SELECT public.get_my_workspaces()));
