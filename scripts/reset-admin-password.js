// Script pour réinitialiser le mot de passe de l'administrateur principal
// Utilisation: node scripts/reset-admin-password.js nouveau_mot_de_passe

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Nous n'avons plus besoin de vérifier l'existence du fichier de base de données
// car Prisma s'en chargera

const prisma = new PrismaClient();

// Fonction pour hacher un mot de passe (identique à celle dans lib/auth.ts)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function resetAdminPassword() {
  // Vérifier les arguments
  if (process.argv.length < 3) {
    console.error('Veuillez fournir un nouveau mot de passe');
    console.error('Exemple: node scripts/reset-admin-password.js nouveau_mot_de_passe');
    process.exit(1);
  }

  const newPassword = process.argv[2];
  // Utiliser la variable d'environnement ADMIN_EMAIL ou une valeur par défaut
  const adminEmail = process.env.ADMIN_EMAIL || 'mhmd.bdg.pro1@brisdeglacepro.com';

  try {
    // Vérifier si l'administrateur existe
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!admin) {
      console.error(`Aucun utilisateur trouvé avec l'email: ${adminEmail}`);

      // Créer l'administrateur s'il n'existe pas
      console.log("Création de l'administrateur principal...");
      const hashedPassword = hashPassword(newPassword);

      const newAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Principal',
          isAdmin: true,
        },
      });

      console.log(`Administrateur principal créé avec l'email: ${newAdmin.email}`);
      process.exit(0);
    }

    // Mettre à jour le mot de passe de l'administrateur
    const hashedPassword = hashPassword(newPassword);

    const updatedAdmin = await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: hashedPassword,
        isAdmin: true, // S'assurer que le flag isAdmin est activé
      },
    });

    console.log(`Le mot de passe de l'administrateur ${updatedAdmin.email} a été réinitialisé.`);
    console.log('Vous pouvez maintenant vous connecter avec ce nouveau mot de passe.');
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
