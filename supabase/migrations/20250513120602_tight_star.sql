/*
  # Fix Admin Login and Setup

  1. Changes
    - Create admin user if not exists
    - Set up proper admin role and permissions
    - Add index for performance
    - Update RLS policies

  2. Security
    - Enable RLS
    - Add policies for admin access
    - Ensure proper role checks
*/

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to check and create admin user if needed
CREATE OR REPLACE FUNCTION setup_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
  admin_email text := 'admin@99carmart.com';
BEGIN
  -- Check if admin user exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;

  -- Create admin user if not exists
  IF admin_user_id IS NULL THEN
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
      raw_user_meta_data,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      admin_email,
      crypt('Admin123!', gen_salt('bf')),
      now(),
      now(),
      now(),
      encode(gen_random_bytes(32), 'hex'),
      encode(gen_random_bytes(32), 'hex'),
      jsonb_build_object(
        'provider', 'email',
        'providers', array['email']
      ),
      jsonb_build_object(
        'name', 'Admin User',
        'role', 'super_admin'
      ),
      true
    )
    RETURNING id INTO admin_user_id;

    -- Create admin role for the user
    IF admin_user_id IS NOT NULL THEN
      INSERT INTO admins (user_id, role)
      VALUES (admin_user_id, 'super_admin')
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create admins table if not exists
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) UNIQUE,
  role text NOT NULL CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- Execute the setup function
SELECT setup_admin_user();

-- Drop the setup function as it's no longer needed
DROP FUNCTION setup_admin_user();