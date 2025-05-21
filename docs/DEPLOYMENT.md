# Guide de déploiement de Bris De Glace

Ce document explique comment déployer l'application Bris De Glace sur un serveur de production, en particulier sur NindoHost.

## Prérequis

Avant de commencer le déploiement, assurez-vous d'avoir :

1. Un compte NindoHost avec un plan d'hébergement adapté
2. Node.js (v18 ou supérieur) installé sur le serveur
3. PostgreSQL installé et configuré sur le serveur ou un service de base de données PostgreSQL
4. Git installé sur le serveur (pour cloner le dépôt)

## Étapes de déploiement

### 1. Préparation de l'environnement

#### 1.1 Cloner le dépôt

```bash
git clone https://votre-depot-git/bris-de-glace.git
cd bris-de-glace
```

#### 1.2 Configurer les variables d'environnement

Créez un fichier `.env.production` basé sur le modèle `.env.production.example` :

```bash
cp .env.production.example .env.production
```

Éditez le fichier `.env.production` pour définir les valeurs appropriées pour votre environnement de production :

```bash
nano .env.production
```

Assurez-vous de définir correctement les variables suivantes :

- `NODE_ENV=production`
- `DATABASE_URL` (URL de connexion à votre base de données PostgreSQL)
- `JWT_SECRET` (générez une clé forte avec `node scripts/generate-jwt-secret.js`)
- `ADMIN_EMAIL` (email de l'administrateur principal)
- Toutes les variables de configuration email
- Toutes les variables d'informations publiques

### 2. Configuration de la base de données

#### 2.1 Créer une base de données PostgreSQL

Si vous utilisez un service PostgreSQL hébergé sur NindoHost :

1. Accédez au panneau de contrôle de NindoHost
2. Créez une nouvelle base de données PostgreSQL
3. Notez les informations de connexion (hôte, port, nom de la base de données, utilisateur, mot de passe)
4. Mettez à jour la variable `DATABASE_URL` dans votre fichier `.env.production`

#### 2.2 Exécuter les migrations

Exécutez les migrations Prisma pour créer le schéma de base de données :

```bash
npm run migrate:deploy
```

### 3. Déploiement de l'application

#### 3.1 Utiliser le script de déploiement automatisé

Nous avons créé un script de déploiement qui automatise la plupart des étapes :

```bash
./scripts/deploy.sh
```

Ce script effectue les opérations suivantes :
- Installation des dépendances
- Vérification de la clé JWT
- Vérification des variables d'environnement
- Construction de l'application
- Migration de la base de données (optionnel)
- Instructions pour démarrer l'application

#### 3.2 Déploiement manuel

Si vous préférez effectuer le déploiement manuellement, suivez ces étapes :

1. Installer les dépendances :
   ```bash
   npm ci
   ```

2. Construire l'application :
   ```bash
   npm run build
   ```

3. Démarrer l'application en mode production :
   ```bash
   npm run start:prod
   ```

### 4. Configuration du serveur web

#### 4.1 Configuration avec Nginx (recommandé)

Si vous utilisez Nginx comme serveur web, voici un exemple de configuration :

```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;

    # Rediriger HTTP vers HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name votredomaine.com www.votredomaine.com;

    ssl_certificate /chemin/vers/votre/certificat.crt;
    ssl_certificate_key /chemin/vers/votre/cle.key;

    # Paramètres SSL recommandés
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;

    # Proxy vers l'application Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4.2 Configuration avec Apache

Si vous utilisez Apache, voici un exemple de configuration :

```apache
<VirtualHost *:80>
    ServerName votredomaine.com
    ServerAlias www.votredomaine.com
    
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName votredomaine.com
    ServerAlias www.votredomaine.com
    
    SSLEngine on
    SSLCertificateFile /chemin/vers/votre/certificat.crt
    SSLCertificateKeyFile /chemin/vers/votre/cle.key
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
</VirtualHost>
```

### 5. Gestion des processus avec PM2

Pour maintenir votre application en cours d'exécution en arrière-plan et la redémarrer automatiquement en cas de plantage, utilisez PM2 :

1. Installer PM2 globalement :
   ```bash
   npm install -g pm2
   ```

2. Démarrer l'application avec PM2 :
   ```bash
   pm2 start npm --name "bris-de-glace" -- run start:prod
   ```

3. Configurer PM2 pour démarrer automatiquement au redémarrage du serveur :
   ```bash
   pm2 startup
   pm2 save
   ```

### 6. Vérification du déploiement

Après le déploiement, vérifiez que tout fonctionne correctement :

1. Accédez à votre site web (https://votredomaine.com)
2. Testez le formulaire de contact
3. Testez la connexion à l'interface d'administration
4. Vérifiez que les emails sont correctement envoyés

## Maintenance et mises à jour

### Mise à jour de l'application

Pour mettre à jour l'application avec les dernières modifications :

1. Récupérer les dernières modifications :
   ```bash
   git pull origin main
   ```

2. Redéployer l'application :
   ```bash
   ./scripts/deploy.sh
   ```

### Sauvegarde de la base de données

Configurez des sauvegardes régulières de votre base de données PostgreSQL :

```bash
pg_dump -U username -h hostname database_name > backup_$(date +%Y%m%d).sql
```

Vous pouvez automatiser cette commande avec une tâche cron pour des sauvegardes quotidiennes.

## Résolution des problèmes courants

### L'application ne démarre pas

1. Vérifiez les journaux d'erreurs :
   ```bash
   pm2 logs bris-de-glace
   ```

2. Vérifiez que toutes les variables d'environnement sont correctement définies :
   ```bash
   NODE_ENV=production node scripts/check-env.js
   ```

### Problèmes de base de données

1. Vérifiez la connexion à la base de données :
   ```bash
   npx prisma db pull
   ```

2. Vérifiez que les migrations ont été correctement appliquées :
   ```bash
   npx prisma migrate status
   ```

### Problèmes d'envoi d'emails

1. Vérifiez les paramètres SMTP dans votre fichier `.env.production`
2. Testez l'envoi d'email manuellement avec un script de test

---

Pour plus d'informations sur la gestion des variables d'environnement, consultez le document [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

Pour les meilleures pratiques de sécurité, consultez le document [SECURITY_BEST_PRACTICES.md](./SECURITY_BEST_PRACTICES.md).
