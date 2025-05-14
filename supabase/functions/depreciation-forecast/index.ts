import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { vehicleId } = await req.json();

    // Get vehicle details
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (!vehicle) throw new Error('Vehicle not found');

    // Calculate depreciation forecast
    const forecast = calculateDepreciation(vehicle);

    // Store forecast
    const { data, error } = await supabase
      .from('depreciation_forecasts')
      .insert({
        vehicle_id: vehicleId,
        initial_value: vehicle.price,
        forecast_data: forecast.data,
        confidence_score: forecast.confidence,
        forecast_period: {
          lower: new Date(),
          upper: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
          bounds: '[)'
        },
        factors: forecast.factors
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});

function calculateDepreciation(vehicle: any) {
  // Implement depreciation calculation
  // This is a simplified example
  const baseDepreciation = 0.15; // 15% per year
  const mileageImpact = (vehicle.mileage / 100000) * 0.05;
  const conditionFactor = vehicle.condition === 'excellent' ? 0.9 :
                         vehicle.condition === 'good' ? 1.0 : 1.1;

  const yearlyRates = [
    baseDepreciation * conditionFactor,
    baseDepreciation * 0.9,
    baseDepreciation * 0.8,
    baseDepreciation * 0.7,
    baseDepreciation * 0.6
  ];

  const forecast = {
    data: {
      yearly_values: Array(5).fill(0).map((_, i) => {
        const value = vehicle.price * Math.pow(1 - yearlyRates[i], i + 1);
        return {
          year: new Date().getFullYear() + i + 1,
          value: Math.round(value)
        };
      })
    },
    confidence: 0.85,
    factors: {
      base_depreciation: baseDepreciation,
      mileage_impact: mileageImpact,
      condition_factor: conditionFactor,
      market_conditions: 'stable'
    }
  };

  return forecast;
}