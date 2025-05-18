import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// Configuration pour l'envoi d'emails
const EMAIL_TO = process.env.EMAIL_TO || 'destination@example.com';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the received data
    console.log('Partner email data received:', data);

    // Format the email content for better readability
    const formatPartnerInfo = (info: any) => {
      const keyLabels: Record<string, string> = {
        companyName: "Nom de l'entreprise",
        contactName: "Nom du contact",
        email: "Email",
        phone: "Téléphone",
        address: "Adresse",
        postalCode: "Code postal",
        city: "Ville",
        message: "Message"
      };

      return Object.entries(info)
        .map(([key, value]) => `<strong>${keyLabels[key] || key}</strong>: ${value}`)
        .join('<br>');
    };

    // Prepare the email content
    const emailSubject = data.subject || `[PARTENARIAT] ${data.partnerInfo.companyName} - Nouvelle demande`;

    // Version texte de l'email
    const emailText = `
Nouvelle demande de partenariat

SOCIÉTÉ: ${data.partnerInfo.companyName}

Informations de l'entreprise:
${Object.entries(data.partnerInfo)
  .map(([key, value]) => {
    const keyLabels: Record<string, string> = {
      companyName: "Nom de l'entreprise",
      contactName: "Nom du contact",
      email: "Email",
      phone: "Téléphone",
      address: "Adresse",
      postalCode: "Code postal",
      city: "Ville",
      message: "Message"
    };
    return `${keyLabels[key] || key}: ${value}`;
  })
  .join('\n')}
    `;

    // Version HTML de l'email
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #0055b3; }
    h2 { color: #0066cc; margin-top: 20px; }
    .company-name { font-size: 1.5em; font-weight: bold; color: #0055b3; margin-bottom: 15px; }
    .info-section { margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Nouvelle demande de partenariat</h1>

    <div class="company-name">
      Société: ${data.partnerInfo.companyName}
    </div>

    <div class="info-section">
      <h2>Informations de l'entreprise</h2>
      <p>${formatPartnerInfo(data.partnerInfo)}</p>
    </div>
  </div>
</body>
</html>
    `;

    try {
      // Envoi de l'email avec Nodemailer
      if (!data.partnerInfo.email) {
        throw new Error("L'email du partenaire est requis pour l'envoi");
      }

      try {
        const emailResult = await sendEmail({
          to: EMAIL_TO,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
          from: `"${data.partnerInfo.contactName}" <${data.partnerInfo.email}>`
        });

        if (!emailResult.success) {
          console.error("Échec de l'envoi d'email:", emailResult.message);
          throw new Error(`Email sending failed: ${emailResult.message}`);
        }

        console.log("Email de partenariat envoyé avec succès via Nodemailer");
      } catch (emailError) {
        console.error("Erreur lors de l'envoi d'email avec Nodemailer:", emailError);
        throw emailError;
      }

      // Return success response
      return NextResponse.json({
        success: true,
        message: 'Email envoyé avec succès'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);

      // Create mailto URL as fallback
      const mailtoUrl = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText)}`;

      return NextResponse.json({
        success: false,
        message: 'Le service d\'email a échoué, mais nous avons préparé un lien mailto comme solution de secours',
        mailtoUrl: mailtoUrl,
        error: emailError instanceof Error ? emailError.message : String(emailError)
      });
    }
  } catch (error) {
    console.error('Error processing email request:', error);

    // Create a fallback mailto URL in case of error
    const emailSubject = "Nouvelle demande de partenariat";
    const emailBody = "Une erreur s'est produite lors de l'envoi automatique. Veuillez nous contacter directement.";
    const mailtoUrl = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    return NextResponse.json(
      {
        success: false,
        message: 'Échec de l\'envoi de l\'email',
        mailtoUrl: mailtoUrl,
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
