import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Eurofins brand colors
const EUROFINS_NAVY = '#003366';
const EUROFINS_ORANGE = '#FF8000';
const EUROFINS_WHITE = '#FFFFFF';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, company, report } = await request.json();

    // Map report types to their display names
    const reportNames: Record<string, string> = {
      meat: 'Raport branży mięsnej',
      dairy: 'Raport branży mleczarskiej',
      fruits: 'Raport branży owocowo-warzywnej',
      seafood: 'Raport branży rybnej',
      grain: 'Raport branży zbożowej',
      beverages: 'Raport branży napojów',
    };

    const reportName = reportNames[report] || 'Raport branżowy';

    // Fetch attachment from Vercel Blob
    const attachmentUrl = 'https://zj2d6vfvf7afuoiu.public.blob.vercel-storage.com/sample.pdf';
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
    } catch (fetchError) {
      console.error('Error preparing attachment:', fetchError);
      return NextResponse.json(
        { error: 'Failed to prepare attachment for email' },
        { status: 500 }
      );
    }

    // Create plaintext version of the email for better deliverability
    const plainText = `
Dziękujemy za zainteresowanie naszym raportem!

Witaj ${firstName} ${lastName},

W załączniku znajdziesz swój raport: ${reportName}.

Dziękujemy, że korzystasz z naszych usług. Mamy nadzieję, że nasz raport okaże się pomocny w Twojej działalności.

W razie pytań, jesteśmy do dyspozycji.

Pozdrawiamy,
Zespół Eurofins Polska

---
Ta wiadomość została wysłana na adres ${email}. Jeśli to nie Ty wysłałeś(aś) to zgłoszenie, prosimy zignorować tę wiadomość.

Aby wypisać się z newslettera, wyślij email na adres: unsubscribe@raportbranzowy.pl

---
Eurofins Polska Sp. z o.o.
Aleja Wojska Polskiego 90A
82-200 Malbork
NIP: 5792000046
`;

    // Email headers to improve deliverability
    const emailHeaders = {
      'List-Unsubscribe': `<mailto:unsubscribe@raportbranzowy.pl?subject=unsubscribe&email=${email}>`,
      'X-Entity-Ref-ID': `report-${report}-${Date.now()}`, // Unique ID for each email
      'X-Report-Type': report,
      'X-Report-Abuse': 'Please forward this email to abuse@raportbranzowy.pl',
    };
    
    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: 'Eurofins Polska <raporty@raportbranzowy.pl>',
      to: email,
      subject: `Twój raport: ${reportName} - Eurofins Polska`,
      headers: emailHeaders,
      replyTo: 'kontakt@raportbranzowy.pl',
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
                
                <p style="color: #777; font-size: 12px; margin-bottom: 15px;">
                  <a href="raportbranzowy.pl/unsubscribe?email=${email}" style="color: ${EUROFINS_NAVY}; text-decoration: underline;">Wypisz się z newslettera</a>
                </p>
                
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

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in send-report API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
