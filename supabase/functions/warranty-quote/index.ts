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

    const { vehicleId, providerId, coverageType, termMonths } = await req.json();

    // Get vehicle and provider details
    const { data: vehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    const { data: provider } = await supabase
      .from('warranty_providers')
      .select('*')
      .eq('id', providerId)
      .single();

    if (!vehicle || !provider) throw new Error('Vehicle or provider not found');

    // Calculate warranty price based on vehicle details and coverage
    // This is a simplified example - in a real app, you would use
    // actual warranty pricing algorithms
    const basePrice = 1000;
    const ageMultiplier = (2025 - vehicle.year) * 0.1;
    const mileageMultiplier = (vehicle.mileage / 10000) * 0.05;
    const coverageMultiplier = coverageType === 'platinum' ? 1.5 :
                              coverageType === 'premium' ? 1.2 : 1.0;
    const termMultiplier = termMonths / 12;

    const price = Math.round(
      basePrice * (1 + ageMultiplier) * (1 + mileageMultiplier) * coverageMultiplier * termMultiplier
    );

    // Create warranty quote
    const { data, error } = await supabase
      .from('warranty_quotes')
      .insert({
        vehicle_id: vehicleId,
        provider_id: providerId,
        coverage_details: {
          type: coverageType,
          description: provider.coverage_types[coverageType].description,
          included_components: ['engine', 'transmission', 'drivetrain'],
          exclusions: ['wear and tear', 'maintenance']
        },
        term_months: termMonths,
        price,
        deductible: 100,
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
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