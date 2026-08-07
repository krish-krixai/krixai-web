-- Migration: 00007_api_keys.sql
-- Description: Adds api_keys table mapped to workspace_id.

CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_api_keys_workspace ON public.api_keys(workspace_id);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workspace api keys"
  ON public.api_keys FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

CREATE POLICY "Users can insert workspace api keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (workspace_id IN (SELECT public.get_my_admin_workspaces()));

CREATE POLICY "Users can update workspace api keys"
  ON public.api_keys FOR UPDATE
  USING (workspace_id IN (SELECT public.get_my_admin_workspaces()));

CREATE POLICY "Users can delete workspace api keys"
  ON public.api_keys FOR DELETE
  USING (workspace_id IN (SELECT public.get_my_admin_workspaces()));
