// Fonction d'envoi d'email avec Nodemailer
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string; // L'email du client sera utilisé ici
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  const { to, subject, text, html, from } = options;

  // Nous utilisons toujours l'email du client comme expéditeur
  // Le paramètre 'from' doit toujours être fourni par l'appelant
  if (!from) {
    console.error('L\'adresse email de l\'expéditeur est requise');
    return { success: false, message: 'L\'adresse email de l\'expéditeur est requise' };
  }

  // Récupération des informations d'authentification depuis les variables d'environnement
  const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('EMAIL_USER ou EMAIL_PASSWORD n\'est pas défini dans les variables d\'environnement');
    return { success: false, message: 'Erreur de configuration email' };
  }

  try {
    // Création d'un transporteur Nodemailer avec SMTP direct
    const transporter = nodemailer.createTransport({
      host: EMAIL_SERVICE.toLowerCase() === 'gmail' ? 'smtp.gmail.com' : undefined,
      port: 587,
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Extraire le nom et l'email du champ from
    let senderName = '';
    let senderEmail = '';
    
    if (typeof from === 'string') {
      const matches = from.match(/"?([^"<]+)"?\s*<?([^>]*)>?/);
      if (matches) {
        senderName = matches[1].trim();
        senderEmail = matches[2].trim() || senderName;
      } else {
        senderEmail = from;
      }
    }

    // Configuration de l'email avec un sujet modifié
    const mailOptions = {
      from: EMAIL_USER, // Utiliser votre propre email comme expéditeur technique
      to,
      subject: `[${senderName}] ${subject}`, // Ajouter le nom de l'expéditeur au début du sujet
      text: `De: ${senderName} <${senderEmail}>\n\n${text}`, // Ajouter l'expéditeur au début du texte
      html: html ? `<p><strong>De:</strong> ${senderName} &lt;${senderEmail}&gt;</p>${html}` : undefined,
      replyTo: senderEmail, // Assure que les réponses iront au client
    };

    // Envoi de l'email
    console.log('Envoi d\'email avec Nodemailer:', { to, subject, from });
    const info = await transporter.sendMail(mailOptions);

    console.log('Email envoyé avec succès:', info.messageId);
    return {
      success: true,
      message: `Email envoyé avec succès: ${info.messageId}`
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'envoi de l\'email'
    };
  }
}
