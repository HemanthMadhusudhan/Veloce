-- THIS WILL FIX THE ORDERS AUTOMATICALLY DELETING ON REFRESH
-- It forcefully drops ALL broken webhooks/triggers on the orders table
-- that are causing the "42601 DEFAULT is not allowed" crash.

DO $$ 
DECLARE 
    trg RECORD;
BEGIN 
    -- Loop through all triggers on the 'orders' table
    FOR trg IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'orders' 
          AND trigger_schema = 'public'
    LOOP
        -- Dynamically drop each trigger
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.orders CASCADE', trg.trigger_name);
    END LOOP;
END $$;
