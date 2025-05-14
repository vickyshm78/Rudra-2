/*
  # Create admin user

  1. Creates extension for password encryption
  2. Creates admin user in auth.users table
  3. Assigns super_admin role
*/

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to insert the admin user
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Insert the admin user and get the ID
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@99carmart.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    '{"provider":"email","providers":["email"]}',
    '{}'
  )
  RETURNING id INTO new_user_id;

  -- Create the admin role
  IF new_user_id IS NOT NULL THEN
    INSERT INTO admins (user_id, role)
    VALUES (new_user_id, 'super_admin');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_admin_user();

-- Drop the function as it's no longer needed
DROP FUNCTION create_admin_user();