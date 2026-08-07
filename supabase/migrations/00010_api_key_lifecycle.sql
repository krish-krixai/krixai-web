-- Migration: 00010_api_key_lifecycle.sql
-- Description: Updates api_keys table for real lifecycle (environment, scopes, status, expiry) and locks down RLS.

ALTER TABLE public.api_keys ADD COLUMN environment TEXT NOT NULL DEFAULT 'Production' CHECK (environment IN ('Production', 'Development'));
ALTER TABLE public.api_keys ADD COLUMN scopes JSONB NOT NULL DEFAULT '["Scan"]';
ALTER TABLE public.api_keys ADD COLUMN expires_at TIMESTAMPTZ;

-- Migrate is_active to status
ALTER TABLE public.api_keys ADD COLUMN status TEXT;
UPDATE public.api_keys SET status = CASE WHEN is_active THEN 'Active' ELSE 'Revoked' END;
ALTER TABLE public.api_keys ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.api_keys ALTER COLUMN status SET DEFAULT 'Active';
ALTER TABLE public.api_keys ADD CONSTRAINT check_api_key_status CHECK (status IN ('Active', 'Revoked', 'Disabled', 'Rotated'));

ALTER TABLE public.api_keys DROP COLUMN is_active;

-- Drop RLS modification policies to ensure only the Python backend (using service role or admin token) can create/modify keys.
DROP POLICY IF EXISTS "Users can insert workspace api keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update workspace api keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete workspace api keys" ON public.api_keys;
