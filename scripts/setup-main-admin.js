// Script pour configurer l'administrateur principal
// Utilisation: node scripts/setup-main-admin.js email@example.com password

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Fonction pour hacher un mot de passe (identique à celle dans lib/auth.ts)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function setupMainAdmin(email, password, firstName = 'Admin', lastName = 'Principal') {
  try {
    // Vérifier si l'email est valide
    if (!email || !email.includes('@')) {
      console.error('Email invalide. Veuillez fournir un email valide.');
      process.exit(1);
    }

    // Vérifier si le mot de passe est suffisamment fort
    if (!password || password.length < 8) {
      console.error('Mot de passe trop court. Utilisez au moins 8 caractères.');
      process.exit(1);
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Mettre à jour l'utilisateur existant pour le rendre administrateur
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          isAdmin: true,
          password: hashPassword(password),
          firstName,
          lastName,
        },
      });

      console.log(`L'utilisateur ${updatedUser.email} a été configuré comme administrateur principal.`);
      console.log('Mot de passe mis à jour.');
    } else {
      // Créer un nouvel utilisateur administrateur
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword(password),
          firstName,
          lastName,
          isAdmin: true,
        },
      });

      console.log(`Nouvel administrateur principal créé : ${newUser.email}`);
    }

    // Rétrograder tous les autres administrateurs
    const otherAdmins = await prisma.user.updateMany({
      where: {
        isAdmin: true,
        NOT: {
          email,
        },
      },
      data: {
        isAdmin: false,
      },
    });

    if (otherAdmins.count > 0) {
      console.log(`${otherAdmins.count} autre(s) administrateur(s) rétrogradé(s) en utilisateur(s) normal(aux).`);
    }

    console.log('\nIMPORTANT : Mettez à jour la variable ADMIN_EMAIL dans lib/admin-auth.ts avec cet email.');
    console.log(`Modifiez la ligne : export const ADMIN_EMAIL = '${email}';`);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Récupérer les arguments de la ligne de commande
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Veuillez fournir un email et un mot de passe.');
  console.error('Exemple: node scripts/setup-main-admin.js admin@example.com mot-de-passe-securise');
  process.exit(1);
}

setupMainAdmin(email, password);
