import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getAgentByReferralCode } from '@/lib/referral';
import prisma from '@/lib/prisma';

// Configuration pour l'envoi d'emails
const EMAIL_TO = process.env.EMAIL_TO || 'destination@example.com';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the received data
    console.log('Email data received:', data);

    // Vérifier si un code de référence est présent
    let agentId = null;
    if (data.referralCode) {
      // Récupérer l'agent correspondant au code de référence
      const agent = await getAgentByReferralCode(data.referralCode);
      if (agent && agent.active) {
        agentId = agent.id;
        console.log(`Référence trouvée pour l'agent: ${agent.name} (${agent.id})`);
      }
    }

    // Format the email content for better readability
    const formatClientInfo = (info: any) => {
      const keyLabels: Record<string, string> = {
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        phone: "Téléphone",
        licensePlate: "Plaque d'immatriculation",
        insurance: "Assurance",
        address: "Adresse",
        postalCode: "Code postal",
        city: "Ville"
      };

      return Object.entries(info)
        .map(([key, value]) => `<strong>${keyLabels[key] || key}</strong>: ${value}`)
        .join('<br>');
    };

    const formatDetails = (details: any) => {
      if (!details || Object.keys(details).length === 0) return '';

      // Traduction des clés de détails si nécessaire
      const keyLabels: Record<string, string> = {
        damageType: "Type de dommage",
        positionVitre: "Position",
        typeVitre: "Type de vitre",
        rearWindowType: "Type de lunette arrière",
        otherDescription: "Description détaillée"
        // La clé "Description détaillée" est déjà en français, donc pas besoin de la traduire
      };

      return Object.entries(details)
        .map(([key, value]: [string, any]) => {
          const translatedKey = keyLabels[key] || key;
          if (typeof value === 'object' && value.label) {
            return `<strong>${translatedKey}</strong>: ${value.label}`;
          }
          return `<strong>${translatedKey}</strong>: ${value}`;
        })
        .join('<br>');
    };

    // Prepare the email content
    const emailSubject = data.subject || `Nouveau signalement de ${data.clientInfo.firstName} ${data.clientInfo.lastName}`;

    // Récupérer les informations de l'agent si un code de référence est présent
    let agentInfoText = '';
    let agentInfoHtml = '';

    if (agentId) {
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
      });

      if (agent) {
        agentInfoText = `\nRéféré par: ${agent.name} (Code: ${data.referralCode})`;
        agentInfoHtml = `
    <div class="info-section">
      <h2>Référence</h2>
      <p><strong>Agent:</strong> ${agent.name} <br><strong>Code:</strong> ${data.referralCode}</p>
    </div>`;
      }
    }

    // Version texte de l'email
    const emailText = `
Nouveau signalement de dommage de vitre

Informations client:
${Object.entries(data.clientInfo)
  .map(([key, value]) => {
    // Traduction des clés en français
    const keyLabels: Record<string, string> = {
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      licensePlate: "Plaque d'immatriculation",
      insurance: "Assurance",
      address: "Adresse",
      postalCode: "Code postal",
      city: "Ville"
    };
    return `${keyLabels[key] || key}: ${value}`;
  })
  .join('\n')}

Type de vitre:
${data.glassType.label}
${agentInfoText}

${data.details && Object.keys(data.details).length > 0 ? `Détails du dommage:
${Object.entries(data.details)
  .map(([key, value]: [string, any]) => {
    // Traduction des clés de détails si nécessaire
    const keyLabels: Record<string, string> = {
      damageType: "Type de dommage",
      positionVitre: "Position",
      typeVitre: "Type de vitre",
      rearWindowType: "Type de lunette arrière",
      otherDescription: "Description détaillée"
    };
    const translatedKey = keyLabels[key] || key;

    if (typeof value === 'object' && value.label) {
      return `${translatedKey}: ${value.label}`;
    }
    return `${translatedKey}: ${value}`;
  })
  .join('\n')}` : ''}
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
    .info-section { margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Nouveau signalement de dommage de vitre</h1>

    <div class="info-section">
      <h2>Informations client</h2>
      <p>${formatClientInfo(data.clientInfo)}</p>
    </div>

    <div class="info-section">
      <h2>Type de vitre</h2>
      <p>${data.glassType.label}</p>
    </div>

    ${data.details && Object.keys(data.details).length > 0 ? `
    <div class="info-section">
      <h2>Détails du dommage</h2>
      <p>${formatDetails(data.details)}</p>
    </div>
    ` : ''}

    ${agentInfoHtml}
  </div>
</body>
</html>
    `;

    try {
      // Envoi de l'email avec Nodemailer
      // L'email du client est TOUJOURS utilisé comme expéditeur (from) pour que le destinataire puisse répondre directement
      // Ce champ est obligatoire et ne peut pas être vide
      if (!data.clientInfo.email) {
        throw new Error("L'email du client est requis pour l'envoi");
      }

      try {
        const emailResult = await sendEmail({
          to: EMAIL_TO,
          subject: emailSubject,
          text: emailText,
          html: emailHtml,
          from: `"${data.clientInfo.firstName} ${data.clientInfo.lastName}" <${data.clientInfo.email}>`
        });

        if (!emailResult.success) {
          console.error("Échec de l'envoi d'email:", emailResult.message);
          throw new Error(`Email sending failed: ${emailResult.message}`);
        }

        console.log("Email envoyé avec succès via Nodemailer");

        // Enregistrer la soumission dans la base de données si un agent est associé
        if (agentId) {
          try {
            // Créer une entrée dans la table FormSubmission
            await prisma.formSubmission.create({
              data: {
                formType: 'carDamage',
                formData: JSON.stringify(data),
                agentId: agentId,
                referralCode: data.referralCode,
              },
            });

            console.log(`Soumission enregistrée pour l'agent ID: ${agentId}`);
          } catch (dbError) {
            console.error("Erreur lors de l'enregistrement de la soumission:", dbError);
            // Ne pas bloquer l'envoi de l'email si l'enregistrement échoue
          }
        }
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
    const emailSubject = "Nouveau signalement de dommage de vitre";
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
