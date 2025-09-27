-- Add key_name field to user_api_keys table
ALTER TABLE user_api_keys ADD COLUMN IF NOT EXISTS key_name TEXT;

-- Update the unique constraint to allow multiple keys per service with different names
-- First drop the existing constraint
ALTER TABLE user_api_keys DROP CONSTRAINT IF EXISTS user_api_keys_user_id_service_name_key;

-- Add new constraint that allows multiple keys per service
-- (We'll handle uniqueness in the application layer for now)
