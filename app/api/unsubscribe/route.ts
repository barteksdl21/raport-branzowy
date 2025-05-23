import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseServiceRoleKey) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest) {
  console.log('Unsubscribe API route hit.');
  console.log('NEXT_PUBLIC_SUPABASE_URL available:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY available (first 5 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 5));

  try {
    const { email } = await req.json();
    console.log('Received email for unsubscribe:', email);

    if (!email || typeof email !== 'string') {
      console.log('Invalid email received.');
      return NextResponse.json({ error: 'Email jest wymagany i musi być ciągiem znaków.' }, { status: 400 });
    }

    // Step 1: Find the lead by email to get their ID
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .single();

    if (leadError) {
      console.error('Error fetching lead by email:', JSON.stringify(leadError, null, 2));
      // PGRST116: "Searched for a single row, but 0 rows were found"
      if (leadError.code === 'PGRST116') { 
        console.log('No lead found with that email address.');
        // It's good practice to return a consistent message for privacy, even if email not found.
        return NextResponse.json({ message: 'Jeśli Twój adres e-mail istnieje w naszym systemie, Twoja subskrypcja została anulowana.' }, { status: 200 });
      }
      return NextResponse.json({ error: 'Nie udało się znaleźć informacji o użytkowniku.' }, { status: 500 });
    }

    if (!leadData) {
      console.log('No lead found with that email address (leadData is null/undefined).');
      return NextResponse.json({ message: 'Jeśli Twój adres e-mail istnieje w naszym systemie, Twoja subskrypcja została anulowana.' }, { status: 200 });
    }

    const leadId = leadData.id;
    console.log('Found lead_id:', leadId, 'for email:', email);

    // Step 2: Update the newsletter_subscription using the lead_id
    const now = new Date().toISOString();
    const { data: updateData, error: updateError } = await supabase
      .from('newsletter_subscriptions')
      .update({
        is_subscribed: false,
        unsubscribed_at: now,
        last_changed_at: now
      })
      .eq('lead_id', leadId)
      // Optionally, only update if currently subscribed to avoid unnecessary writes
      // .eq('is_subscribed', true) 
      .select();

    if (updateError) {
      console.error('Supabase subscription update error:', JSON.stringify(updateError, null, 2));
      return NextResponse.json({ error: 'Nie udało się zaktualizować statusu subskrypcji.' }, { status: 500 });
    }

    // updateData will be an array of updated records. 
    // If empty, it means no record matched lead_id (or lead_id + is_subscribed if that condition was added).
    if (!updateData || updateData.length === 0) {
      console.log('No active subscription found for this email to unsubscribe, or already unsubscribed.');
      return NextResponse.json({ message: 'Pomyślnie przetworzono żądanie anulowania subskrypcji.' }, { status: 200 });
    }

    console.log('Successfully unsubscribed user. Updated subscription data:', JSON.stringify(updateData, null, 2));
    return NextResponse.json({ message: 'Pomyślnie anulowano subskrypcję.' }, { status: 200 });

  } catch (e: any) {
    console.error('Error in POST /api/unsubscribe catch block:');
    console.error('Error name:', e.name);
    console.error('Error message:', e.message);
    console.error('Error stack:', e.stack);
    console.error('Full error object:', JSON.stringify(e, null, 2));
    return NextResponse.json({ error: 'Wystąpił nieoczekiwany błąd podczas przetwarzania żądania.' }, { status: 500 });
  }
}
