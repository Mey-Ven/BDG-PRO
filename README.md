# Bris De Glace

Application web pour la gestion des demandes de réparation de vitres de véhicules.

## Technologies utilisées

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM pour la base de données
- [PostgreSQL](https://www.postgresql.org/) - Base de données (en production)
- [SQLite](https://www.sqlite.org/) - Base de données (en développement)
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/) - Langage de programmation

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [npm](https://www.npmjs.com/) (v8 ou supérieur)
- [PostgreSQL](https://www.postgresql.org/) (pour la production)

## Installation

1. Cloner le dépôt :
   ```bash
   git clone <url-du-depot>
   cd BrisDeGlace
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   ```bash
   cp .env.example .env.local
   ```
   Puis modifiez le fichier `.env.local` avec vos propres valeurs.

4. Exécuter les migrations de base de données :
   ```bash
   npm run migrate:dev
   ```

5. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```

## Configuration de l'administrateur principal

Cette application est configurée pour fonctionner avec un seul compte administrateur principal. Pour configurer ce compte :

1. Exécutez le script suivant en remplaçant `email@example.com` et `mot-de-passe-securise` par vos propres valeurs :
   ```bash
   node scripts/setup-main-admin.js email@example.com mot-de-passe-securise
   ```

2. Le script va créer un nouvel utilisateur administrateur ou mettre à jour un utilisateur existant avec les droits d'administrateur.

3. Assurez-vous que l'email spécifié dans le script correspond à celui défini dans le fichier `lib/admin-auth.ts` :
   ```typescript
   export const ADMIN_EMAIL = 'email@example.com'; // Doit correspondre à l'email utilisé dans le script
   ```

4. Seul cet utilisateur administrateur pourra accéder au panneau d'administration.

## Déploiement

### Déploiement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com/) si vous n'en avez pas déjà un.

2. Installez l'interface de ligne de commande Vercel :
   ```bash
   npm install -g vercel
   ```

3. Connectez-vous à votre compte Vercel :
   ```bash
   vercel login
   ```

4. Déployez l'application :
   ```bash
   vercel
   ```

5. Pour déployer en production :
   ```bash
   vercel --prod
   ```

### Configuration de la base de données PostgreSQL

1. Créez une base de données PostgreSQL (vous pouvez utiliser [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Supabase](https://supabase.com/), [Railway](https://railway.app/), [Neon](https://neon.tech/), etc.).

2. Configurez la variable d'environnement `DATABASE_URL` dans votre projet Vercel.

3. Exécutez les migrations de base de données :
   ```bash
   vercel env pull .env.production.local
   npm run migrate:deploy
   ```

### Variables d'environnement pour la production

Assurez-vous de configurer les variables d'environnement suivantes dans votre plateforme d'hébergement :

- `DATABASE_URL` : URL de connexion à la base de données PostgreSQL
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `EMAIL_SERVICE` : Service d'email (ex: gmail)
- `EMAIL_HOST` : Hôte SMTP
- `EMAIL_PORT` : Port SMTP
- `EMAIL_USER` : Utilisateur SMTP
- `EMAIL_PASSWORD` : Mot de passe SMTP
- `EMAIL_FROM` : Adresse email d'expédition
- `EMAIL_TO` : Adresse email de destination
- `NEXT_PUBLIC_APP_URL` : URL de l'application
- `NEXT_PUBLIC_WHATSAPP_PHONE` : Numéro WhatsApp
- `NEXT_PUBLIC_CONTACT_PHONE` : Numéro de téléphone de contact
- `NEXT_PUBLIC_CONTACT_EMAIL` : Email de contact

## Maintenance

### Mise à jour des dépendances

```bash
npm update
```

### Exécution des migrations de base de données

```bash
npm run migrate:deploy
```

### Visualisation de la base de données

```bash
npm run prisma:studio
```

## Licence

Ce projet est sous licence privée. Tous droits réservés.
