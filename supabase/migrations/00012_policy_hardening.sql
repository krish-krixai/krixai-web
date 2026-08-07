-- Migration: 00012_policy_hardening.sql
-- Description: Adds versioning, audit trails, and strict validation to workspace_policies.

-- 1. Add version column and check constraints to workspace_policies
ALTER TABLE public.workspace_policies 
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

ALTER TABLE public.workspace_policies 
  DROP CONSTRAINT IF EXISTS chk_risk_threshold;

ALTER TABLE public.workspace_policies 
  ADD CONSTRAINT chk_risk_threshold CHECK (risk_threshold >= 0 AND risk_threshold <= 100);

-- 2. Create Audit Table
CREATE TABLE IF NOT EXISTS public.workspace_policies_audit (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('INSERT', 'UPDATE', 'DELETE')),
  name TEXT,
  action TEXT,
  risk_threshold INTEGER,
  version INTEGER,
  actor_id UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying audit logs by workspace and policy
CREATE INDEX IF NOT EXISTS idx_workspace_policies_audit_workspace ON public.workspace_policies_audit(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_policies_audit_policy ON public.workspace_policies_audit(policy_id);

-- 3. Enable RLS on audit table
ALTER TABLE public.workspace_policies_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view policy audits for their workspaces" ON public.workspace_policies_audit;

CREATE POLICY "Users can view policy audits for their workspaces"
  ON public.workspace_policies_audit FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

-- 4. Create Audit Trigger Function
CREATE OR REPLACE FUNCTION public.handle_policy_audit()
RETURNS trigger AS $$
DECLARE
  v_actor_id UUID;
BEGIN
  v_actor_id := auth.uid();

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.workspace_policies_audit(policy_id, workspace_id, action_type, name, action, risk_threshold, version, actor_id)
    VALUES (NEW.id, NEW.workspace_id, 'INSERT', NEW.name, NEW.action, NEW.risk_threshold, NEW.version, v_actor_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.version = OLD.version + 1;
    INSERT INTO public.workspace_policies_audit(policy_id, workspace_id, action_type, name, action, risk_threshold, version, actor_id)
    VALUES (NEW.id, NEW.workspace_id, 'UPDATE', NEW.name, NEW.action, NEW.risk_threshold, NEW.version, v_actor_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.workspace_policies_audit(policy_id, workspace_id, action_type, name, action, risk_threshold, version, actor_id)
    VALUES (OLD.id, OLD.workspace_id, 'DELETE', OLD.name, OLD.action, OLD.risk_threshold, OLD.version, v_actor_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Trigger
DROP TRIGGER IF EXISTS on_workspace_policy_change ON public.workspace_policies;

CREATE TRIGGER on_workspace_policy_change
  BEFORE INSERT OR UPDATE OR DELETE ON public.workspace_policies
  FOR EACH ROW EXECUTE PROCEDURE public.handle_policy_audit();
