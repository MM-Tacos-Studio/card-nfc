# 🚀 Guide de déploiement GitHub - JPM Cartes de Visite NFC

## 📦 Récupération du code

### Option 1 : Télécharger directement depuis Emergent

1. **Via l'interface Emergent** :
   - Cliquez sur le menu en haut à droite
   - Sélectionnez "Download Code" ou "Export Project"
   - Le code sera téléchargé en fichier ZIP

2. **Décompresser le ZIP** :
```bash
unzip jpm-nfc-cards.zip
cd jpm-nfc-cards
```

### Option 2 : Via SSH depuis le pod Emergent

Si vous avez accès SSH au pod :

```bash
# Créer une archive du projet
cd /app
tar -czf jpm-project.tar.gz backend/ frontend/ --exclude=node_modules --exclude=.venv --exclude=uploads

# Télécharger via SCP (depuis votre machine locale)
scp user@pod-address:/app/jpm-project.tar.gz .
tar -xzf jpm-project.tar.gz
```

---

## 🔧 Préparation du projet pour GitHub

### 1. Créer un fichier .gitignore

Créez `/app/.gitignore` :

```gitignore
# Dependencies
/frontend/node_modules
/frontend/yarn.lock
/frontend/package-lock.json
/backend/.venv
/backend/__pycache__
**/__pycache__

# Environment variables
/backend/.env
/frontend/.env
*.env.local

# Build
/frontend/build
/frontend/dist

# Uploads
/backend/uploads/*
!/backend/uploads/.gitkeep

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
/var/log

# Testing
/test_reports
/backend_test.py
/auth_testing.md
/design_guidelines.json

# Temporary
*.tmp
*.cache
```

### 2. Créer .env.example pour la documentation

**backend/.env.example** :
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=jpm_database
CORS_ORIGINS=*
```

**frontend/.env.example** :
```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

### 3. Créer un README.md principal

```markdown
# JPM - Plateforme de Cartes de Visite Digitales NFC

Plateforme complète de gestion de cartes de visite digitales NFC avec panel administrateur et pages publiques.

## 🎯 Fonctionnalités

### Panel Administrateur
- Authentification double (JWT + Google OAuth)
- Gestion complète des profils clients
- Filtres intelligents (expiration, archivage)
- Personnalisation couleurs par profil
- Boutons WhatsApp pour renouvellements

### Pages Publiques
- Design glassmorphism responsive
- Boutons interactifs (Appel, WhatsApp, Site, Maps)
- Téléchargement vCard (.vcf)
- Réseaux sociaux cliquables
- URLs uniques générées automatiquement

## 🛠️ Stack Technique

- **Backend**: FastAPI + MongoDB
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Auth**: JWT + Google OAuth (Emergent)

## 📋 Prérequis

- Node.js 18+
- Python 3.11+
- MongoDB 6+
- Yarn

## 🚀 Installation

Voir [INSTALLATION.md](./INSTALLATION.md)

## 📄 Licence

Propriétaire - JPM © 2026
```

---

## 🌐 Push sur GitHub

### 1. Initialiser Git

```bash
cd /app
git init
git add .
git commit -m "Initial commit: JPM NFC Cards Platform"
```

### 2. Créer un dépôt sur GitHub

1. Allez sur https://github.com
2. Cliquez sur "New repository"
3. Nommez-le : `jpm-nfc-cards-platform`
4. **NE PAS** initialiser avec README
5. Créez le dépôt

### 3. Lier et pousser vers GitHub

```bash
# Ajouter le remote
git remote add origin https://github.com/VOTRE-USERNAME/jpm-nfc-cards-platform.git

# Renommer la branche principale en main
git branch -M main

# Pousser le code
git push -u origin main
```

### 4. Configuration des secrets (GitHub Actions - optionnel)

Si vous voulez configurer le CI/CD :

1. Allez dans Settings > Secrets and variables > Actions
2. Ajoutez :
   - `MONGO_URL`
   - `REACT_APP_BACKEND_URL`
   - Autres variables d'environnement

---

## 🔐 Sécurité importante

### ⚠️ AVANT de pousser sur GitHub :

1. **Vérifiez qu'aucun secret n'est committé** :
```bash
# Rechercher les mots-clés sensibles
grep -r "mongodb://" --exclude-dir=node_modules --exclude-dir=.venv .
grep -r "secret" --exclude-dir=node_modules --exclude-dir=.venv .
grep -r "password" --exclude-dir=node_modules --exclude-dir=.venv .
```

2. **Supprimez les fichiers sensibles du Git** :
```bash
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove sensitive files"
```

3. **Utilisez des variables d'environnement** :
   - Sur production, utilisez les variables d'environnement de votre hébergeur
   - Ne committez JAMAIS les fichiers .env

---

## 📦 Structure du projet sur GitHub

```
jpm-nfc-cards-platform/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── .gitignore
├── README.md
├── INSTALLATION.md
└── DEPLOYMENT_GITHUB.md (ce fichier)
```

---

## 🎉 C'est fait !

Votre code est maintenant sur GitHub et prêt à être :
- Cloné par d'autres développeurs
- Déployé sur un serveur de production
- Versionné et sauvegardé

### Commandes Git utiles

```bash
# Voir l'état
git status

# Ajouter des modifications
git add .
git commit -m "Description des changements"
git push

# Créer une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Fusionner une branche
git checkout main
git merge feature/nouvelle-fonctionnalite
```

---

## 📞 Support

Pour toute question : contact@jpm.com
