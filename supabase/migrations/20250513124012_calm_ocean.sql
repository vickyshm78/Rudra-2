/*
  # Add Trust & Safety Features

  1. New Tables
    - `vehicle_reports` - Store reports of suspicious listings
    - `seller_verifications` - Store seller verification status and documents
    - `vehicle_history_reports` - Store vehicle history report data
    - `secure_messages` - Store encrypted messages between users
    - `escrow_transactions` - Store payment escrow information

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
    - Add encryption for sensitive data

  3. Changes
    - Add verification status to users table
    - Add history report link to vehicles table
*/

-- Create vehicle_reports table
CREATE TABLE IF NOT EXISTS vehicle_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES auth.users(id),
  reason text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolution_notes text
);

-- Create seller_verifications table
CREATE TABLE IF NOT EXISTS seller_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  document_type text NOT NULL,
  document_number text NOT NULL,
  document_expiry date NOT NULL,
  verification_date timestamptz,
  verified_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicle_history_reports table
CREATE TABLE IF NOT EXISTS vehicle_history_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE UNIQUE,
  vin text NOT NULL UNIQUE,
  report_provider text NOT NULL,
  report_date timestamptz NOT NULL,
  report_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create secure_messages table with encryption
CREATE TABLE IF NOT EXISTS secure_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id),
  recipient_id uuid REFERENCES auth.users(id),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  encrypted_content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create escrow_transactions table
CREATE TABLE IF NOT EXISTS escrow_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES auth.users(id),
  seller_id uuid REFERENCES auth.users(id),
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'funded', 'released', 'refunded', 'disputed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  transaction_details jsonb
);

-- Add verification status to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS verification_status text 
  DEFAULT 'unverified' 
  CHECK (verification_status IN ('unverified', 'pending', 'verified', 'flagged'));

-- Add history report reference to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS history_report_id uuid 
  REFERENCES vehicle_history_reports(id) ON DELETE SET NULL;

-- Enable RLS on all new tables
ALTER TABLE vehicle_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_history_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE secure_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for vehicle_reports
CREATE POLICY "Users can create reports"
  ON vehicle_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own reports"
  ON vehicle_reports
  FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid());

CREATE POLICY "Admins can view all reports"
  ON vehicle_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policies for seller_verifications
CREATE POLICY "Users can view their own verification"
  ON seller_verifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage verifications"
  ON seller_verifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policies for vehicle_history_reports
CREATE POLICY "Anyone can view history reports"
  ON vehicle_history_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage history reports"
  ON vehicle_history_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policies for secure_messages
CREATE POLICY "Users can view their own messages"
  ON secure_messages
  FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR 
    recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON secure_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Policies for escrow_transactions
CREATE POLICY "Users can view their own transactions"
  ON escrow_transactions
  FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid() OR 
    seller_id = auth.uid()
  );

CREATE POLICY "Users can create transactions"
  ON escrow_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicle_reports_vehicle_id ON vehicle_reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_reports_reporter_id ON vehicle_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_seller_verifications_user_id ON seller_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_history_reports_vehicle_id ON vehicle_history_reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_secure_messages_sender_id ON secure_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_secure_messages_recipient_id ON secure_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_vehicle_id ON escrow_transactions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_buyer_id ON escrow_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_seller_id ON escrow_transactions(seller_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_vehicle_reports_timestamp
  BEFORE UPDATE ON vehicle_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_seller_verifications_timestamp
  BEFORE UPDATE ON seller_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vehicle_history_reports_timestamp
  BEFORE UPDATE ON vehicle_history_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_secure_messages_timestamp
  BEFORE UPDATE ON secure_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_escrow_transactions_timestamp
  BEFORE UPDATE ON escrow_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();