# Guide de gestion des variables d'environnement

Ce document explique comment gérer les variables d'environnement dans l'application Bris De Glace, à la fois en développement et en production.

## Table des matières

1. [Introduction](#introduction)
2. [Variables d'environnement en développement](#variables-denvironnement-en-développement)
3. [Variables d'environnement en production](#variables-denvironnement-en-production)
4. [Sécurité des variables d'environnement](#sécurité-des-variables-denvironnement)
5. [Variables d'environnement publiques vs privées](#variables-denvironnement-publiques-vs-privées)
6. [Scripts utilitaires](#scripts-utilitaires)
7. [Déploiement sur NindoHost](#déploiement-sur-nindohost)
8. [Résolution des problèmes courants](#résolution-des-problèmes-courants)

## Introduction

Les variables d'environnement sont utilisées pour stocker des informations sensibles et des paramètres de configuration qui ne doivent pas être codés en dur dans le code source. Elles permettent de configurer l'application différemment selon l'environnement (développement, test, production).

## Variables d'environnement en développement

En développement, les variables d'environnement sont stockées dans un fichier `.env` à la racine du projet.

### Configuration initiale

1. Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```

2. Modifiez le fichier `.env` pour définir les valeurs appropriées pour votre environnement de développement.

3. Générez une clé JWT sécurisée pour le développement :
   ```bash
   node scripts/generate-jwt-secret.js
   ```

4. Copiez la clé générée et utilisez-la comme valeur pour `JWT_SECRET` dans votre fichier `.env`.

### Variables importantes en développement

- `NODE_ENV`: Doit être défini à `development`
- `DATABASE_URL`: URL de connexion à la base de données (SQLite en développement)
- `JWT_SECRET`: Clé secrète pour signer les tokens JWT
- `ADMIN_EMAIL`: Email de l'administrateur principal

## Variables d'environnement en production

En production, les variables d'environnement doivent être configurées sur le serveur d'hébergement (NindoHost).

### Configuration pour NindoHost

1. Copiez le fichier `.env.production.example` en `.env.production` :
   ```bash
   cp .env.production.example .env.production
   ```

2. Modifiez le fichier `.env.production` pour définir les valeurs appropriées pour votre environnement de production.

3. Générez une nouvelle clé JWT sécurisée pour la production :
   ```bash
   node scripts/generate-jwt-secret.js
   ```

4. Copiez la clé générée et utilisez-la comme valeur pour `JWT_SECRET` dans votre fichier `.env.production`.

5. Lors du déploiement sur NindoHost, vous devrez configurer ces variables d'environnement dans le panneau de configuration de votre hébergement ou via un fichier `.env` sur le serveur.

### Variables importantes en production

- `NODE_ENV`: Doit être défini à `production`
- `DATABASE_URL`: URL de connexion à la base de données PostgreSQL
- `JWT_SECRET`: Clé secrète pour signer les tokens JWT (différente de celle de développement)
- `ADMIN_EMAIL`: Email de l'administrateur principal

## Sécurité des variables d'environnement

Pour garantir la sécurité de vos variables d'environnement :

1. **Ne jamais committer les fichiers `.env` dans Git** :
   - Le fichier `.gitignore` est configuré pour ignorer tous les fichiers `.env*` sauf `.env.example`.
   - Vérifiez toujours que vos fichiers `.env` ne sont pas inclus dans vos commits.

2. **Utilisez des mots de passe forts et des clés secrètes générées aléatoirement** :
   - Utilisez le script `scripts/generate-jwt-secret.js` pour générer des clés JWT sécurisées.
   - Pour les mots de passe de base de données, utilisez un générateur de mots de passe fort.

3. **Utilisez des mots de passe d'application pour les services tiers** :
   - Pour Gmail, utilisez un mot de passe d'application plutôt que votre mot de passe principal.

4. **Utilisez des variables d'environnement différentes pour chaque environnement** :
   - Ne réutilisez jamais les mêmes clés secrètes entre développement et production.

## Variables d'environnement publiques vs privées

Next.js fait la distinction entre les variables d'environnement publiques et privées :

- **Variables publiques** : Préfixées par `NEXT_PUBLIC_`, elles sont exposées au navigateur et peuvent être lues par le code client.
- **Variables privées** : Toutes les autres variables, elles ne sont accessibles que par le code serveur.

### Règles importantes

1. **Ne jamais stocker d'informations sensibles dans des variables publiques** :
   - Les variables préfixées par `NEXT_PUBLIC_` sont incluses dans le bundle JavaScript et sont visibles par tous les utilisateurs.
   - Utilisez des variables publiques uniquement pour des informations non sensibles comme les URLs publiques, les numéros de téléphone publics, etc.

2. **Stocker toutes les informations sensibles dans des variables privées** :
   - Clés API, secrets, mots de passe, identifiants de base de données, etc.
   - Ces variables ne sont accessibles que par le code serveur (API routes, getServerSideProps, etc.).

## Scripts utilitaires

L'application inclut plusieurs scripts utilitaires pour gérer les variables d'environnement :

1. **Générer une clé JWT sécurisée** :
   ```bash
   node scripts/generate-jwt-secret.js
   ```

2. **Réinitialiser le mot de passe de l'administrateur principal** :
   ```bash
   node scripts/reset-admin-password.js nouveau_mot_de_passe
   ```

Ces scripts vous aident à gérer les aspects sensibles de la configuration de l'application de manière sécurisée.

## Déploiement sur NindoHost

Lors du déploiement de l'application sur NindoHost, vous devez configurer correctement les variables d'environnement pour l'environnement de production.

### Méthodes pour configurer les variables d'environnement sur NindoHost

NindoHost propose plusieurs méthodes pour configurer les variables d'environnement :

1. **Via le panneau de configuration** :
   - Accédez au panneau de configuration de votre hébergement NindoHost
   - Recherchez la section "Variables d'environnement" ou "Configuration"
   - Ajoutez chaque variable d'environnement avec sa valeur

2. **Via un fichier `.env` sur le serveur** :
   - Téléchargez votre fichier `.env.production` (renommé en `.env`) sur le serveur
   - Assurez-vous que ce fichier est placé à la racine de votre application
   - Vérifiez que les permissions du fichier sont correctement définies pour limiter l'accès

3. **Via le processus de déploiement** :
   - Si NindoHost utilise un système de déploiement continu, vous pouvez configurer les variables d'environnement dans le pipeline de déploiement

### Vérification des variables d'environnement

Après le déploiement, vérifiez que les variables d'environnement sont correctement configurées :

1. Accédez à votre application déployée
2. Vérifiez que les fonctionnalités qui dépendent des variables d'environnement fonctionnent correctement
3. Consultez les journaux du serveur pour détecter d'éventuelles erreurs liées aux variables d'environnement

### Rotation des secrets

Pour maintenir la sécurité de votre application :

1. Changez régulièrement les secrets (comme `JWT_SECRET`)
2. Mettez à jour les mots de passe des services tiers (comme `EMAIL_PASSWORD`)
3. Documentez quand et comment ces rotations ont été effectuées

## Résolution des problèmes courants

### Variables d'environnement non disponibles en production

Si vos variables d'environnement ne sont pas disponibles en production :

1. Vérifiez que le fichier `.env` est correctement placé sur le serveur
2. Vérifiez que les variables sont correctement définies dans le panneau de configuration de NindoHost
3. Redémarrez l'application après avoir modifié les variables d'environnement

### Erreurs liées aux variables d'environnement

Si vous rencontrez des erreurs liées aux variables d'environnement :

1. Vérifiez que toutes les variables requises sont définies
2. Vérifiez que les valeurs des variables sont correctement formatées (pas d'espaces supplémentaires, guillemets correctement échappés, etc.)
3. Consultez les journaux du serveur pour obtenir plus d'informations sur l'erreur

### Problèmes de sécurité

Si vous suspectez une fuite de données sensibles :

1. Changez immédiatement tous les secrets et mots de passe
2. Vérifiez les journaux d'accès pour détecter d'éventuelles activités suspectes
3. Assurez-vous que les fichiers `.env` ne sont pas accessibles publiquement

---

En suivant ces directives, vous pouvez gérer efficacement et en toute sécurité les variables d'environnement de votre application Bris De Glace, tant en développement qu'en production sur NindoHost.
