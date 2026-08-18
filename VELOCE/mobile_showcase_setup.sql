-- SQL Setup Script for Mobile Premium Video Showcase
-- Run this script in your Supabase SQL Editor

-- 1. Create the videos table
CREATE TABLE IF NOT EXISTS public.mobile_showcase_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    video_url TEXT NOT NULL,
    product_name TEXT,
    product_link TEXT,
    collection_name TEXT,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    auto_play BOOLEAN DEFAULT true,
    loop BOOLEAN DEFAULT true,
    muted BOOLEAN DEFAULT true,
    show_product_name BOOLEAN DEFAULT true,
    show_shop_now BOOLEAN DEFAULT true
);

-- Enable RLS for videos
ALTER TABLE public.mobile_showcase_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active videos
CREATE POLICY "Public can view active mobile showcase videos" 
ON public.mobile_showcase_videos 
FOR SELECT 
USING (active = true);

-- Allow authenticated users (Admins) full access
CREATE POLICY "Admins have full access to mobile showcase videos" 
ON public.mobile_showcase_videos 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 2. Create the settings table (Single row configuration)
CREATE TABLE IF NOT EXISTS public.mobile_showcase_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    heading TEXT DEFAULT 'Crafted in Every Detail',
    subtitle TEXT DEFAULT 'Experience the ultimate quality.',
    card_width TEXT DEFAULT '85vw',
    card_height TEXT DEFAULT 'auto',
    border_radius TEXT DEFAULT '16px',
    space_between TEXT DEFAULT '16px',
    auto_scroll_speed INTEGER DEFAULT 0,
    enable_on_mobile BOOLEAN DEFAULT true
);

-- Insert default settings row if it doesn't exist
INSERT INTO public.mobile_showcase_settings (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for settings
ALTER TABLE public.mobile_showcase_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Public can view mobile showcase settings" 
ON public.mobile_showcase_settings 
FOR SELECT 
USING (true);

-- Allow authenticated users (Admins) full access
CREATE POLICY "Admins have full access to mobile showcase settings" 
ON public.mobile_showcase_settings 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Ensure the site-images bucket is accessible
-- (Assuming it's already created based on existing site features, but just in case)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;
