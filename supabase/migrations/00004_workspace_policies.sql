-- Migration: 00004_workspace_policies.sql
-- Description: Adds workspace_policies table and extends scan_events with policy context.

-- 1. Create workspace_policies table
CREATE TABLE public.workspace_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('ALLOW', 'WARN', 'BLOCK')),
  risk_threshold INTEGER NOT NULL,
  provider_scope TEXT NOT NULL,
  priority INTEGER NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Alter scan_events table to capture policy evaluation
ALTER TABLE public.scan_events ADD COLUMN core_decision TEXT CHECK (core_decision IN ('ALLOW', 'WARN', 'BLOCK'));
ALTER TABLE public.scan_events ADD COLUMN matched_policy_id UUID NULL REFERENCES public.workspace_policies(id) ON DELETE SET NULL;
ALTER TABLE public.scan_events ADD COLUMN matched_policy_name TEXT NULL;

-- 3. Add Indexes for Performance
CREATE INDEX idx_workspace_policies_workspace_id ON public.workspace_policies(workspace_id);
CREATE INDEX idx_workspace_policies_priority ON public.workspace_policies(priority);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.workspace_policies ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for workspace_policies
-- Users can view policies if they are members of the workspace
CREATE POLICY "Users can view workspace policies for their workspaces"
  ON public.workspace_policies FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

-- Only OWNERs and ADMINs can insert/update/delete policies
CREATE POLICY "Owners and Admins can insert policies"
  ON public.workspace_policies FOR INSERT
  WITH CHECK (workspace_id IN (SELECT public.get_my_admin_workspaces()));

CREATE POLICY "Owners and Admins can update policies"
  ON public.workspace_policies FOR UPDATE
  USING (workspace_id IN (SELECT public.get_my_admin_workspaces()));

CREATE POLICY "Owners and Admins can delete policies"
  ON public.workspace_policies FOR DELETE
  USING (workspace_id IN (SELECT public.get_my_admin_workspaces()));

-- 6. Updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_workspace_policies_updated
  BEFORE UPDATE ON public.workspace_policies
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
