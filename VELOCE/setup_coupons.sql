CREATE TABLE IF NOT EXISTS public.one_time_coupons (
    code TEXT PRIMARY KEY,
    is_used BOOLEAN DEFAULT false,
    used_by UUID REFERENCES auth.users(id),
    order_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.one_time_coupons ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the coupons to check validity
CREATE POLICY "Allow public read access on one_time_coupons" ON public.one_time_coupons
    FOR SELECT TO public
    USING (true);

-- Allow authenticated users to update the coupon when they use it during checkout
CREATE POLICY "Allow authenticated update on one_time_coupons" ON public.one_time_coupons
    FOR UPDATE TO authenticated
    USING (true);

-- Allow anonymous users to update the coupon (if they checkout as guest)
CREATE POLICY "Allow anon update on one_time_coupons" ON public.one_time_coupons
    FOR UPDATE TO anon
    USING (true);

-- Allow inserts (for the script to populate them, though ideally done via service key)
CREATE POLICY "Allow anon insert on one_time_coupons" ON public.one_time_coupons
    FOR INSERT TO public
    WITH CHECK (true);
