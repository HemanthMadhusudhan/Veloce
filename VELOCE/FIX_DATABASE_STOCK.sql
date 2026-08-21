-- ============================================================================
-- VELOCE WEAR: AUTOMATIC DATABASE STOCK MANAGEMENT (RPC + TRIGGER)
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This creates a SECURITY DEFINER function to allow customers (guests and users)
-- to reliably deduct product inventory when placing orders, bypassing RLS.
-- ============================================================================

-- 1. Create atomic RPC function callable directly from client or Edge functions
CREATE OR REPLACE FUNCTION deduct_product_stock(p_items jsonb)
RETURNS jsonb AS $$
DECLARE
  item jsonb;
  v_product_id text;
  v_qty int;
  v_size text;
  v_stock int;
  v_stock_by_size jsonb;
  v_new_total int;
  v_sizes jsonb;
  v_even_stock int;
  v_current_size_stock int;
  results jsonb := '[]'::jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := item->>'id';
    v_qty := COALESCE((item->>'qty')::int, 1);
    v_size := COALESCE(item->>'size', '');

    IF v_product_id IS NOT NULL AND v_product_id != '' THEN
      SELECT stock, COALESCE(stock_by_size::jsonb, '{}'::jsonb), COALESCE(to_jsonb(sizes), '[]'::jsonb) 
      INTO v_stock, v_stock_by_size, v_sizes
      FROM products WHERE id = v_product_id;
      
      IF FOUND THEN
        IF jsonb_typeof(v_stock_by_size) != 'object' THEN
          v_stock_by_size := '{}'::jsonb;
        END IF;

        IF v_stock_by_size = '{}'::jsonb AND jsonb_array_length(v_sizes) > 0 THEN
          v_even_stock := FLOOR(COALESCE(v_stock, 0) / jsonb_array_length(v_sizes));
          SELECT jsonb_object_agg(elem#>>'{}', v_even_stock) INTO v_stock_by_size FROM jsonb_array_elements(v_sizes) elem;
        END IF;

        IF v_size != '' AND v_stock_by_size != '{}'::jsonb THEN
          v_current_size_stock := COALESCE((v_stock_by_size->>v_size)::int, 0);
          v_stock_by_size := jsonb_set(v_stock_by_size, array[v_size], to_jsonb(GREATEST(0, v_current_size_stock - v_qty)));
          SELECT COALESCE(SUM(value::text::int), 0) INTO v_new_total FROM jsonb_each(v_stock_by_size);
        ELSE
          v_new_total := GREATEST(0, COALESCE(v_stock, 0) - v_qty);
        END IF;

        UPDATE products 
        SET stock = v_new_total, 
            stock_by_size = NULLIF(v_stock_by_size, '{}'::jsonb) 
        WHERE id = v_product_id;

        results := results || jsonb_build_object('id', v_product_id, 'new_stock', v_new_total, 'success', true);
      END IF;
    END IF;
  END LOOP;

  RETURN results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution permission to public & authenticated roles
GRANT EXECUTE ON FUNCTION deduct_product_stock(jsonb) TO anon, authenticated, service_role;

-- 2. Create Trigger Function on Orders table (fires on Order INSERT and UPDATE)
CREATE OR REPLACE FUNCTION handle_order_stock()
RETURNS TRIGGER AS $$
DECLARE
  item jsonb;
  v_product_id text;
  v_qty int;
  v_size text;
  v_stock int;
  v_stock_by_size jsonb;
  v_new_total int;
  v_sizes jsonb;
  v_even_stock int;
  v_current_size_stock int;
BEGIN
  -- When a new order is placed, deduct stock
  IF TG_OP = 'INSERT' THEN
    IF NEW.items IS NOT NULL AND jsonb_typeof(NEW.items) = 'array' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
      LOOP
        v_product_id := item->>'id';
        v_qty := COALESCE((item->>'qty')::int, 1);
        v_size := COALESCE(item->>'size', '');
        
        IF v_product_id IS NOT NULL AND v_product_id != '' THEN
          SELECT stock, COALESCE(stock_by_size::jsonb, '{}'::jsonb), COALESCE(to_jsonb(sizes), '[]'::jsonb) 
          INTO v_stock, v_stock_by_size, v_sizes
          FROM products WHERE id = v_product_id;
          
          IF FOUND THEN
            IF jsonb_typeof(v_stock_by_size) != 'object' THEN
              v_stock_by_size := '{}'::jsonb;
            END IF;

            IF v_stock_by_size = '{}'::jsonb AND jsonb_array_length(v_sizes) > 0 THEN
              v_even_stock := FLOOR(COALESCE(v_stock, 0) / jsonb_array_length(v_sizes));
              SELECT jsonb_object_agg(elem#>>'{}', v_even_stock) INTO v_stock_by_size FROM jsonb_array_elements(v_sizes) elem;
            END IF;
            
            IF v_size != '' AND v_stock_by_size != '{}'::jsonb THEN
              v_current_size_stock := COALESCE((v_stock_by_size->>v_size)::int, 0);
              v_stock_by_size := jsonb_set(v_stock_by_size, array[v_size], to_jsonb(GREATEST(0, v_current_size_stock - v_qty)));
              SELECT COALESCE(SUM(value::text::int), 0) INTO v_new_total FROM jsonb_each(v_stock_by_size);
            ELSE
              v_new_total := GREATEST(0, COALESCE(v_stock, 0) - v_qty);
            END IF;
            
            UPDATE products 
            SET stock = v_new_total, 
                stock_by_size = NULLIF(v_stock_by_size, '{}'::jsonb) 
            WHERE id = v_product_id;
          END IF;
        END IF;
      END LOOP;
    END IF;
    
  -- When an order is cancelled or refunded, restore stock
  ELSIF TG_OP = 'UPDATE' THEN
    IF (OLD.status != 'cancelled' AND NEW.status = 'cancelled') OR 
       (OLD.status != 'refunded' AND NEW.status = 'refunded') THEN
      IF NEW.items IS NOT NULL AND jsonb_typeof(NEW.items) = 'array' THEN
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
          v_product_id := item->>'id';
          v_qty := COALESCE((item->>'qty')::int, 1);
          v_size := COALESCE(item->>'size', '');
          
          IF v_product_id IS NOT NULL AND v_product_id != '' THEN
            SELECT stock, COALESCE(stock_by_size::jsonb, '{}'::jsonb) 
            INTO v_stock, v_stock_by_size 
            FROM products WHERE id = v_product_id;
            
            IF FOUND THEN
              IF jsonb_typeof(v_stock_by_size) != 'object' THEN
                v_stock_by_size := '{}'::jsonb;
              END IF;

              IF v_size != '' AND v_stock_by_size != '{}'::jsonb THEN
                v_current_size_stock := COALESCE((v_stock_by_size->>v_size)::int, 0);
                v_stock_by_size := jsonb_set(v_stock_by_size, array[v_size], to_jsonb(v_current_size_stock + v_qty));
                SELECT COALESCE(SUM(value::text::int), 0) INTO v_new_total FROM jsonb_each(v_stock_by_size);
              ELSE
                v_new_total := COALESCE(v_stock, 0) + v_qty;
              END IF;
              
              UPDATE products 
              SET stock = v_new_total, 
                  stock_by_size = NULLIF(v_stock_by_size, '{}'::jsonb) 
              WHERE id = v_product_id;
            END IF;
          END IF;
        END LOOP;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on orders
DROP TRIGGER IF EXISTS tr_order_stock ON orders;
CREATE TRIGGER tr_order_stock
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION handle_order_stock();
