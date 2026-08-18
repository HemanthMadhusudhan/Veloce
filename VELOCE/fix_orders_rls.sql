-- 1. Enable RLS on the orders table (just in case it's off, though 42501 means it's on)
ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing insert policies that might be blocking the insert
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."orders";
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON "public"."orders";
DROP POLICY IF EXISTS "Enable insert for anyone" ON "public"."orders";
DROP POLICY IF EXISTS "Enable insert for public" ON "public"."orders";

-- 3. Create a permissive INSERT policy that allows BOTH guests (user_id IS NULL) and logged-in users to place orders
CREATE POLICY "Enable insert for public" ON "public"."orders"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (
  -- Either they are a guest (user_id is null) OR they are inserting for themselves
  user_id IS NULL OR auth.uid() = user_id
);

-- 4. Ensure users can read their own orders and admins can read all orders
DROP POLICY IF EXISTS "Enable select for users" ON "public"."orders";
CREATE POLICY "Enable select for users" ON "public"."orders"
AS PERMISSIVE FOR SELECT
TO public
USING (
  -- User can see their own orders
  auth.uid() = user_id
  OR
  -- Admins can see all orders
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com')
);

-- 5. Enable UPDATE for admins so they can change order status
DROP POLICY IF EXISTS "Enable update for admins" ON "public"."orders";
CREATE POLICY "Enable update for admins" ON "public"."orders"
AS PERMISSIVE FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com')
);
