-- Add device_type column to Analytics table if it doesn't exist
-- Note: SQLite doesn't support IF NOT EXISTS for ADD COLUMN directly in standard standard, 
-- but D1 supports it or we can ignore the error if it fails on second run.
-- However, for D1 safe migrations, we just run the alter.

ALTER TABLE Analytics ADD COLUMN device_type TEXT;
