-- Migration to add new analytics fields
-- Run this on your D1 database to add the new columns

-- Add country column
ALTER TABLE Analytics ADD COLUMN country TEXT;

-- Add referrer_source column
ALTER TABLE Analytics ADD COLUMN referrer_source TEXT;

-- Add referrer_url column
ALTER TABLE Analytics ADD COLUMN referrer_url TEXT;
