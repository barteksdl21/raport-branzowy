import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: 'Raporty Branżowe <no-reply@raportbranzowy.pl>',
      to: email,
      subject: `Twój raport: ${reportName} - Eurofins Polska`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #E74C3C;">Dziękujemy za zainteresowanie naszym raportem!</h1>
          <p>Witaj ${firstName} ${lastName},</p>
          <p>W załączniku znajdziesz swój raport: <strong>${reportName}</strong>.</p>
          <p>Dziękujemy, że korzystasz z naszych usług. Mamy nadzieję, że nasz raport okaże się pomocny w Twojej działalności.</p>
          <p>Pozdrawiamy,<br/>Zespół Eurofins Polska</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">
            Ta wiadomość została wysłana na adres ${email}. Jeśli to nie Ty wysłałeś(aś) to zgłoszenie, prosimy zignorować tę wiadomość.
          </p>
        </div>
      `,
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
