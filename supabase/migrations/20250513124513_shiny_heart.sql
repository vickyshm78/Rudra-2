/*
  # Add Additional Vehicle Features

  1. New Columns
    - Add new columns to vehicles table for enhanced features
    - Add configuration tables for dynamic features

  2. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Add new columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS virtual_tour_enabled boolean DEFAULT false;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS features_highlight jsonb;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS specifications jsonb;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS warranty_info jsonb;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS seller_notes text;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS custom_features jsonb;

-- Create vehicle_features_config table for dynamic feature management
CREATE TABLE IF NOT EXISTS vehicle_features_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  display_name text NOT NULL,
  description text,
  icon text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, name)
);

-- Create vehicle_specifications_config table
CREATE TABLE IF NOT EXISTS vehicle_specifications_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  display_name text NOT NULL,
  unit text,
  is_required boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category, name)
);

-- Enable RLS
ALTER TABLE vehicle_features_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_specifications_config ENABLE ROW LEVEL SECURITY;

-- Policies for vehicle_features_config
CREATE POLICY "Anyone can view active features"
  ON vehicle_features_config
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage features"
  ON vehicle_features_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Policies for vehicle_specifications_config
CREATE POLICY "Anyone can view active specifications"
  ON vehicle_specifications_config
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage specifications"
  ON vehicle_specifications_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_features_config_category ON vehicle_features_config(category);
CREATE INDEX IF NOT EXISTS idx_vehicle_specifications_config_category ON vehicle_specifications_config(category);

-- Insert default features
INSERT INTO vehicle_features_config (category, name, display_name, description, icon) VALUES
  ('safety', 'abs', 'Anti-lock Braking System', 'Prevents wheel lock during braking', 'shield'),
  ('safety', 'airbags', 'Airbags', 'Multiple airbag system for occupant protection', 'shield'),
  ('comfort', 'climate_control', 'Climate Control', 'Automatic temperature control system', 'thermometer'),
  ('comfort', 'leather_seats', 'Leather Seats', 'Premium leather upholstery', 'couch'),
  ('technology', 'bluetooth', 'Bluetooth', 'Wireless connectivity for phone and audio', 'bluetooth'),
  ('technology', 'navigation', 'Navigation System', 'Built-in GPS navigation', 'map'),
  ('technology', 'backup_camera', 'Backup Camera', 'Rear view camera system', 'camera'),
  ('performance', 'turbo', 'Turbocharger', 'Forced induction system for increased power', 'zap'),
  ('performance', 'sport_mode', 'Sport Mode', 'Enhanced performance driving mode', 'gauge')
ON CONFLICT (category, name) DO NOTHING;

-- Insert default specifications
INSERT INTO vehicle_specifications_config (category, name, display_name, unit, is_required) VALUES
  ('engine', 'displacement', 'Engine Displacement', 'cc', true),
  ('engine', 'horsepower', 'Horsepower', 'hp', true),
  ('engine', 'torque', 'Torque', 'lb-ft', true),
  ('dimensions', 'length', 'Length', 'in', true),
  ('dimensions', 'width', 'Width', 'in', true),
  ('dimensions', 'height', 'Height', 'in', true),
  ('dimensions', 'wheelbase', 'Wheelbase', 'in', true),
  ('performance', 'acceleration', '0-60 mph', 'sec', false),
  ('performance', 'top_speed', 'Top Speed', 'mph', false)
ON CONFLICT (category, name) DO NOTHING;

-- Create trigger for updating timestamps
CREATE TRIGGER update_vehicle_features_config_timestamp
  BEFORE UPDATE ON vehicle_features_config
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vehicle_specifications_config_timestamp
  BEFORE UPDATE ON vehicle_specifications_config
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();