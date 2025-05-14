/*
  # Add Specialized Market Features

  1. New Tables
    - `classic_car_authentications` - Store classic car verification details
    - `vehicle_modifications` - Store vehicle modification details
    - `commercial_fleet_details` - Store commercial vehicle specifics
    - `green_vehicle_details` - Store EV/hybrid specific details
    - `charging_stations` - Store charging station information

  2. Changes
    - Add new columns to vehicles table for specialized features
    - Add new vehicle types and categories

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Add new vehicle types
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_type_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_type_check 
  CHECK (type IN ('Car', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Scooter', 'RV', 'Boat', 'Construction', 'Tractor', 
                 'Classic', 'Modified', 'Commercial', 'Electric', 'Hybrid'));

-- Create classic car authentications table
CREATE TABLE IF NOT EXISTS classic_car_authentications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  certification_number text NOT NULL,
  certifying_authority text NOT NULL,
  certification_date date NOT NULL,
  provenance_documents text[],
  historical_records jsonb,
  restoration_details jsonb,
  appraised_value numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicle modifications table
CREATE TABLE IF NOT EXISTS vehicle_modifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  modification_type text NOT NULL,
  description text NOT NULL,
  installer text,
  installation_date date,
  parts_list jsonb,
  certification text,
  warranty_info jsonb,
  cost numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create commercial fleet details table
CREATE TABLE IF NOT EXISTS commercial_fleet_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  fleet_type text NOT NULL,
  payload_capacity numeric,
  cargo_volume numeric,
  loading_features jsonb,
  maintenance_history jsonb,
  dot_number text,
  commercial_license_required boolean DEFAULT false,
  special_features jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create green vehicle details table
CREATE TABLE IF NOT EXISTS green_vehicle_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  powertrain_type text NOT NULL CHECK (powertrain_type IN ('BEV', 'PHEV', 'HEV', 'FCEV')),
  battery_capacity numeric,
  charging_type text[],
  range_km numeric,
  energy_consumption numeric,
  charging_time jsonb,
  green_certification text,
  incentives jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create charging stations table
CREATE TABLE IF NOT EXISTS charging_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location jsonb NOT NULL,
  operator text,
  connector_types text[],
  power_levels jsonb,
  availability_status text,
  pricing jsonb,
  amenities text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE classic_car_authentications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_modifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE commercial_fleet_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE green_vehicle_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_stations ENABLE ROW LEVEL SECURITY;

-- Policies for classic car authentications
CREATE POLICY "Anyone can view classic car authentications"
  ON classic_car_authentications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage their classic car authentications"
  ON classic_car_authentications
  FOR ALL
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE seller_id = auth.uid()
    )
  );

-- Policies for vehicle modifications
CREATE POLICY "Anyone can view vehicle modifications"
  ON vehicle_modifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage their vehicle modifications"
  ON vehicle_modifications
  FOR ALL
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE seller_id = auth.uid()
    )
  );

-- Policies for commercial fleet details
CREATE POLICY "Anyone can view commercial fleet details"
  ON commercial_fleet_details
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage their commercial fleet details"
  ON commercial_fleet_details
  FOR ALL
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE seller_id = auth.uid()
    )
  );

-- Policies for green vehicle details
CREATE POLICY "Anyone can view green vehicle details"
  ON green_vehicle_details
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage their green vehicle details"
  ON green_vehicle_details
  FOR ALL
  TO authenticated
  USING (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE seller_id = auth.uid()
    )
  );

-- Policies for charging stations
CREATE POLICY "Anyone can view charging stations"
  ON charging_stations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage charging stations"
  ON charging_stations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_classic_car_authentications_vehicle_id 
  ON classic_car_authentications(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_modifications_vehicle_id 
  ON vehicle_modifications(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_commercial_fleet_details_vehicle_id 
  ON commercial_fleet_details(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_green_vehicle_details_vehicle_id 
  ON green_vehicle_details(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_charging_stations_location 
  ON charging_stations USING GIN (location);

-- Create triggers for updating timestamps
CREATE TRIGGER update_classic_car_authentications_timestamp
  BEFORE UPDATE ON classic_car_authentications
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vehicle_modifications_timestamp
  BEFORE UPDATE ON vehicle_modifications
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_commercial_fleet_details_timestamp
  BEFORE UPDATE ON commercial_fleet_details
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_green_vehicle_details_timestamp
  BEFORE UPDATE ON green_vehicle_details
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_charging_stations_timestamp
  BEFORE UPDATE ON charging_stations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();