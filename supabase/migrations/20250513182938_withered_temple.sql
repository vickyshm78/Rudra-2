/*
  # Fix Vehicle History Report RLS Policies

  1. Changes
    - Update RLS policies for vehicle_history_reports table
    - Allow proper read access for authenticated users
    - Fix single row selection issue
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view history reports" ON vehicle_history_reports;
DROP POLICY IF EXISTS "Admins can manage history reports" ON vehicle_history_reports;

-- Allow authenticated users to view history reports
CREATE POLICY "Anyone can view vehicle history"
  ON vehicle_history_reports
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admins to manage history reports
CREATE POLICY "Admins can manage vehicle history"
  ON vehicle_history_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE vehicle_history_reports ENABLE ROW LEVEL SECURITY;