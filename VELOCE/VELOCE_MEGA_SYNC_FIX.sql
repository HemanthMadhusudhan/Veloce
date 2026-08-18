-- ==========================================
-- VELOCE MEGA SYNC FIX
-- ==========================================
-- This script permanently resolves all sync issues 
-- (Cart deletions, Orders disappearing, Wallet Sync)

-- ------------------------------------------
-- 1. FIX USERS TABLE POLICIES (Cart/Wishlist Sync)
-- ------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON "public"."users";
DROP POLICY IF EXISTS "Users can update own profile" ON "public"."users";
DROP POLICY IF EXISTS "Admins can view any profile" ON "public"."users";
DROP POLICY IF EXISTS "Admins can update any profile" ON "public"."users";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."users";
DROP POLICY IF EXISTS "Enable update for users based on email" ON "public"."users";
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."users";
DROP POLICY IF EXISTS "Users can update own wallet" ON "public"."users";

CREATE POLICY "Users can read own profile" ON "public"."users"
AS PERMISSIVE FOR SELECT TO public
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON "public"."users"
AS PERMISSIVE FOR UPDATE TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON "public"."users"
AS PERMISSIVE FOR SELECT TO public
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

CREATE POLICY "Admins can update all profiles" ON "public"."users"
AS PERMISSIVE FOR UPDATE TO public
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

-- ------------------------------------------
-- 2. FIX ORDERS TABLE POLICIES (Orders Sync)
-- ------------------------------------------
DROP POLICY IF EXISTS "Users can insert own orders" ON "public"."orders";
DROP POLICY IF EXISTS "Users can view own orders" ON "public"."orders";
DROP POLICY IF EXISTS "Users can update own orders" ON "public"."orders";
DROP POLICY IF EXISTS "Admins can view all orders" ON "public"."orders";
DROP POLICY IF EXISTS "Admins can update all orders" ON "public"."orders";

-- Users can insert their own orders, OR guest orders (user_id IS NULL)
CREATE POLICY "Users can insert own orders" ON "public"."orders"
AS PERMISSIVE FOR INSERT TO public
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON "public"."orders"
AS PERMISSIVE FOR SELECT TO public
USING (user_id = auth.uid());

-- Users can update their own orders (if needed for cancellations)
CREATE POLICY "Users can update own orders" ON "public"."orders"
AS PERMISSIVE FOR UPDATE TO public
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can view/update all orders
CREATE POLICY "Admins can view all orders" ON "public"."orders"
AS PERMISSIVE FOR SELECT TO public
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

CREATE POLICY "Admins can update all orders" ON "public"."orders"
AS PERMISSIVE FOR UPDATE TO public
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

CREATE POLICY "Admins can delete all orders" ON "public"."orders"
AS PERMISSIVE FOR DELETE TO public
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);


-- ------------------------------------------
-- 3. FIX WALLET TRANSACTIONS POLICIES
-- ------------------------------------------
DROP POLICY IF EXISTS "Users can view own wallet transactions" ON "public"."wallet_transactions";
DROP POLICY IF EXISTS "Admins can view all wallet transactions" ON "public"."wallet_transactions";

CREATE POLICY "Users can view own wallet transactions" ON "public"."wallet_transactions"
AS PERMISSIVE FOR SELECT TO public
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all wallet transactions" ON "public"."wallet_transactions"
AS PERMISSIVE FOR SELECT TO public
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);
