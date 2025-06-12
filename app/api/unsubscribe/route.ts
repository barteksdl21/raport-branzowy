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
  console.log('Unsubscribe API route hit (token-based).');
  console.log('NEXT_PUBLIC_SUPABASE_URL available:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('SUPABASE_SERVICE_ROLE_KEY available (first 5 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 5));

  try {
    const { token, subscriptionType } = await req.json();
    console.log('Received for unsubscribe: token:', token, 'subscriptionType:', subscriptionType);

    if (!token || typeof token !== 'string') {
      console.log('Invalid token received.');
      return NextResponse.json({ error: 'Token jest wymagany i musi być ciągiem znaków.' }, { status: 400 });
    }

    if (!subscriptionType || typeof subscriptionType !== 'string' || !['newsletter', 'marketing', 'all'].includes(subscriptionType)) {
      console.log('Invalid subscriptionType received.');
      return NextResponse.json({ error: 'Nieprawidłowy typ subskrypcji. Dozwolone wartości to "newsletter", "marketing" lub "all".' }, { status: 400 });
    }

    const { error: rpcError } = await supabase.rpc('unsubscribe_user', {
      p_token: token,
      p_subscription_type: subscriptionType,
    });

    if (rpcError) {
      console.error('Error calling unsubscribe_user RPC:', JSON.stringify(rpcError, null, 2));
      // Check for specific errors from the RPC function if needed, e.g., token not found
      // For now, a generic error message for any RPC failure.
      return NextResponse.json({ error: 'Nie udało się przetworzyć żądania anulowania subskrypcji.' }, { status: 500 });
    }

    console.log('Successfully processed unsubscribe request for token:', token, 'subscriptionType:', subscriptionType);
    return NextResponse.json({ message: 'Pomyślnie przetworzono żądanie anulowania subskrypcji.' }, { status: 200 });

  } catch (e: any) {
    console.error('Error in POST /api/unsubscribe catch block:');
    console.error('Error name:', e.name);
    console.error('Error message:', e.message);
    console.error('Error stack:', e.stack);
    console.error('Full error object:', JSON.stringify(e, null, 2));
    return NextResponse.json({ error: 'Wystąpił nieoczekiwany błąd podczas przetwarzania żądania.' }, { status: 500 });
  }
}
