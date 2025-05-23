import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Eurofins brand colors
const EUROFINS_NAVY = '#003366';
const EUROFINS_ORANGE = '#FF8000';
const EUROFINS_WHITE = '#FFFFFF';

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.error("RESEND_API_KEY is not set in environment variables.");
  // Consider how to handle this critical missing configuration
}
const resend = new Resend(resendApiKey);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Supabase URL or Service Role Key is missing from environment variables.");
  // This will cause runtime errors if Supabase is used.
}

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

const ALLOWED_REPORTS = ['meat', 'dairy', 'fruits', 'seafood', 'grain', 'beverages'];

// Placeholder for actual report URLs - replace with your real Vercel Blob URLs
const REPORT_ATTACHMENT_URLS: Record<string, string> = {
  meat: 'https://zj2d6vfvf7afuoiu.public.blob.vercel-storage.com/sample.pdf', // Replace with actual URL
  dairy: 'https://zj2d6vfvf7afuoiu.public.blob.vercel-storage.com/sample.pdf', // Replace with actual URL
  fruits: 'https://zj2d6vfvf7afuoiu.public.blob.vercel-storage.com/sample.pdf', // Replace with actual URL
  seafood: 'https://zj2d6vfvf7afuoiu.public.blob.vercel-storage.com/sample.pdf', // Replace with actual URL
  grain: 'https://zj2d6vfvf7afuoiu.public.blob.vercel-storage.com/sample.pdf', // Replace with actual URL
  beverages: 'https://zj2d6vfvf7afuoiu.public.blob.vercel-storage.com/sample.pdf', // Replace with actual URL
};

export async function POST(request: Request) {
  // Environment variable checks
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return NextResponse.json({ error: 'Service configuration error.' }, { status: 503 });
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase configuration is missing.");
    return NextResponse.json({ error: 'Service configuration error.' }, { status: 503 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set.");
    return NextResponse.json({ error: 'Service configuration error.' }, { status: 503 });
  }

  try {
    let rawBody;
    try {
      rawBody = await request.json();
    } catch (jsonError: any) {
      console.error('Failed to parse JSON body:', jsonError);
      return NextResponse.json({ error: 'Invalid request body: Malformed JSON.' }, { status: 400 });
    }

    const {
      firstName: rawFirstName,
      lastName: rawLastName,
      email: rawEmail,
      company: rawCompany,
      report: rawReport,
      consent,
      marketing
    } = rawBody;

    // Trim string inputs
    const firstName = typeof rawFirstName === 'string' ? rawFirstName.trim() : '';
    const lastName = typeof rawLastName === 'string' ? rawLastName.trim() : '';
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const company = typeof rawCompany === 'string' ? rawCompany.trim() : '';
    const report = typeof rawReport === 'string' ? rawReport.trim() : '';

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !report || typeof consent !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields. Please fill out all mandatory parts of the form.' }, { status: 400 });
    }

    // Validate report type against allowlist
    if (!ALLOWED_REPORTS.includes(report)) {
      return NextResponse.json({ error: 'Invalid report type specified.' }, { status: 400 });
    }

    // Consent for data processing to receive the report is mandatory as per form logic
    if (!consent) {
        return NextResponse.json({ error: 'Processing consent is required to receive the report.' }, { status: 400 });
    }

    // --- Database Operations ---
    let leadId: string;
    let showUnsubscribeInfo: boolean = false; // Initialize in broader scope
    try {
      // 1. Upsert Lead (create if new email, update if existing)
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .upsert(
          {
            email: email.toLowerCase(), // Normalize email
            first_name: firstName, // Already trimmed
            last_name: lastName,   // Already trimmed
            company: company,       // Already trimmed
          },
          {
            onConflict: 'email',
          }
        )
        .select('id')
        .single();

      if (leadError) throw leadError;
      if (!leadData) throw new Error('Failed to create or find lead.');
      leadId = leadData.id;

      // 2. Insert Report Download
      const { error: reportDownloadError } = await supabase
        .from('report_downloads')
        .insert({
          lead_id: leadId,
          report_type: report,
          processing_consent: consent, // Should be true based on prior check
        });
      if (reportDownloadError) throw reportDownloadError;

      // 3. Upsert Newsletter Subscription
      const { data: existingSubscription, error: fetchSubError } = await supabase
        .from('newsletter_subscriptions')
        .select('id, is_subscribed, subscribed_at, unsubscribed_at')
        .eq('lead_id', leadId)
        .maybeSingle();

      if (fetchSubError) throw fetchSubError;

      // Determine if unsubscribe info should be shown in the email
      // Show if they are opting in now OR if they were already subscribed
      showUnsubscribeInfo = !!marketing || (existingSubscription && existingSubscription.is_subscribed);

      const now = new Date().toISOString();
      let subscriptionDataToUpsert: any = {
        lead_id: leadId,
        is_subscribed: !!marketing, // Ensure boolean
      };

      if (marketing) { // User wants to be subscribed
        if (!existingSubscription || !existingSubscription.is_subscribed) {
          subscriptionDataToUpsert.subscribed_at = now;
        } else {
          subscriptionDataToUpsert.subscribed_at = existingSubscription.subscribed_at;
        }
        subscriptionDataToUpsert.unsubscribed_at = null;
      } else { // User does not want to be subscribed
        if (existingSubscription && existingSubscription.is_subscribed) {
          subscriptionDataToUpsert.unsubscribed_at = now;
        } else if (existingSubscription) {
          subscriptionDataToUpsert.unsubscribed_at = existingSubscription.unsubscribed_at;
        }
        if (existingSubscription) {
            subscriptionDataToUpsert.subscribed_at = existingSubscription.subscribed_at;
        }
      }
      
      const { error: newsletterSubscriptionError } = await supabase
        .from('newsletter_subscriptions')
        .upsert(subscriptionDataToUpsert, { onConflict: 'lead_id' });
        
      if (newsletterSubscriptionError) throw newsletterSubscriptionError;

    } catch (dbError: any) {
      console.error('Database operation failed:', dbError);
      // Potentially send a different email or notification if DB fails but user still expects report?
      // For now, we fail the request before sending the email.
      return NextResponse.json(
        { error: 'Failed to save your submission. Please try again later.' }, // Generic message for client
        { status: 500 }
      );
    }
    // --- End Database Operations ---

    // Map report types to their display names for the email
    const reportNames: Record<string, string> = {
      meat: 'Raport branży mięsnej',
      dairy: 'Raport branży mleczarskiej',
      fruits: 'Raport branży owocowo-warzywnej',
      seafood: 'Raport branży rybnej',
      grain: 'Raport branży zbożowej',
      beverages: 'Raport branży napojów',
    };
    const reportName = reportNames[report] || 'Raport branżowy';

    // Fetch attachment from Vercel Blob based on validated report type
    const attachmentUrl = REPORT_ATTACHMENT_URLS[report];
    if (!attachmentUrl) {
      console.error(`Configuration error: No attachment URL found for report type '${report}'.`);
      return NextResponse.json({ error: 'Failed to prepare report due to a server configuration issue.' }, { status: 500 });
    }
    let contentBuffer;
    try {
      const blobResponse = await fetch(attachmentUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      });

      if (!blobResponse.ok) {
        const errorText = await blobResponse.text();
        console.error(`Error fetching attachment from Vercel Blob: ${blobResponse.status} ${blobResponse.statusText}`, errorText);
        throw new Error(`Failed to fetch attachment: ${blobResponse.statusText}`);
      }
      const arrayBuffer = await blobResponse.arrayBuffer();
      contentBuffer = Buffer.from(arrayBuffer);
    } catch (fetchError: any) {
      console.error('Error preparing attachment:', fetchError);
      return NextResponse.json(
        { error: 'Failed to prepare report for email. Please try again.' }, // Generic message for client
        { status: 500 }
      );
    }

    // Create plaintext version of the email
    let plainText = `
Dziękujemy za zainteresowanie naszym raportem!

Witaj ${firstName} ${lastName},

W załączniku znajdziesz swój raport: ${reportName}.

Dziękujemy, że korzystasz z naszych usług. Mamy nadzieję, że nasz raport okaże się pomocny w Twojej działalności.

W razie pytań, jesteśmy do dyspozycji.

Pozdrawiamy,
Zespół Eurofins Polska

---
Ta wiadomość została wysłana na adres ${email}. Jeśli to nie Ty wysłałeś(aś) to zgłoszenie, prosimy zignorować tę wiadomość.
`;

    if (showUnsubscribeInfo) {
      plainText += `
Aby wypisać się z newslettera, odwiedź https://raportbranzowy.pl/unsubscribe?email=${encodeURIComponent(email)} lub odpowiedz na tę wiadomość wpisując "unsubscribe".
`;
    }

    plainText += `
---
Eurofins Polska Sp. z o.o.
Aleja Wojska Polskiego 90A
82-200 Malbork
NIP: 5792000046
`;

    // Email headers
    const emailHeaders: Record<string, string> = {
      'X-Entity-Ref-ID': `report-${report}-${Date.now()}`,
      'X-Report-Type': report,
      'X-Report-Abuse': 'abuse@raportbranzowy.pl',
    };

    if (showUnsubscribeInfo) {
      emailHeaders['List-Unsubscribe'] = `<https://raportbranzowy.pl/unsubscribe?email=${encodeURIComponent(email)}>, <mailto:unsubscribe@raportbranzowy.pl?subject=unsubscribe&body=Proszę%20o%20wypisanie%20mnie%20z%20newslettera%20dla%20adresu%20${encodeURIComponent(email)}>`;
    }
    
    // Send email with Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'Eurofins Polska <raporty@raportbranzowy.pl>',
      to: email,
      subject: `${reportName} - Eurofins Polska`,
      headers: emailHeaders,
      replyTo: 'wyceny-oferta@eurofins.com',
      html: `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">
          <title>Eurofins Polska - Raport Branżowy</title>
          <!--[if mso]>
          <style type="text/css">
            table {border-collapse: collapse;}
            td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
          </style>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: ${EUROFINS_WHITE};">
            <!-- Header with logo and brand color bar -->
            <tr>
              <td style="background-color: ${EUROFINS_NAVY}; padding: 20px; text-align: center;">
                <h1 style="color: ${EUROFINS_WHITE}; margin: 0; font-size: 24px;">Eurofins Polska</h1>
              </td>
            </tr>
            
            <!-- Orange accent bar -->
            <tr>
              <td style="background-color: ${EUROFINS_ORANGE}; height: 5px;"></td>
            </tr>
            
            <!-- Main content -->
            <tr>
              <td style="padding: 30px 20px;">
                <h2 style="color: ${EUROFINS_NAVY}; margin-top: 0;">Dziękujemy za zainteresowanie naszym raportem!</h2>
                
                <p style="color: #333; line-height: 1.5;">Witaj <strong>${firstName} ${lastName}</strong>,</p>
                
                <p style="color: #333; line-height: 1.5;">W załączniku znajdziesz swój raport:</p>
                
                <div style="background-color: #f5f5f5; border-left: 4px solid ${EUROFINS_ORANGE}; padding: 15px; margin: 20px 0;">
                  <h3 style="color: ${EUROFINS_NAVY}; margin: 0;">${reportName}</h3>
                </div>
                
                <p style="color: #333; line-height: 1.5;">Dziękujemy, że korzystasz z naszych usług. Mamy nadzieję, że nasz raport okaże się pomocny w Twojej działalności.</p>
                
                <p style="color: #333; line-height: 1.5; margin-bottom: 30px;">W razie pytań, jesteśmy do dyspozycji.</p>
                
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td>
                      <div style="background-color: ${EUROFINS_NAVY}; color: ${EUROFINS_WHITE}; padding: 15px; border-radius: 5px;">
                        <p style="margin: 0;"><strong>Pozdrawiamy,</strong><br/>Zespół Eurofins Polska</p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Footer -->
            <tr>
              <td style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                <p style="color: #777; font-size: 12px; margin-bottom: 15px;">
                  Ta wiadomość została wysłana na adres ${email}.<br/>
                  Jeśli to nie Ty wysłałeś(aś) to zgłoszenie, prosimy zignorować tę wiadomość.
                </p>
                
                ${showUnsubscribeInfo ? `
                <p style="color: #777; font-size: 12px; margin-bottom: 15px;">
                  <a href="https://raportbranzowy.pl/unsubscribe?email=${encodeURIComponent(email)}" style="color: ${EUROFINS_NAVY}; text-decoration: underline;">Wypisz się z newslettera</a>
                </p>
                ` : ''}
                
                <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 15px;">
                  <p style="color: #777; font-size: 11px; margin: 0; line-height: 1.4;">
                    <strong>Eurofins Polska Sp. z o.o.</strong><br/>
                    Aleja Wojska Polskiego 90A<br/>
                    82-200 Malbork<br/>
                    NIP: 5792000046
                  </p>
                </div>
              </td>
            </tr>
            
            <!-- Orange accent bar at bottom -->
            <tr>
              <td style="background-color: ${EUROFINS_ORANGE}; height: 5px;"></td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: plainText,
      attachments: contentBuffer ? [
        {
          filename: `${report}.pdf`,
          content: contentBuffer,
        },
      ] : [],
    });

    if (resendError) {
      console.error('Error sending email:', resendError);
      // Note: DB operations were successful, but email failed.
      // Consider how to handle this state. For now, return email error.
      return NextResponse.json(
        { error: 'Failed to send email. Your submission was recorded. Please contact support if you do not receive your report.' }, // Generic message for client
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Report sent and submission recorded.', data: resendData });

  } catch (error: any) {
    console.error('Error in send-report API (outer):', error);
    // The SyntaxError for JSON parsing is handled when getting rawBody
    return NextResponse.json(
      { error: 'An unexpected internal server error occurred. Please try again later.' }, // Generic message for client
      { status: 500 }
    );
  }
}
