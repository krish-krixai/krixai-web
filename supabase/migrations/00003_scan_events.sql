-- Migration: 00003_scan_events.sql
-- Description: Adds scan events and threat detections tables for persisting real KrixAI scan history.

-- 1. Create scan_events table
CREATE TABLE public.scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  api_key_id UUID NULL, -- Nullable, references API keys if implemented
  actor_user_id UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (source IN ('PLAYGROUND', 'API', 'SDK')),
  provider TEXT NULL,
  model TEXT NULL,
  prompt_preview TEXT NOT NULL,
  prompt_length INTEGER NOT NULL,
  full_prompt TEXT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('ALLOW', 'WARN', 'BLOCK')),
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  explanation_summary TEXT NOT NULL,
  processing_time_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create threat_detections table
CREATE TABLE public.threat_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_event_id UUID NOT NULL REFERENCES public.scan_events(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE, -- Denormalized for RLS
  category_id TEXT NOT NULL,
  display_label TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Medium', 'High', 'Critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Add Indexes for Performance
CREATE INDEX idx_scan_events_workspace_id ON public.scan_events(workspace_id);
CREATE INDEX idx_scan_events_created_at ON public.scan_events(created_at DESC);
CREATE INDEX idx_scan_events_decision ON public.scan_events(decision);
CREATE INDEX idx_threat_detections_scan_id ON public.threat_detections(scan_event_id);
CREATE INDEX idx_threat_detections_workspace_id ON public.threat_detections(workspace_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_detections ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for scan_events
-- Users can view scan events if they are members of the workspace
CREATE POLICY "Users can view scan events for their workspaces"
  ON public.scan_events FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

-- Insert is allowed for workspace members
CREATE POLICY "Users can insert scan events for their workspaces"
  ON public.scan_events FOR INSERT
  WITH CHECK (workspace_id IN (SELECT public.get_my_workspaces()));

-- 6. RLS Policies for threat_detections
CREATE POLICY "Users can view threat detections for their workspaces"
  ON public.threat_detections FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

CREATE POLICY "Users can insert threat detections for their workspaces"
  ON public.threat_detections FOR INSERT
  WITH CHECK (workspace_id IN (SELECT public.get_my_workspaces()));
