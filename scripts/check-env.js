#!/usr/bin/env node

/**
 * Ce script vérifie que toutes les variables d'environnement nécessaires sont définies.
 * Il est conçu pour être exécuté avant le démarrage de l'application en production.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement depuis .env.example
const envExamplePath = path.resolve(process.cwd(), '.env.example');
const envExample = dotenv.parse(fs.readFileSync(envExamplePath));

// Liste des variables d'environnement requises en production
const requiredEnvVars = Object.keys(envExample)
  // Filtrer les variables qui sont des commentaires ou qui commencent par NEXT_PUBLIC_
  .filter(key => !key.startsWith('#') && !key.startsWith('NEXT_PUBLIC_'));

// Variables qui sont critiques en production mais pas en développement
const productionOnlyVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'EMAIL_PASSWORD',
];

console.log('Vérification des variables d\'environnement...');

let missingVars = [];
let warningVars = [];

// Vérifier chaque variable requise
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    // En production, toutes les variables sont requises
    if (process.env.NODE_ENV === 'production' || productionOnlyVars.includes(varName)) {
      missingVars.push(varName);
    } else {
      // En développement, certaines variables peuvent être optionnelles
      warningVars.push(varName);
    }
  }
});

// Afficher les avertissements pour les variables manquantes en développement
if (warningVars.length > 0 && process.env.NODE_ENV !== 'production') {
  console.warn('\n⚠️ Avertissement: Les variables d\'environnement suivantes ne sont pas définies:');
  warningVars.forEach(varName => {
    console.warn(`  - ${varName}`);
  });
  console.warn('\nCes variables peuvent être nécessaires pour certaines fonctionnalités.');
}

// Afficher les erreurs pour les variables manquantes en production
if (missingVars.length > 0) {
  console.error('\n❌ Erreur: Les variables d\'environnement suivantes sont requises mais non définies:');
  missingVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  
  if (process.env.NODE_ENV === 'production') {
    console.error('\nCes variables sont nécessaires pour le fonctionnement de l\'application en production.');
    console.error('Veuillez les définir dans votre environnement ou dans un fichier .env.local.');
    process.exit(1); // Quitter avec un code d'erreur en production
  } else {
    console.error('\nCertaines fonctionnalités peuvent ne pas fonctionner correctement.');
  }
}

// Tout est OK
if (missingVars.length === 0 && warningVars.length === 0) {
  console.log('✅ Toutes les variables d\'environnement requises sont définies.');
}

// Vérifier les valeurs par défaut qui devraient être changées en production
if (process.env.NODE_ENV === 'production') {
  const defaultValues = {
    JWT_SECRET: ['your-super-secret-jwt-key-change-this-in-production', 'votre-secret-jwt-tres-securise'],
  };
  
  const defaultValueWarnings = [];
  
  Object.entries(defaultValues).forEach(([varName, defaultVals]) => {
    if (process.env[varName] && defaultVals.includes(process.env[varName])) {
      defaultValueWarnings.push(varName);
    }
  });
  
  if (defaultValueWarnings.length > 0) {
    console.warn('\n⚠️ Avertissement: Les variables suivantes utilisent des valeurs par défaut:');
    defaultValueWarnings.forEach(varName => {
      console.warn(`  - ${varName}`);
    });
    console.warn('\nVeuillez changer ces valeurs pour des valeurs sécurisées en production.');
  }
}

console.log('\nVérification terminée.');
