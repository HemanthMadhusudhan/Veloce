-- ==========================================
-- VELOCE SITE SETTINGS FIX
-- ==========================================

-- Allow admins to manage site settings (e.g. Hot Selling Kits)
DROP POLICY IF EXISTS "Admins can manage site_settings" ON "public"."site_settings";

CREATE POLICY "Admins can manage site_settings" ON "public"."site_settings"
AS PERMISSIVE FOR ALL TO public
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Allow anyone to read site settings
DROP POLICY IF EXISTS "Anyone can read site_settings" ON "public"."site_settings";

CREATE POLICY "Anyone can read site_settings" ON "public"."site_settings"
AS PERMISSIVE FOR SELECT TO public
USING (true);
