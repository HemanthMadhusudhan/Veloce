-- ============================================================================
-- VELOCE WEAR: COMPLETE ADMIN PANEL & DATABASE USERS SYNC FIX
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ============================================================================

-- 1. Ensure `users` table has all required columns
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  role text DEFAULT 'user',
  disabled boolean DEFAULT false,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  country text DEFAULT 'India',
  cart jsonb DEFAULT '[]'::jsonb,
  wishlist jsonb DEFAULT '[]'::jsonb,
  wallet_balance numeric DEFAULT 200,
  created_at timestamptz DEFAULT NOW()
);

-- Ensure columns exist if table was already created earlier
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS disabled boolean DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address_line1 text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address_line2 text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS postal_code text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country text DEFAULT 'India';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cart jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS wishlist jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 200;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT NOW();

-- 2. Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop all outdated/conflicting user policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view any profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.users;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.users;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;

-- User Policies:
-- Users can read their own profile OR Admins can read all profiles
CREATE POLICY "Users and Admins can read profiles" ON public.users
AS PERMISSIVE FOR SELECT TO public
USING (
  auth.uid() = id 
  OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

-- Users can insert their own profile upon signup
CREATE POLICY "Users can insert own profile" ON public.users
AS PERMISSIVE FOR INSERT TO public
WITH CHECK (
  auth.uid() = id 
  OR auth.uid() IS NOT NULL
  OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

-- Users can update their own profile OR Admins can update any profile
CREATE POLICY "Users and Admins can update profiles" ON public.users
AS PERMISSIVE FOR UPDATE TO public
USING (
  auth.uid() = id 
  OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
)
WITH CHECK (
  auth.uid() = id 
  OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

-- Admins can delete users
CREATE POLICY "Admins can delete profiles" ON public.users
AS PERMISSIVE FOR DELETE TO public
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

-- 3. Automatic Auth -> Public Users Synchronization Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role text := 'user';
  v_name text := '';
BEGIN
  IF LOWER(COALESCE(new.email, '')) = 'hemanthmadhusudhan@gmail.com' THEN
    v_role := 'admin';
  END IF;

  v_name := COALESCE(
    new.raw_user_meta_data->>'fullName',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    ''
  );

  INSERT INTO public.users (id, email, full_name, role, disabled, wallet_balance, created_at)
  VALUES (
    new.id,
    new.email,
    v_name,
    v_role,
    false,
    200,
    COALESCE(new.created_at, NOW())
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN public.users.full_name IS NULL OR public.users.full_name = '' THEN EXCLUDED.full_name ELSE public.users.full_name END;

  -- Create welcome bonus transaction record if wallet_transactions table exists
  BEGIN
    INSERT INTO public.wallet_transactions (user_id, amount, type, description)
    VALUES (new.id, 200, 'credit', 'Signup Welcome Bonus');
  EXCEPTION WHEN OTHERS THEN
    -- Ignore if table doesn't exist yet
  END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Backfill ALL existing auth.users into public.users so old/new signups show up in Admin
INSERT INTO public.users (id, email, full_name, role, disabled, wallet_balance, created_at)
SELECT
  id,
  COALESCE(email, ''),
  COALESCE(raw_user_meta_data->>'fullName', raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  CASE WHEN LOWER(COALESCE(email, '')) = 'hemanthmadhusudhan@gmail.com' THEN 'admin' ELSE 'user' END,
  false,
  200,
  COALESCE(created_at, NOW())
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = CASE WHEN public.users.full_name IS NULL OR public.users.full_name = '' THEN EXCLUDED.full_name ELSE public.users.full_name END;

-- Promote owner email to admin automatically
UPDATE public.users
SET role = 'admin'
WHERE LOWER(email) = 'hemanthmadhusudhan@gmail.com';

-- 5. Delete User Admin Function (RPC)
CREATE OR REPLACE FUNCTION delete_user_admin(target_user_id uuid)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'admin' OR email = 'hemanthmadhusudhan@gmail.com')
  ) AND auth.jwt() ->> 'email' <> 'hemanthmadhusudhan@gmail.com' THEN
    RAISE EXCEPTION 'Forbidden: only admins can delete users';
  END IF;

  DELETE FROM public.users WHERE id = target_user_id;
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION delete_user_admin(uuid) TO anon, authenticated, service_role;

-- 6. Enable Realtime Replication on users and orders
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
EXCEPTION WHEN OTHERS THEN
  -- Table may already be in publication
END;

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN OTHERS THEN
  -- Table may already be in publication
END;
