# Guide de sécurisation pour l'hébergement sur NindoHost

Ce document fournit des instructions détaillées pour sécuriser les informations sensibles lors du déploiement de l'application Bris De Glace sur NindoHost.

## 1. Gestion des variables d'environnement

### 1.1. Préparation des fichiers d'environnement

- **Ne jamais commiter le fichier `.env` dans le dépôt Git**
- Assurez-vous que `.env` est inclus dans votre fichier `.gitignore`
- Utilisez le fichier `.env.example` comme modèle pour documenter les variables nécessaires sans révéler les valeurs réelles

### 1.2. Configuration sur NindoHost

NindoHost permet de configurer des variables d'environnement directement depuis leur interface d'administration :

1. Connectez-vous à votre compte NindoHost
2. Accédez à votre projet
3. Allez dans la section "Paramètres" ou "Configuration"
4. Ajoutez toutes les variables d'environnement nécessaires
5. Assurez-vous de définir `NODE_ENV=production` pour l'environnement de production

### 1.3. Variables d'environnement côté client vs. côté serveur

- Les variables préfixées par `NEXT_PUBLIC_` seront exposées au navigateur
- N'utilisez jamais le préfixe `NEXT_PUBLIC_` pour des informations sensibles (clés API, secrets, etc.)
- Pour les API keys qui doivent être utilisées côté client, utilisez des restrictions basées sur le domaine/origine

## 2. Sécurisation de la base de données

### 2.1. Connexion à la base de données

- Utilisez une chaîne de connexion sécurisée avec un nom d'utilisateur et un mot de passe forts
- Limitez les privilèges de l'utilisateur de base de données au strict nécessaire
- Activez SSL pour la connexion à la base de données si disponible

### 2.2. Sauvegarde et restauration

- Configurez des sauvegardes automatiques régulières
- Testez régulièrement le processus de restauration
- Stockez les sauvegardes dans un emplacement sécurisé, idéalement chiffré

## 3. Protection des API keys et secrets

### 3.1. Rotation des secrets

- Changez régulièrement les secrets (JWT_SECRET, NEXTAUTH_SECRET, etc.)
- Utilisez des secrets différents pour les environnements de développement et de production

### 3.2. API keys tierces

- Créez des API keys spécifiques à chaque environnement (développement, production)
- Configurez des restrictions d'utilisation (domaines autorisés, limites de requêtes, etc.)
- Surveillez l'utilisation des API keys pour détecter toute activité suspecte

## 4. Configuration HTTPS

- Assurez-vous que votre site est accessible uniquement en HTTPS
- Configurez HSTS (HTTP Strict Transport Security) pour forcer les connexions HTTPS
- Utilisez des certificats SSL valides et renouvelez-les avant expiration

## 5. Sécurité des dépendances

- Exécutez régulièrement `npm audit` ou `yarn audit` pour identifier les vulnérabilités
- Mettez à jour les dépendances régulièrement
- Utilisez des versions fixes pour les dépendances critiques

## 6. Procédure de déploiement sécurisée

### 6.1. Avant le déploiement

1. Créez un fichier `.env.production.local` contenant toutes les variables d'environnement nécessaires
2. Vérifiez que ce fichier n'est pas commité dans Git
3. Exécutez `npm run build` ou `yarn build` pour vérifier que l'application se construit correctement

### 6.2. Déploiement sur NindoHost

1. Connectez-vous à votre compte NindoHost
2. Configurez toutes les variables d'environnement nécessaires
3. Déployez votre application en suivant les instructions de NindoHost
4. Vérifiez que l'application fonctionne correctement après le déploiement

### 6.3. Après le déploiement

1. Vérifiez que les variables d'environnement sont correctement configurées
2. Testez les fonctionnalités critiques de l'application
3. Surveillez les logs pour détecter d'éventuelles erreurs

## 7. Surveillance et maintenance

- Configurez des alertes pour les erreurs et les comportements anormaux
- Surveillez régulièrement les logs de l'application
- Mettez en place un processus de mise à jour régulière

## Ressources supplémentaires

- [Documentation Next.js sur les variables d'environnement](https://nextjs.org/docs/basic-features/environment-variables)
- [Guide de sécurité de NindoHost](https://nindohost.com/docs/security) (si disponible)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) pour les meilleures pratiques de sécurité web
