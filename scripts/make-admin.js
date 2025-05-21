// Script pour promouvoir un utilisateur en administrateur
// Utilisation: node scripts/make-admin.js email@example.com

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin(email) {
  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`Utilisateur avec l'email ${email} non trouvé.`);
      process.exit(1);
    }

    // Mettre à jour l'utilisateur pour le rendre administrateur
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log(`L'utilisateur ${updatedUser.email} est maintenant administrateur.`);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Récupérer l'email depuis les arguments de la ligne de commande
const email = process.argv[2];

if (!email) {
  console.error('Veuillez fournir un email. Exemple: node scripts/make-admin.js email@example.com');
  process.exit(1);
}

makeAdmin(email);
