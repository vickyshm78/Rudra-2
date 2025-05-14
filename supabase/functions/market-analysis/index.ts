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

    const { vehicleType, make, model, yearRange, region } = await req.json();

    // Get historical pricing data
    const { data: historicalData } = await supabase
      .from('vehicles')
      .select('price, created_at')
      .match({ type: vehicleType, make, model })
      .gte('year', yearRange.min)
      .lte('year', yearRange.max);

    // Analyze price trends
    const trends = analyzePriceTrends(historicalData);
    
    // Calculate market statistics
    const stats = calculateMarketStats(historicalData);

    // Store market trend analysis
    const { data, error } = await supabase
      .from('market_trends')
      .insert({
        vehicle_type: vehicleType,
        make,
        model,
        year_range: yearRange,
        trend_data: {
          trends,
          stats,
          sample_size: historicalData?.length || 0
        },
        analysis_period: {
          lower: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          upper: new Date(),
          bounds: '[)'
        },
        region
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

function analyzePriceTrends(data: any[]) {
  // Implement price trend analysis
  // This is a simplified example
  const trends = {
    overall: 'stable',
    quarterly_change: 0.02,
    seasonal_factors: {
      spring: 1.05,
      summer: 1.02,
      fall: 0.98,
      winter: 0.95
    }
  };
  
  return trends;
}

function calculateMarketStats(data: any[]) {
  // Calculate market statistics
  // This is a simplified example
  const stats = {
    median_price: 25000,
    price_volatility: 0.15,
    listing_duration: {
      mean: 45,
      median: 38
    },
    demand_index: 0.75
  };
  
  return stats;
}