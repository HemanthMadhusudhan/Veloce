-- 1. ADD DELETE PERMISSION TO ORDERS
-- This allows you to delete orders from the Admin Panel or User Account without them "coming back" on refresh.
DROP POLICY IF EXISTS "Enable delete for users" ON "public"."orders";
CREATE POLICY "Enable delete for users" ON "public"."orders"
AS PERMISSIVE FOR DELETE
TO public
USING (
  -- Users can delete their own orders (if you want them to be able to)
  auth.uid() = user_id
  OR
  -- Admins can delete any order
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com')
);

-- 2. ADD UPDATE PERMISSION TO USERS (for Cart Sync)
-- This fixes the issue where items re-appear in the cart after being deleted.
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."users";
CREATE POLICY "Users can update their own profile" ON "public"."users"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
