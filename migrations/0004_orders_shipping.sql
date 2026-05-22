-- Add shipping_address JSON column to Orders so we can ship physical books.
-- Stored as a JSON string with the AddressElement payload:
--   { "name": "...", "phone": "...", "address": { line1, line2, city, state, postal_code, country } }
-- The PaymentIntent API tries this column first and falls back to embedding
-- the address inside the existing items JSON if the column is missing.

ALTER TABLE Orders ADD COLUMN shipping_address TEXT;
