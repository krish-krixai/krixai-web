-- Migration: 00020_update_free_tier.sql
-- Description: Updates the default workspace subscription to match the 'Free' tier marketing limits (10,000 requests instead of 50,000).

CREATE OR REPLACE FUNCTION public.handle_new_workspace_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspace_subscriptions (workspace_id, plan_name, included_scans, period_start, period_end, scans_used)
  VALUES (NEW.id, 'Free', 10000, NOW(), NOW() + INTERVAL '30 days', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
