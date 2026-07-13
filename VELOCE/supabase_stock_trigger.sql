-- Run this SQL in your Supabase SQL Editor to automatically handle inventory!
-- It runs with "SECURITY DEFINER" to bypass RLS, so guests and normal users 
-- can successfully deduct stock when they place orders, and stock is restored 
-- when an admin rejects/cancels the order.

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
  -- When a new order is placed
  IF TG_OP = 'INSERT' THEN
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
      v_product_id := item->>'id';
      v_qty := (item->>'qty')::int;
      v_size := item->>'size';
      
      SELECT stock, COALESCE(stock_by_size, '{}'::jsonb), COALESCE(sizes, '[]'::jsonb) 
      INTO v_stock, v_stock_by_size, v_sizes
      FROM products WHERE id = v_product_id;
      
      -- Initialize stock_by_size if it is empty and sizes exist
      IF jsonb_typeof(v_stock_by_size) = 'object' AND v_stock_by_size = '{}'::jsonb AND jsonb_array_length(v_sizes) > 0 THEN
        v_even_stock := FLOOR(v_stock / jsonb_array_length(v_sizes));
        SELECT jsonb_object_agg(elem#>>'{}', v_even_stock) INTO v_stock_by_size FROM jsonb_array_elements(v_sizes) elem;
      END IF;
      
      -- Deduct from specific size
      v_current_size_stock := COALESCE((v_stock_by_size->>v_size)::int, v_stock);
      v_stock_by_size := jsonb_set(v_stock_by_size, array[v_size], to_jsonb(GREATEST(0, v_current_size_stock - v_qty)));
      
      -- Calculate new total stock
      SELECT COALESCE(SUM(value::text::int), 0) INTO v_new_total FROM jsonb_each(v_stock_by_size);
      IF v_new_total = 0 AND jsonb_typeof(v_stock_by_size) = 'object' AND v_stock_by_size = '{}'::jsonb THEN
         v_new_total := GREATEST(0, v_stock - v_qty);
      END IF;
      
      -- Update the products table
      UPDATE products SET stock = v_new_total, stock_by_size = NULLIF(v_stock_by_size, '{}'::jsonb) WHERE id = v_product_id;
    END LOOP;
    
  -- When an order status is updated (e.g. Cancelled/Rejected)
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
      LOOP
        v_product_id := item->>'id';
        v_qty := (item->>'qty')::int;
        v_size := item->>'size';
        
        SELECT stock, COALESCE(stock_by_size, '{}'::jsonb) INTO v_stock, v_stock_by_size FROM products WHERE id = v_product_id;
        
        -- Restore stock for specific size
        v_current_size_stock := COALESCE((v_stock_by_size->>v_size)::int, v_stock);
        v_stock_by_size := jsonb_set(v_stock_by_size, array[v_size], to_jsonb(v_current_size_stock + v_qty));
        
        -- Calculate new total stock
        SELECT COALESCE(SUM(value::text::int), 0) INTO v_new_total FROM jsonb_each(v_stock_by_size);
        IF v_new_total = 0 AND jsonb_typeof(v_stock_by_size) = 'object' AND v_stock_by_size = '{}'::jsonb THEN
           v_new_total := v_stock + v_qty;
        END IF;
        
        -- Update the products table
        UPDATE products SET stock = v_new_total, stock_by_size = NULLIF(v_stock_by_size, '{}'::jsonb) WHERE id = v_product_id;
      END LOOP;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists so we can recreate it
DROP TRIGGER IF EXISTS tr_order_stock ON orders;

-- Create the trigger to fire after an order is inserted or updated
CREATE TRIGGER tr_order_stock
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION handle_order_stock();
