-- 1. Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);


-- 2. Create Workspaces Table
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;


-- 3. Create Workspace Members Table
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'DEVELOPER', 'VIEWER')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING')),
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(workspace_id, user_id)
);

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;


-- 4. Security Definer Functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_my_workspaces()
RETURNS SETOF uuid AS $$
  SELECT workspace_id 
  FROM public.workspace_members 
  WHERE user_id = auth.uid() AND status = 'ACTIVE';
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_my_admin_workspaces()
RETURNS SETOF uuid AS $$
  SELECT workspace_id 
  FROM public.workspace_members 
  WHERE user_id = auth.uid() 
  AND role IN ('OWNER', 'ADMIN') 
  AND status = 'ACTIVE';
$$ LANGUAGE sql SECURITY DEFINER;

-- 5. RLS for Workspaces & Workspace Members

-- Users can view workspaces they are members of (or created)
CREATE POLICY "Users can view their workspaces"
  ON public.workspaces FOR SELECT
  USING (
    created_by = auth.uid() OR
    id IN (SELECT public.get_my_workspaces())
  );

-- Only OWNERs and ADMINs can update workspaces
CREATE POLICY "Owners and Admins can update their workspaces"
  ON public.workspaces FOR UPDATE
  USING (id IN (SELECT public.get_my_admin_workspaces()));

-- Users can insert workspaces (creating a new workspace)
CREATE POLICY "Users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can view workspace members if they are a member of that workspace
-- Users can view workspace members if they are a member of that workspace
CREATE POLICY "Users can view members of their workspaces"
  ON public.workspace_members FOR SELECT
  USING (workspace_id IN (SELECT public.get_my_workspaces()));

-- Users can insert themselves as OWNER when creating a workspace (done via trigger or app logic)
-- Since they create it, we allow inserts where user_id = auth.uid()
CREATE POLICY "Users can insert their own initial membership"
  ON public.workspace_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND role = 'OWNER' 
  );

-- Only OWNERs and ADMINs can update/delete members or invite new ones
CREATE POLICY "Owners and Admins can insert members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (workspace_id IN (SELECT public.get_my_admin_workspaces()));

CREATE POLICY "Owners and Admins can update members"
  ON public.workspace_members FOR UPDATE
  USING (workspace_id IN (SELECT public.get_my_admin_workspaces()));

CREATE POLICY "Owners and Admins can delete members"
  ON public.workspace_members FOR DELETE
  USING (workspace_id IN (SELECT public.get_my_admin_workspaces()));

-- 6. Trigger to automatically create a Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
