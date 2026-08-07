-- Migration: 00005_workspace_billing.sql
-- Description: Adds usage metering and authoritative billing constraints for workspaces.

-- 1. Create workspace_subscriptions table
CREATE TABLE public.workspace_subscriptions (
  workspace_id UUID PRIMARY KEY REFERENCES public.workspaces(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'STARTER',
  included_scans INTEGER NOT NULL DEFAULT 50000,
  period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  scans_used INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create usage_records table (Idempotency Ledger)
CREATE TABLE public.usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('RESERVED', 'FINALIZED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalized_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_usage_records_workspace ON public.usage_records(workspace_id);

-- RLS
ALTER TABLE public.workspace_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;

-- Users can view their workspace subscriptions
CREATE POLICY "Users can view workspace subscriptions"
  ON public.workspace_subscriptions FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

CREATE POLICY "Users can view usage records"
  ON public.usage_records FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

-- 3. RPC Functions for Atomic Operations

-- Authorize Scan
CREATE OR REPLACE FUNCTION public.authorize_scan(p_workspace_id UUID, p_idempotency_key TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sub RECORD;
  v_exists BOOLEAN;
BEGIN
  -- 1. Check idempotency first (if already processed, we let it pass but don't increment)
  SELECT EXISTS(SELECT 1 FROM public.usage_records WHERE idempotency_key = p_idempotency_key) INTO v_exists;
  IF v_exists THEN
    RETURN TRUE; 
  END IF;

  -- 2. Lock the subscription row for atomic update
  SELECT * INTO v_sub FROM public.workspace_subscriptions 
  WHERE workspace_id = p_workspace_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE; -- No subscription found
  END IF;

  -- 3. Check quota
  IF v_sub.scans_used >= v_sub.included_scans THEN
    RETURN FALSE;
  END IF;

  -- 4. Increment usage
  UPDATE public.workspace_subscriptions 
  SET scans_used = scans_used + 1, updated_at = NOW()
  WHERE workspace_id = p_workspace_id;

  -- 5. Create reservation record
  INSERT INTO public.usage_records (workspace_id, idempotency_key, status)
  VALUES (p_workspace_id, p_idempotency_key, 'RESERVED');

  RETURN TRUE;
END;
$$;

-- Release Scan (if engine fails)
CREATE OR REPLACE FUNCTION public.release_scan(p_workspace_id UUID, p_idempotency_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status TEXT;
BEGIN
  SELECT status INTO v_status FROM public.usage_records WHERE idempotency_key = p_idempotency_key;
  
  IF v_status = 'RESERVED' THEN
    -- Delete reservation
    DELETE FROM public.usage_records WHERE idempotency_key = p_idempotency_key;
    
    -- Decrement usage atomically
    UPDATE public.workspace_subscriptions 
    SET scans_used = GREATEST(0, scans_used - 1), updated_at = NOW()
    WHERE workspace_id = p_workspace_id;
  END IF;
END;
$$;

-- Finalize Scan
CREATE OR REPLACE FUNCTION public.finalize_scan(p_workspace_id UUID, p_idempotency_key TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.usage_records 
  SET status = 'FINALIZED', finalized_at = NOW()
  WHERE idempotency_key = p_idempotency_key AND status = 'RESERVED';
END;
$$;

-- 4. Automatically create subscription for new workspaces
CREATE OR REPLACE FUNCTION public.handle_new_workspace_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspace_subscriptions (workspace_id, plan_name, included_scans, period_start, period_end, scans_used)
  VALUES (NEW.id, 'STARTER', 50000, NOW(), NOW() + INTERVAL '30 days', 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_workspace_created
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_workspace_subscription();

-- 5. Backfill existing workspaces
INSERT INTO public.workspace_subscriptions (workspace_id, plan_name, included_scans, period_start, period_end, scans_used)
SELECT id, 'STARTER', 50000, NOW(), NOW() + INTERVAL '30 days', 0
FROM public.workspaces
ON CONFLICT (workspace_id) DO NOTHING;


-- 6. RPC Functions for Aggregation

CREATE OR REPLACE FUNCTION public.get_workspace_usage_stats(p_workspace_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sub RECORD;
  v_provider_stats JSON;
  v_daily_stats JSON;
BEGIN
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
