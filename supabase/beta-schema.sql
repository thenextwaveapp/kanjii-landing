-- Beta Application System Schema
-- Run this in Supabase: SQL Editor → New query → Run

-- 1. Add beta-related columns to waitlist_signups
ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS beta_token uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS invited_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- Create index on beta_token for fast lookups
CREATE INDEX IF NOT EXISTS waitlist_signups_beta_token_idx ON public.waitlist_signups (beta_token);

-- 2. Create beta_applications table
CREATE TABLE IF NOT EXISTS public.beta_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid NOT NULL REFERENCES public.waitlist_signups(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  ios_device text NOT NULL,
  ios_version text,
  experience_level text,
  learning_goal text,
  study_commitment text,
  previous_study text,
  why_beta text NOT NULL,
  feedback_agreement boolean NOT NULL DEFAULT false,
  timezone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT beta_applications_signup_unique UNIQUE (signup_id)
);

-- Create index on signup_id for fast lookups
CREATE INDEX IF NOT EXISTS beta_applications_signup_id_idx ON public.beta_applications (signup_id);

-- Enable RLS on beta_applications
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

-- 3. Create RPC function to get signup by token
CREATE OR REPLACE FUNCTION public.get_signup_by_token(p_token uuid)
RETURNS TABLE (
  id uuid,
  email text,
  beta_token uuid,
  status text,
  has_application boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ws.id,
    ws.email,
    ws.beta_token,
    ws.status,
    EXISTS(SELECT 1 FROM public.beta_applications WHERE signup_id = ws.id) as has_application
  FROM public.waitlist_signups ws
  WHERE ws.beta_token = p_token;
END;
$$;

-- Grant execute permission on the RPC function
GRANT EXECUTE ON FUNCTION public.get_signup_by_token(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_signup_by_token(uuid) TO authenticated;
