/*
  # Update Admin User Email and Fix Constraints

  1. Changes
    - Update admin email to rudragroupshm@gmail.com
    - Fix unique constraint issues
    - Ensure proper admin role creation
*/

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admins table if not exists
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint to user_id if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'admins_user_id_key'
  ) THEN
    ALTER TABLE admins ADD CONSTRAINT admins_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS admins_user_id_idx ON admins(user_id);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can read admin data" ON admins;
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;

-- Admins can read admin data
CREATE POLICY "Admins can read admin data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid()
    )
  );

-- Super admins can manage other admins
CREATE POLICY "Super admins can manage admins"
  ON admins
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() 
      AND a.role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins a 
      WHERE a.user_id = auth.uid() 
      AND a.role = 'super_admin'
    )
  );

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS update_admins_timestamp ON admins;
CREATE TRIGGER update_admins_timestamp
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Create the admin user
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
    'rudragroupshm@gmail.com',
    crypt('Admin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User","role":"super_admin"}'
  )
  RETURNING id INTO new_user_id;

  -- Create the admin role
  INSERT INTO admins (user_id, role)
  VALUES (new_user_id, 'super_admin');
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_admin_user();

-- Drop the function as it's no longer needed
DROP FUNCTION create_admin_user();