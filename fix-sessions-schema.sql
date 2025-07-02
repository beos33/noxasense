-- Add missing columns to sessions table if they don't exist
-- Based on the documented schema

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS datetime TIMESTAMP WITH TIME ZONE;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_memory TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Check final structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
ORDER BY ordinal_position; 