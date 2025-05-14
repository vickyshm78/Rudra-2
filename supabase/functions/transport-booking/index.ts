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

    const { vehicleId, buyerId, sellerId, pickup, delivery, transportType, preferredDate } = await req.json();

    // Calculate transport cost based on distance and type
    // This is a simplified example - in a real app, you would use
    // actual distance calculations and carrier rates
    const baseRate = transportType === 'enclosed' ? 2.5 : 
                    transportType === 'flatbed' ? 2.0 :
                    transportType === 'tow' ? 1.8 : 1.5; // per mile

    // Example distance calculation (simplified)
    const distance = 500; // miles - in real app, calculate from coordinates
    const cost = Math.round(distance * baseRate);

    // Create transport booking
    const { data, error } = await supabase
      .from('transport_bookings')
      .insert({
        vehicle_id: vehicleId,
        buyer_id: buyerId,
        seller_id: sellerId,
        pickup_location: pickup,
        delivery_location: delivery,
        preferred_date: preferredDate,
        transport_type: transportType,
        cost,
        insurance_details: {
          coverage: 'full',
          amount: Math.max(50000, cost * 2),
          provider: 'Transport Shield Insurance'
        }
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