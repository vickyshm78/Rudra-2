/*
  # Add Data Analytics Features

  1. New Tables
    - `market_trends` - Store market analysis data
    - `depreciation_forecasts` - Store vehicle value predictions
    - `vehicle_lifecycles` - Store blockchain-based vehicle history
    - `sell_probability_scores` - Store listing success predictions

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create market_trends table
CREATE TABLE IF NOT EXISTS market_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_type text NOT NULL,
  make text,
  model text,
  year_range int4range,
  price_range numrange,
  trend_data jsonb NOT NULL,
  analysis_period tstzrange NOT NULL,
  region jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create depreciation_forecasts table
CREATE TABLE IF NOT EXISTS depreciation_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  initial_value numeric NOT NULL,
  forecast_data jsonb NOT NULL,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  forecast_period tstzrange NOT NULL,
  factors jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicle_lifecycles table
CREATE TABLE IF NOT EXISTS vehicle_lifecycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  blockchain_hash text NOT NULL,
  verified boolean DEFAULT false,
  event_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sell_probability_scores table
CREATE TABLE IF NOT EXISTS sell_probability_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  score numeric NOT NULL CHECK (score >= 0 AND score <= 1),
  factors jsonb NOT NULL,
  market_conditions jsonb,
  predicted_days_to_sell integer,
  confidence_interval jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE depreciation_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_lifecycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_probability_scores ENABLE ROW LEVEL SECURITY;

-- Policies for market_trends
CREATE POLICY "Anyone can view market trends"
  ON market_trends
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage market trends"
  ON market_trends
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Policies for depreciation_forecasts
CREATE POLICY "Anyone can view depreciation forecasts"
  ON depreciation_forecasts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage depreciation forecasts"
  ON depreciation_forecasts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Policies for vehicle_lifecycles
CREATE POLICY "Anyone can view vehicle lifecycles"
  ON vehicle_lifecycles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can add lifecycle events"
  ON vehicle_lifecycles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE seller_id = auth.uid()
    )
  );

-- Policies for sell_probability_scores
CREATE POLICY "Anyone can view sell probability scores"
  ON sell_probability_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can manage sell probability scores"
  ON sell_probability_scores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_market_trends_vehicle_type 
  ON market_trends(vehicle_type);
CREATE INDEX IF NOT EXISTS idx_market_trends_analysis_period 
  ON market_trends USING GIST (analysis_period);
CREATE INDEX IF NOT EXISTS idx_depreciation_forecasts_vehicle_id 
  ON depreciation_forecasts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_lifecycles_vehicle_id 
  ON vehicle_lifecycles(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_lifecycles_blockchain_hash 
  ON vehicle_lifecycles(blockchain_hash);
CREATE INDEX IF NOT EXISTS idx_sell_probability_scores_vehicle_id 
  ON sell_probability_scores(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_sell_probability_scores_score 
  ON sell_probability_scores(score);

-- Create triggers for updating timestamps
CREATE TRIGGER update_market_trends_timestamp
  BEFORE UPDATE ON market_trends
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_depreciation_forecasts_timestamp
  BEFORE UPDATE ON depreciation_forecasts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vehicle_lifecycles_timestamp
  BEFORE UPDATE ON vehicle_lifecycles
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_sell_probability_scores_timestamp
  BEFORE UPDATE ON sell_probability_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();