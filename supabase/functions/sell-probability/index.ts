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

    // Get vehicle and market data
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (!vehicle) throw new Error('Vehicle not found');

    // Calculate sell probability
    const probability = calculateSellProbability(vehicle);

    // Store probability score
    const { data, error } = await supabase
      .from('sell_probability_scores')
      .insert({
        vehicle_id: vehicleId,
        score: probability.score,
        factors: probability.factors,
        market_conditions: probability.marketConditions,
        predicted_days_to_sell: probability.daysToSell,
        confidence_interval: probability.confidenceInterval
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

function calculateSellProbability(vehicle: any) {
  // Implement sell probability calculation
  // This is a simplified example
  const baseScore = 0.7;
  
  // Price competitiveness
  const marketPrice = 25000; // In real app, get from market data
  const priceRatio = vehicle.price / marketPrice;
  const priceScore = priceRatio > 1.1 ? -0.2 :
                    priceRatio < 0.9 ? 0.1 : 0;

  // Vehicle condition
  const conditionScore = vehicle.condition === 'excellent' ? 0.1 :
                        vehicle.condition === 'good' ? 0.05 : 0;

  // Market demand
  const demandScore = 0.05; // Based on market trends

  const finalScore = Math.min(Math.max(baseScore + priceScore + conditionScore + demandScore, 0), 1);

  return {
    score: finalScore,
    factors: {
      price_competitiveness: priceScore,
      condition: conditionScore,
      market_demand: demandScore
    },
    marketConditions: {
      demand_level: 'high',
      seasonal_impact: 'positive',
      price_trends: 'stable'
    },
    daysToSell: Math.round(30 + (1 - finalScore) * 60),
    confidenceInterval: {
      lower: Math.max(finalScore - 0.1, 0),
      upper: Math.min(finalScore + 0.1, 1)
    }
  };
}