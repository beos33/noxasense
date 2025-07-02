-- Fix sessions table schema issues

-- First, let's see what columns actually exist (without duplicates)
SELECT DISTINCT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
ORDER BY column_name;

-- Fix data types for screen dimensions
ALTER TABLE sessions ALTER COLUMN screen_width TYPE INTEGER USING screen_width::INTEGER;
ALTER TABLE sessions ALTER COLUMN screen_height TYPE INTEGER USING screen_height::INTEGER;

-- Add foreign key constraint for application_id (will fail if already exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'sessions_application_id_fkey' 
        AND table_name = 'sessions'
    ) THEN
        ALTER TABLE sessions ADD CONSTRAINT sessions_application_id_fkey 
        FOREIGN KEY (application_id) REFERENCES applications(application_id);
    END IF;
END $$;

-- Check for any duplicate columns and remove them if needed
-- (This would need to be done manually if duplicates exist)

-- Verify the final structure
SELECT DISTINCT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
ORDER BY column_name; 