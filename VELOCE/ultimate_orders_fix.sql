-- 1. Fix the ID column so it generates a UUID automatically (Fixes the "DEFAULT is not allowed" error)
ALTER TABLE "public"."orders" ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Ensure Row Level Security is enabled
ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;

-- 3. Drop ALL existing policies on the orders table to prevent conflicts and errors
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'orders' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', pol.policyname);
    END LOOP;
END $$;

-- 4. Create a single, guaranteed INSERT policy (Fixes the silent disappearance of orders)
CREATE POLICY "Orders Insert Policy" ON "public"."orders"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

-- 5. Create SELECT policy (Users see their own, Admins see all)
CREATE POLICY "Orders Select Policy" ON "public"."orders"
AS PERMISSIVE FOR SELECT
TO public
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);

-- 6. Create UPDATE policy (Only Admins can update status)
CREATE POLICY "Orders Update Policy" ON "public"."orders"
AS PERMISSIVE FOR UPDATE
TO public
USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
  OR auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com'
);
