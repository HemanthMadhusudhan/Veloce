-- ==========================================
-- VELOCE ORDER REFUND TRIGGER
-- ==========================================

-- Create a function that refunds the user's wallet automatically 
-- if an order paid via wallet is cancelled by the admin.
CREATE OR REPLACE FUNCTION public.refund_wallet_on_cancel()
RETURNS trigger AS $$
BEGIN
  -- Check if the order status was just changed to 'cancelled'
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    
    -- Check if the payment method was 'wallet'
    IF NEW.payment->>'method' = 'wallet' THEN
      
      -- 1. Refund the user's wallet_balance in the users table
      UPDATE public.users 
      SET wallet_balance = COALESCE(wallet_balance, 0) + NEW.total
      WHERE id = NEW.user_id;

      -- 2. Insert a transaction log so the user sees the refund
      INSERT INTO public.wallet_transactions (user_id, amount, type, description)
      VALUES (
        NEW.user_id, 
        NEW.total, 
        'credit', 
        'Refund for cancelled order #' || substr(NEW.id::text, 1, 8)
      );
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger on the orders table
DROP TRIGGER IF EXISTS tr_refund_wallet_on_cancel ON public.orders;
CREATE TRIGGER tr_refund_wallet_on_cancel
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.refund_wallet_on_cancel();
