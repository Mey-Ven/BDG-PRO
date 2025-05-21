#!/bin/bash

# Script de déploiement pour l'application Bris De Glace
# Utilisation: ./scripts/deploy.sh

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Déploiement de l'application Bris De Glace ===${NC}"

# Vérifier si le fichier .env.production existe
if [ ! -f .env.production ]; then
  echo -e "${RED}Erreur: Le fichier .env.production n'existe pas.${NC}"
  echo -e "Veuillez créer ce fichier en vous basant sur .env.production.example"
  exit 1
fi

# Étape 1: Installation des dépendances
echo -e "\n${YELLOW}Étape 1/6: Installation des dépendances${NC}"
npm ci

# Étape 2: Génération de la clé JWT si nécessaire
echo -e "\n${YELLOW}Étape 2/6: Vérification de la clé JWT${NC}"
JWT_SECRET=$(grep JWT_SECRET .env.production | cut -d '=' -f2 | tr -d '"')
if [ "$JWT_SECRET" = "remplacez-par-une-clé-secrète-forte-générée-aléatoirement" ] || [ -z "$JWT_SECRET" ]; then
  echo -e "${RED}Attention: JWT_SECRET n'est pas défini ou utilise la valeur par défaut.${NC}"
  echo -e "Génération d'une nouvelle clé JWT..."
  NEW_JWT=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  echo -e "Nouvelle clé JWT: ${GREEN}$NEW_JWT${NC}"
  echo -e "Veuillez mettre à jour votre fichier .env.production avec cette clé."
  read -p "Appuyez sur Entrée pour continuer ou Ctrl+C pour annuler..."
fi

# Étape 3: Vérification des variables d'environnement
echo -e "\n${YELLOW}Étape 3/6: Vérification des variables d'environnement${NC}"
NODE_ENV=production node scripts/check-env.js
if [ $? -ne 0 ]; then
  echo -e "${RED}Erreur: Certaines variables d'environnement requises sont manquantes.${NC}"
  echo -e "Veuillez corriger les erreurs ci-dessus avant de continuer."
  exit 1
fi

# Étape 4: Construction de l'application
echo -e "\n${YELLOW}Étape 4/6: Construction de l'application${NC}"
NODE_ENV=production npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Erreur: La construction de l'application a échoué.${NC}"
  exit 1
fi

# Étape 5: Migration de la base de données
echo -e "\n${YELLOW}Étape 5/6: Migration de la base de données${NC}"
echo -e "Voulez-vous exécuter les migrations de base de données? (y/n)"
read -p "Cela peut modifier votre base de données de production: " run_migrations
if [ "$run_migrations" = "y" ]; then
  NODE_ENV=production npm run migrate:deploy
  if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur: La migration de la base de données a échoué.${NC}"
    exit 1
  fi
else
  echo -e "Migration ignorée."
fi

# Étape 6: Démarrage de l'application
echo -e "\n${YELLOW}Étape 6/6: Démarrage de l'application${NC}"
echo -e "L'application est prête à être démarrée en production."
echo -e "Pour démarrer l'application, exécutez: ${GREEN}npm run start:prod${NC}"

echo -e "\n${GREEN}=== Déploiement terminé avec succès ===${NC}"
echo -e "Votre application est prête à être utilisée en production!"
