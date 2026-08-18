-- This fixes the cart refusing to delete items (cart sync bug)
CREATE POLICY "Users can update their own profile" ON "public"."users"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
