-- 1. FIX ADMIN WALLET UPDATE PERMISSION
-- The previous policy only allowed users to update their OWN wallet. We need admins to be able to update ANY user's wallet!
DROP POLICY IF EXISTS "Admins can update any profile" ON "public"."users";
CREATE POLICY "Admins can update any profile" ON "public"."users"
AS PERMISSIVE FOR UPDATE
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.users admin_users 
    WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users admin_users 
    WHERE admin_users.id = auth.uid() AND admin_users.role = 'admin'
  )
  OR (auth.jwt() ->> 'email' = 'hemanthmadhusudhan@gmail.com')
);

-- 2. FIX SIGNUP BONUS FOR NEW USERS
-- This updates the trigger that runs when a user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert the new user into public.users with a 500rs signup bonus
  INSERT INTO public.users (id, full_name, wallet_balance)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 500);

  -- Log the 500rs signup bonus in the transactions table so it shows up in their history!
  INSERT INTO public.wallet_transactions (user_id, amount, type, description)
  VALUES (new.id, 500, 'credit', 'Signup Bonus');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger just in case it was missing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
