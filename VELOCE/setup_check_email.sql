-- Run this in your Supabase SQL Editor to allow the frontend to check if an email exists for the step-by-step auth flow.
-- It uses SECURITY DEFINER to securely read from auth.users without exposing other data.

CREATE OR REPLACE FUNCTION check_user_exists(lookup_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = lookup_email
  );
END;
$$;
