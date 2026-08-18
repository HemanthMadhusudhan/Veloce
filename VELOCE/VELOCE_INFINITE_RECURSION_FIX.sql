-- ==========================================
-- VELOCE INFINITE RECURSION FIX
-- ==========================================
-- This script fixes the infinite recursion caused by the previous policies on the users table.

-- 1. Create a SECURITY DEFINER function to safely check admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
    OR (current_setting('request.jwt.claims', true)::jsonb ->> 'email' = 'hemanthmadhusudhan@gmail.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Users can read own profile" ON "public"."users";
DROP POLICY IF EXISTS "Users can update own profile" ON "public"."users";
DROP POLICY IF EXISTS "Admins can read all profiles" ON "public"."users";
DROP POLICY IF EXISTS "Admins can update all profiles" ON "public"."users";

-- 3. Recreate the policies safely
CREATE POLICY "Users can read own profile" ON "public"."users"
AS PERMISSIVE FOR SELECT TO public
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON "public"."users"
AS PERMISSIVE FOR UPDATE TO public
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- 4. Fix orders policies too just in case
DROP POLICY IF EXISTS "Admins can view all orders" ON "public"."orders";
DROP POLICY IF EXISTS "Admins can update all orders" ON "public"."orders";
DROP POLICY IF EXISTS "Admins can delete all orders" ON "public"."orders";

CREATE POLICY "Admins can view all orders" ON "public"."orders"
AS PERMISSIVE FOR SELECT TO public
USING (public.is_admin());

CREATE POLICY "Admins can update all orders" ON "public"."orders"
AS PERMISSIVE FOR UPDATE TO public
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete all orders" ON "public"."orders"
AS PERMISSIVE FOR DELETE TO public
USING (public.is_admin());

-- 5. Fix wallet transactions policies too
DROP POLICY IF EXISTS "Admins can view all wallet transactions" ON "public"."wallet_transactions";

CREATE POLICY "Admins can view all wallet transactions" ON "public"."wallet_transactions"
AS PERMISSIVE FOR SELECT TO public
USING (public.is_admin());
