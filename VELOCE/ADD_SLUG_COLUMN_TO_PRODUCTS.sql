-- Run this in your Supabase SQL Editor if you want to store slugs directly in your database:
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS has_video boolean DEFAULT false;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS has_360 boolean DEFAULT false;

-- Notify Supabase PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
https://127.0.0.1:59301/static/artifacts/96832465-77ab-46a2-8384-01be0a29bda2/.user_uploaded/media_1787317757078.png?csrf=553f207f-da27-430e-88d9-364863b026b4