-- VELOCE DELETE USER FIX
-- Run this script in your Supabase SQL Editor to enable user deletion from the admin panel

-- 1. Create a secure function to delete users that can be called via RPC
CREATE OR REPLACE FUNCTION public.delete_user_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Check if the calling user is an admin
  SELECT (role = 'admin') INTO is_admin FROM public.users WHERE id = auth.uid();
  
  IF NOT coalesce(is_admin, false) THEN
    RAISE EXCEPTION 'Not authorized: only admins can delete users';
  END IF;

  -- Delete the user from auth.users (this should cascade to public.users if ON DELETE CASCADE is set)
  DELETE FROM auth.users WHERE id = target_user_id;

  -- Delete from public.users as a fallback
  DELETE FROM public.users WHERE id = target_user_id;
  
END;
$$;

-- 2. Ensure that foreign keys allow user deletion without constraint violations
-- We'll modify foreign keys to ON DELETE CASCADE for common tables if they exist
DO $$
BEGIN
    -- Update orders table if exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'orders') THEN
        ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
        ALTER TABLE public.orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;

    -- Update cart_items table if exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
        ALTER TABLE public.cart_items ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Update addresses table if exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'addresses') THEN
        ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
        ALTER TABLE public.addresses ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;

    -- Update reviews table if exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews') THEN
        ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
        ALTER TABLE public.reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
END $$;
