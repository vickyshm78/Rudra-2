/*
  # Add Vehicles and Saved Searches Schema

  1. New Tables
    - `vehicles` - Store vehicle listings
    - `saved_searches` - Store user saved searches
    - `search_notifications` - Store notifications for matching vehicles

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    
  3. Automation
    - Add triggers for timestamp updates
    - Add trigger for checking new vehicles against saved searches
*/

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  mileage numeric NOT NULL,
  condition text NOT NULL,
  description text,
  features jsonb,
  images text[],
  location jsonb,
  seller_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  filters jsonb NOT NULL,
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create search notifications table
CREATE TABLE IF NOT EXISTS search_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_search_id uuid REFERENCES saved_searches ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES vehicles ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for vehicles
CREATE POLICY "Anyone can view vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own vehicle listings"
  ON vehicles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own vehicle listings"
  ON vehicles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own vehicle listings"
  ON vehicles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Policies for saved searches
CREATE POLICY "Users can create their own saved searches"
  ON saved_searches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own saved searches"
  ON saved_searches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved searches"
  ON saved_searches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
  ON saved_searches
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON search_notifications
  FOR SELECT
  TO authenticated
  USING (
    saved_search_id IN (
      SELECT id FROM saved_searches
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own notifications"
  ON search_notifications
  FOR UPDATE
  TO authenticated
  USING (
    saved_search_id IN (
      SELECT id FROM saved_searches
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    saved_search_id IN (
      SELECT id FROM saved_searches
      WHERE user_id = auth.uid()
    )
  );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_vehicles_timestamp
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_saved_search_timestamp
  BEFORE UPDATE ON saved_searches
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Function to check for matching vehicles
CREATE OR REPLACE FUNCTION check_saved_search_matches()
RETURNS TRIGGER AS $$
DECLARE
  search_record RECORD;
  filters jsonb;
BEGIN
  -- Loop through all enabled saved searches
  FOR search_record IN 
    SELECT id, filters 
    FROM saved_searches 
    WHERE notifications_enabled = true
  LOOP
    filters := search_record.filters;
    
    -- If the new vehicle matches the search criteria
    IF (
      (filters->>'type' IS NULL OR filters->>'type' = NEW.type) AND
      (filters->>'make' IS NULL OR filters->>'make' = NEW.make) AND
      (filters->>'model' IS NULL OR filters->>'model' = NEW.model) AND
      (filters->>'minPrice' IS NULL OR (filters->>'minPrice')::numeric <= NEW.price) AND
      (filters->>'maxPrice' IS NULL OR (filters->>'maxPrice')::numeric >= NEW.price) AND
      (filters->>'yearMin' IS NULL OR (filters->>'yearMin')::integer <= NEW.year) AND
      (filters->>'yearMax' IS NULL OR (filters->>'yearMax')::integer >= NEW.year)
    ) THEN
      -- Create a notification
      INSERT INTO search_notifications (saved_search_id, vehicle_id)
      VALUES (search_record.id, NEW.id);
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new vehicle listings
CREATE TRIGGER check_saved_search_matches
  AFTER INSERT ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION check_saved_search_matches();