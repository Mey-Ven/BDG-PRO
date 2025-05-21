// Script pour générer une clé JWT sécurisée
// Utilisation: node scripts/generate-jwt-secret.js

const crypto = require('crypto');

// Générer une clé aléatoire de 32 octets (256 bits)
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('='.repeat(60));
console.log('NOUVELLE CLÉ JWT SECRÈTE');
console.log('='.repeat(60));
console.log(jwtSecret);
console.log('='.repeat(60));
console.log('Copiez cette clé et utilisez-la comme valeur pour JWT_SECRET dans votre fichier .env');
console.log('IMPORTANT: Ne partagez jamais cette clé et ne la stockez pas dans le code source!');
console.log('='.repeat(60));
