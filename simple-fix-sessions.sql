-- Simple fix for sessions table schema

-- Fix data types for screen dimensions
ALTER TABLE sessions ALTER COLUMN screen_width TYPE INTEGER USING screen_width::INTEGER;
ALTER TABLE sessions ALTER COLUMN screen_height TYPE INTEGER USING screen_height::INTEGER;

-- Check current structure
SELECT DISTINCT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
ORDER BY column_name; 