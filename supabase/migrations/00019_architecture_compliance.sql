-- TABLE: detection_logs
CREATE TABLE IF NOT EXISTS public.detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  request_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'blocked', 'flagged', 'error')),
  category TEXT,
  sub_type TEXT,
  confidence FLOAT,
  action_taken TEXT CHECK (action_taken IN ('block', 'flag', 'redact', 'pass')),
  scan_time_ms INTEGER,
  source_ip TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.detection_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workspace logs"
  ON public.detection_logs FOR SELECT
  USING (workspace_id IN (
    SELECT public.get_my_workspaces()
  ));

-- Logs are inserted by Python engine using service role key (bypasses RLS)
-- No INSERT policy needed for regular users

-- TABLE: custom_rules
CREATE TABLE IF NOT EXISTS public.custom_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('keyword', 'regex', 'semantic')),
  pattern TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'flag' CHECK (action IN ('block', 'flag', 'redact')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.custom_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rules"
  ON public.custom_rules FOR SELECT
  USING (workspace_id IN (
    SELECT public.get_my_workspaces()
  ));

CREATE POLICY "Users can manage own rules"
  ON public.custom_rules FOR ALL
  USING (workspace_id IN (
    SELECT public.get_my_admin_workspaces()
  ));
