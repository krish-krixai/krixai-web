-- Migration: 00013_privacy_safe_logging.sql
-- Description: Adds privacy-safe logging controls, full prompt encryption, and retention lifecycle via pg_cron.

-- 1. Workspace settings for log retention
ALTER TABLE public.workspaces 
  ADD COLUMN IF NOT EXISTS retain_full_prompts BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS log_retention_days INTEGER NOT NULL DEFAULT 30;

ALTER TABLE public.workspaces
  ADD CONSTRAINT chk_retention_days CHECK (log_retention_days > 0 AND log_retention_days <= 365);

-- 2. Scan event privacy and audit fields
ALTER TABLE public.scan_events
  ADD COLUMN IF NOT EXISTS request_correlation_id TEXT,
  ADD COLUMN IF NOT EXISTS key_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS policy_version INTEGER,
  ADD COLUMN IF NOT EXISTS full_prompt_encrypted TEXT;

-- Drop plaintext full_prompt
ALTER TABLE public.scan_events
  DROP COLUMN IF EXISTS full_prompt;

-- Index on request_correlation_id for support/auditing lookups
CREATE INDEX IF NOT EXISTS idx_scan_events_correlation ON public.scan_events(request_correlation_id);

-- 3. Automatic Log Deletion RPC
CREATE OR REPLACE FUNCTION public.delete_expired_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH expired_events AS (
    SELECT se.id
    FROM public.scan_events se
    JOIN public.workspaces w ON se.workspace_id = w.id
    WHERE se.created_at < (NOW() - (w.log_retention_days || ' days')::INTERVAL)
  )
  DELETE FROM public.scan_events
  WHERE id IN (SELECT id FROM expired_events);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Analytics Aggregation RPC
CREATE OR REPLACE FUNCTION public.get_workspace_analytics(
  p_workspace_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS TABLE (
  total_scans BIGINT,
  threats_blocked BIGINT,
  warnings BIGINT,
  allowed_scans BIGINT,
  avg_risk_score NUMERIC,
  avg_latency NUMERIC,
  provider_distribution JSON,
  attack_distribution JSON
) AS $$
BEGIN
  RETURN QUERY
  WITH current_events AS (
    SELECT * FROM public.scan_events
    WHERE workspace_id = p_workspace_id
      AND created_at >= p_start_date
      AND created_at < p_end_date
  ),
  provider_stats AS (
    SELECT 
      COALESCE(provider, 'Unknown') AS provider_name,
      COUNT(*) AS p_count,
      AVG(risk_score) AS p_risk,
      AVG(processing_time_ms) AS p_latency
    FROM current_events
    GROUP BY COALESCE(provider, 'Unknown')
  ),
  attack_stats AS (
    SELECT 
      td.category_id AS category,
      COUNT(*) AS a_count
    FROM current_events ce
    JOIN public.threat_detections td ON ce.id = td.scan_event_id
    GROUP BY td.category_id
  )
  SELECT 
    (SELECT COUNT(*) FROM current_events) AS total_scans,
    (SELECT COUNT(*) FROM current_events WHERE decision = 'BLOCK') AS threats_blocked,
    (SELECT COUNT(*) FROM current_events WHERE decision = 'WARN') AS warnings,
    (SELECT COUNT(*) FROM current_events WHERE decision = 'ALLOW') AS allowed_scans,
    (SELECT COALESCE(AVG(risk_score), 0) FROM current_events) AS avg_risk_score,
    (SELECT COALESCE(AVG(processing_time_ms), 0) FROM current_events) AS avg_latency,
    COALESCE((SELECT json_agg(json_build_object('provider', provider_name, 'count', p_count, 'avgRisk', p_risk, 'avgLatency', p_latency)) FROM provider_stats), '[]'::json) AS provider_distribution,
    COALESCE((SELECT json_agg(json_build_object('category', category, 'count', a_count)) FROM attack_stats), '[]'::json) AS attack_distribution;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable pg_cron for automatic cleanup (Requires pg_cron extension on Supabase)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup job to run daily at 00:00 UTC
-- Safe wrapper if the job already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily_log_cleanup') THEN
    PERFORM cron.schedule('daily_log_cleanup', '0 0 * * *', 'SELECT public.delete_expired_logs();');
  END IF;
END $$;
