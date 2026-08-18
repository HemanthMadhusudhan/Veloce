-- Drop the trigger that is blocking orders from being placed
DROP TRIGGER IF EXISTS tr_order_stock ON orders;
DROP FUNCTION IF EXISTS handle_order_stock();
