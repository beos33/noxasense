-- Check current pageviews table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pageviews' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
-- (Run these one by one to avoid errors if columns already exist)

-- Session information columns
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS browser_version TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS screen_width INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS screen_height INTEGER;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS device_memory FLOAT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Performance metrics columns
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS visible_duration FLOAT;
ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS tti FLOAT;

-- Check final structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pageviews' 
ORDER BY ordinal_position; 