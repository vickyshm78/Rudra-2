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

    const { vehicleDetails, condition } = await req.json();

    // Calculate instant offer based on vehicle details and condition
    // This is a simplified example - in a real app, you would use
    // market data and complex algorithms
    const baseValue = 10000; // Example base value
    const yearMultiplier = (2025 - vehicleDetails.year) * 0.05;
    const mileageMultiplier = (vehicleDetails.mileage / 10000) * 0.1;
    const conditionMultiplier = condition === 'excellent' ? 1.2 : 
                               condition === 'good' ? 1.0 : 
                               condition === 'fair' ? 0.8 : 0.6;

    const instantOffer = Math.round(
      baseValue * (1 - yearMultiplier) * (1 - mileageMultiplier) * conditionMultiplier
    );

    // Create valuation record
    const { data, error } = await supabase
      .from('trade_in_valuations')
      .insert({
        vehicle_details: vehicleDetails,
        condition_report: {
          condition,
          assessment_date: new Date().toISOString(),
          notes: 'Instant offer generated based on provided information'
        },
        instant_offer: instantOffer,
        offer_expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        status: 'appraised'
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