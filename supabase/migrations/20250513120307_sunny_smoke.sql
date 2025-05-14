-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins can read admin data" ON admins;
  DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;
END $$;

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

-- Create function to update timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_admins_timestamp ON admins;

-- Create trigger for updating timestamp
CREATE TRIGGER update_admins_timestamp
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();