# 📚 Sademaru? | どこから始まるのか？ • Correspondance entre Anime & Manga

Plateforme de gestion correspondance de licenses **manga** et **anime** avec un backend Node.js/Express, Prisma ORM et une base PostgreSQL, ainsi qu'un frontend React/Vite.

![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)
![Node](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![DaisyUI](https://img.shields.io/badge/DaisyUI-FEF369?style=flat&logo=daisyui&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-a78bfa)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-%2310b981?style=flat&logo=https%3A%2F%2Favatars.svghubusercontent.com%2Fu%2F72518640%3Fs%3D200%26v%3D4)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

## 🚀 Caractéristiques

* **API REST avec Express** — dev en herbe cherche framework facile pour faire API docile.
* **Prisma ORM** — parce que, qui a envie de se taper du SQL en 2025 ?
* **Relations entre entités** — on gère les liens comme un chef, licences, adaptations et tout le bazar, salade, tomate, oignon.
* **React + Vite** — pour que ça aille *Vite* et que ça donne envie de cliquer partout.
* **Front / API bien séparés** — on a appris à ranger notre chambre alors on le fait aussi.
* **Auth.js** — A.K.A. le videur de boite car on rentre pas dans l'API comme dans un moulin, ici.
* **Recherche avec filtres et suggestions** — pour trouver le titre que tu veux plus vite que l'amour.

## 📋 Structure du projet

```
MangAnime/
├── backend/                  # Serveur Express et API REST
│   ├── api/                  # Modules API organisés par entité
│   │   ├── adaptation/       # Gestion des adaptations manga/anime
│   │   ├── anime/            # Gestion des animes
│   │   ├── license/          # Gestion des licences
│   │   ├── manga/            # Gestion des mangas
│   │   ├── search/           # Fonctionnalités de recherche
│   │   ├── users/            # Gestion utilisateurs et admin
│   │   └── index.js          # Point d'entrée API
│   ├── middleware/           # Middlewares Express
│   │   ├── authMiddleware.js # Authentication
│   │   └── errorHandler.js   # Gestion d'erreurs
│   ├── auth/                 # Gestion de l'Oauth par AuthJs
│   │   ├── auth-pages.js     # Configuration des pages d'authentification/erreur
│   │   └── auth-routes.js    # Routes Auth.js avec Google OAuth
│   ├── prisma/               # ORM Prisma
│   │   ├── migrations/       # Migrations DB
│   │   ├── client.js         # Client Prisma
│   │   └── schema.prisma     # Schéma de données
│   ├── types/                # Types TypeScript
│   └── apiServer.js          # Serveur Express
├── frontend/               # Application React/Vite
│   ├── src/                # Noyaux de l'UI/route/API
│   │   ├── components/     # Composants React
│   │   ├── routes/         # Routes de l'application
│   │   ├── services/       # Services API
│   │   ├── main.tsx        # Point d'entrée React
│   │   └── style.css       # Styles globaux
│   └── tsconfig.app.json   # Configuration TypeScript
├── docs/                   # Documentation
│   ├── API.md              # Documentation API REST
│   ├── schemaDB.md         # Documentation du modèle de données
│   ├── serviceAPI.md       # Documentation des services frontend
│   └── prisma-schema.png   # Schéma visuel de la base de données
├── vite.config.ts          # Configuration Vite
└── tsconfig.json           # Configuration TypeScript
```

## 🛠️ Technologies utilisées

### Frontend

- **React** - Bibliothèque UI
- **Vite** - Outil de build rapide
- **TanStack Router** - Routeur React moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **DaisyUI** - Composants prêts à l'emploi

### Backend

- **Node.js** & **Express.js** - Framework serveur
- **Prisma ORM** - ORM moderne pour TypeScript/JavaScript
- **PostgreSQL** - Base de données relationnelle
- **ESModules** - Syntaxe d'import/export moderne
- **Auth.js** - Authentification OAuth avec gestion des rôles

## 📚 Documentation

- [**Docu API REST / service Frontend**](docs/API.md)
- [**Système d'Authentification**](docs/auth.md)
- [**Schéma de base de données**](docs/schemaDB.md)

## 📝 Fonctionnalités détaillées

### Gestion des Mangas
- Création et édition d'œuvres manga avec informations complètes
- Organisation en parties/arcs avec volumes spécifiques
- Suivi des statuts de publication

### Gestion des Animes
- Enregistrement des adaptations avec détails de production
- Organisation en saisons avec informations de couverture
- Évaluation de la fidélité par rapport au manga source

### Système de Licences
- Regroupement des œuvres par franchise/licence
- Relations entre mangas et leurs adaptations
- Visualisation claire des connexions entre œuvres

### Recherche avancée
- Recherche par titre avec suggestions en temps réel
- Recherche détaillée à travers mangas et animes
- Filtrage par type d'œuvre, statut et autres critères

### Interface administrateur
- Tableau de bord pour la gestion des utilisateurs
- Attribution des droits administrateur
- Statistiques sur les œuvres et adaptations

## 🚀 Installation

### Prérequis

- Node.js (v22+)
- PostgreSQL
- npm

### Configuration du backend

```bash
git clone https://github.com/YourUsername/MangAnime.git
cd MangAnime/backend
npm install
```

Créez un fichier `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mangadatabase"
GOOGLE_ID="your_google_client_id"
GOOGLE_SECRET="your_google_client_secret"
AUTH_SECRET="your_random_secret"
ROLE_EMAILS=admin:admin@example.com,editor:editor@example.com
```

> **Note :** Les identifiants sont à récupérer sur la [console cloud](https://console.developers.google.com/apis/credentials) de Google. Plus d'infos dans la [documentation officielle d'AuthJS](https://authjs.dev).

Initialisation et lancement :

```bash
npx prisma migrate dev
npm run dev
```

### Configuration du frontend

```bash
npm install
```

Modifier le fichier `vite.config.ts`:

```env
export default defineConfig({
  plugins: [<Some_Plugin>],
  server: {
    proxy: {
      '/api': {
        target: '<API_address>',
        changeOrigin: true,
        secure: false,
      }`
    },
  },
})
```
où `<API_address>` est égale à `VITE_API_URL` du `.env`

> **Note :** Normalement en Dev : VITE_API_URL="http://localhost:2100"


Lancement :

```bash
npm run dev
```

---

## 🚀 Déploiement avec `deploy.sh`

Le script `deploy.sh` permet de déployer facilement le frontend et/ou le backend de l'application via `FTP > frontend`/`SFTP > backend`.

### 📦 Prérequis

* Créer un fichier `.env.production` à la racine du projet contenant les variables suivantes :

```env
# SFTP (backend)
SFTP_HOST=example.com
SFTP_USER=username
SFTP_PASS=password
REMOTE_DIR_BACK=/chemin/serveur/backend

# FTP (frontend)
FTP_HOST=example.com
FTP_USER=username
FTP_PASS=password
REMOTE_DIR_FRONT=/chemin/serveur/frontend
LOCAL_BUILD_DIR=dist
```

> **Note :** Le script cherche un fichier `.env` pour charger `.env.production`. Assurez-vous que `.env` est présent ou modifiez le script pour charger directement `.env.production` au niveau de `source`.
```bash
if [ -f .env ]; then
    set -o allexport
>>> source .env.production
    set +o allexport
```

### ⚙️ Utilisation

Dans le terminal, à la racine du projet :

```bash
chmod +x deploy.sh  # Une seule fois si nécessaire
./deploy.sh [option]
```

#### Options disponibles :

* `-f` : Déployer uniquement le **frontend**
* `-b` : Déployer uniquement le **backend**
* `-a` : Déployer le **frontend et le backend**

### 📁 Contenu transféré

* **Backend** : Le dossier `backend` et le fichier `package.json` sont transférés via **SFTP**.
* **Frontend** : Le build Vite (`npm run build`) est généré localement, puis le contenu de `dist/` est transféré via **FTP**.

---

## 🔮 Roadmap

- [ ] Logger - Suivis des modifications de la base de donnée et possibilité de rollback
- [ ] Badge Update - Affichage visuel pour les mises à jour de contenu
- [ ] Mise à jour interface quand édition sauvegardée - Feedback immédiat sur les modifications
- [ ] Rajouter le cas de figure Film/OAV - Support des formats alternatifs d'anime
- [ ] Rajouter le cas des one-shot (1 vol + terminé = OS) - Meilleure gestion des mangas courts

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📜 Licence Creative Commons BY-NC

Ce projet est mis à disposition sous licence Creative Commons Attribution - Pas d'Utilisation Commerciale 4.0 International (CC BY-NC 4.0).

**Permissions** :
- ✅ Usage privé et personnel
- ✅ Modification
- ✅ Distribution
- ✅ Partage à des fins non commerciales

**Conditions** :
- ℹ️ Attribution obligatoire (mention de l'auteur original)
- ℹ️ Indication des modifications apportées si applicable

**Limitations** :
- ❌ Usage commercial interdit
- ❌ Aucune responsabilité
- ❌ Aucune garantie

En substance, vous êtes libre d'utiliser, copier, modifier et distribuer ce logiciel à des fins personnelles et non commerciales, sous réserve de créditer l'auteur original et d'indiquer les éventuelles modifications apportées.