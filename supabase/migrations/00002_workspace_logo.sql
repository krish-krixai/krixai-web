-- 1. Add logo_url column to workspaces
ALTER TABLE public.workspaces 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Create the Storage Bucket for workspace logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('workspace-logos', 'workspace-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS Policies

-- Allow public read access to all logos
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'workspace-logos');

-- Allow authenticated users to upload logos
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
CREATE POLICY "Authenticated users can upload logos" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'workspace-logos');

-- Allow authenticated users to update their uploaded logos
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;
CREATE POLICY "Authenticated users can update logos" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'workspace-logos');

-- Allow authenticated users to delete logos
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;
CREATE POLICY "Authenticated users can delete logos" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'workspace-logos');
