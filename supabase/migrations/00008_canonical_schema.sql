-- Migration: 00008_canonical_schema.sql
-- Description: Enforces canonical 0-100 bounds on risk_score and risk_threshold across the system.

-- Enforce 0-100 for scan_events
ALTER TABLE public.scan_events 
ADD CONSTRAINT check_risk_score_bounds 
CHECK (risk_score >= 0 AND risk_score <= 100);

-- Enforce 0-100 for workspace_policies
ALTER TABLE public.workspace_policies 
ADD CONSTRAINT check_risk_threshold_bounds 
CHECK (risk_threshold >= 0 AND risk_threshold <= 100);
