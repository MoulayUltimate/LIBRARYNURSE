-- Add paypal_order_id column to Orders table
ALTER TABLE Orders ADD COLUMN paypal_order_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_paypal_order_id ON Orders(paypal_order_id);
