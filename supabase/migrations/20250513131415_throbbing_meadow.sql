/*
  # Add Enhanced Services Schema

  1. New Tables
    - `concierge_requests` - Store premium buying service requests
    - `transport_bookings` - Store vehicle transport arrangements
    - `trade_in_valuations` - Store trade-in vehicle assessments
    - `warranty_providers` - Store warranty provider information
    - `warranty_quotes` - Store warranty quotes for vehicles

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Create concierge_requests table
CREATE TABLE IF NOT EXISTS concierge_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'searching', 'completed', 'cancelled')),
  requirements jsonb NOT NULL,
  budget_range jsonb NOT NULL,
  timeline text,
  assigned_agent uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create transport_bookings table
CREATE TABLE IF NOT EXISTS transport_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES auth.users(id),
  seller_id uuid REFERENCES auth.users(id),
  pickup_location jsonb NOT NULL,
  delivery_location jsonb NOT NULL,
  preferred_date date,
  transport_type text NOT NULL CHECK (transport_type IN ('open', 'enclosed', 'flatbed', 'tow')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')),
  cost numeric,
  insurance_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create trade_in_valuations table
CREATE TABLE IF NOT EXISTS trade_in_valuations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  vehicle_details jsonb NOT NULL,
  condition_report jsonb NOT NULL,
  images text[],
  instant_offer numeric,
  offer_expiry timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'appraised', 'accepted', 'declined', 'expired')),
  appraiser_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create warranty_providers table
CREATE TABLE IF NOT EXISTS warranty_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  coverage_types jsonb,
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0,
  contact_info jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create warranty_quotes table
CREATE TABLE IF NOT EXISTS warranty_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  provider_id uuid REFERENCES warranty_providers(id),
  coverage_details jsonb NOT NULL,
  term_months integer NOT NULL,
  price numeric NOT NULL,
  deductible numeric,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'purchased', 'expired')),
  expiry_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE concierge_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_in_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_quotes ENABLE ROW LEVEL SECURITY;

-- Policies for concierge_requests
CREATE POLICY "Users can view their own concierge requests"
  ON concierge_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create concierge requests"
  ON concierge_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for transport_bookings
CREATE POLICY "Users can view their transport bookings"
  ON transport_bookings
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Users can create transport bookings"
  ON transport_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

-- Policies for trade_in_valuations
CREATE POLICY "Users can view their trade-in valuations"
  ON trade_in_valuations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create trade-in valuations"
  ON trade_in_valuations
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for warranty_providers
CREATE POLICY "Anyone can view active warranty providers"
  ON warranty_providers
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage warranty providers"
  ON warranty_providers
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Policies for warranty_quotes
CREATE POLICY "Users can view warranty quotes for their vehicles"
  ON warranty_quotes
  FOR SELECT
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE seller_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_concierge_requests_user_id 
  ON concierge_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_vehicle_id 
  ON transport_bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_buyer_id 
  ON transport_bookings(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transport_bookings_seller_id 
  ON transport_bookings(seller_id);
CREATE INDEX IF NOT EXISTS idx_trade_in_valuations_user_id 
  ON trade_in_valuations(user_id);
CREATE INDEX IF NOT EXISTS idx_warranty_quotes_vehicle_id 
  ON warranty_quotes(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_warranty_quotes_provider_id 
  ON warranty_quotes(provider_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_concierge_requests_timestamp
  BEFORE UPDATE ON concierge_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_transport_bookings_timestamp
  BEFORE UPDATE ON transport_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_trade_in_valuations_timestamp
  BEFORE UPDATE ON trade_in_valuations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_warranty_providers_timestamp
  BEFORE UPDATE ON warranty_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_warranty_quotes_timestamp
  BEFORE UPDATE ON warranty_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Insert sample warranty providers
INSERT INTO warranty_providers (name, description, coverage_types, rating, review_count, contact_info, is_active) VALUES
  (
    'Premium Auto Shield',
    'Comprehensive coverage for all vehicle types with exceptional customer service',
    '{"basic": {"description": "Essential coverage for major components"}, "premium": {"description": "Full coverage including electronics"}, "platinum": {"description": "Bumper-to-bumper coverage"}}',
    4.8,
    1250,
    '{"phone": "1-800-555-0123", "email": "support@premiumautoshield.com", "website": "https://premiumautoshield.com"}',
    true
  ),
  (
    'Elite Vehicle Protection',
    'Specialized coverage options for luxury and performance vehicles',
    '{"standard": {"description": "Core component coverage"}, "elite": {"description": "Extended coverage with roadside assistance"}, "ultimate": {"description": "Complete vehicle protection"}}',
    4.7,
    980,
    '{"phone": "1-800-555-0124", "email": "support@elitevehicle.com", "website": "https://elitevehicle.com"}',
    true
  ),
  (
    'Guardian Extended Care',
    'Flexible warranty plans with nationwide coverage',
    '{"basic": {"description": "Powertrain coverage"}, "plus": {"description": "Enhanced component coverage"}, "max": {"description": "Maximum protection package"}}',
    4.6,
    1520,
    '{"phone": "1-800-555-0125", "email": "support@guardiancare.com", "website": "https://guardiancare.com"}',
    true
  )
ON CONFLICT DO NOTHING;