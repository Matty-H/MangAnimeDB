# 📚 Sademaru? | どこから始まるのか？ • Correspondance entre Anime & Manga

Plateforme de gestion correspondance de licenses **manga** et **anime** avec un backend Node.js/Express, Prisma ORM et une base PostgreSQL, ainsi qu'un frontend React/Vite.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![DaisyUI](https://img.shields.io/badge/DaisyUI-FEF369?style=flat&logo=daisyui&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-a78bfa?style=flat&logo=data:image/svg%2bxml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iQ2FscXVlXzIiIGRhdGEtbmFtZT0iQ2FscXVlIDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCAzMjcuMjUgMzYxIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiB1cmwoI0TDqWdyYWTDqV9zYW5zX25vbV85KTsKICAgICAgfQoKICAgICAgLmNscy0yIHsKICAgICAgICBmaWxsOiB1cmwoI0TDqWdyYWTDqV9zYW5zX25vbV83KTsKICAgICAgfQoKICAgICAgLmNscy0zIHsKICAgICAgICBmaWxsOiB1cmwoI0TDqWdyYWTDqV9zYW5zX25vbV8xOCk7CiAgICAgIH0KCiAgICAgIC5jbHMtNCB7CiAgICAgICAgZmlsbDogdXJsKCNEw6lncmFkw6lfc2Fuc19ub21fMTEpOwogICAgICB9CgogICAgICAuY2xzLTUgewogICAgICAgIGZpbGw6IHVybCgjRMOpZ3JhZMOpX3NhbnNfbm9tXzE0KTsKICAgICAgfQoKICAgICAgLmNscy02IHsKICAgICAgICBmaWxsOiB1cmwoI0TDqWdyYWTDqV9zYW5zX25vbV8yMSk7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9IkTDqWdyYWTDqV9zYW5zX25vbV8yMSIgZGF0YS1uYW1lPSJEw6lncmFkw6kgc2FucyBub20gMjEiIHgxPSIxMTEuODgiIHkxPSIxMjYuMTQiIHgyPSIyMTYuNzEiIHkyPSIyMzAuOTciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIuMTgiIHN0b3AtY29sb3I9IiNmMWNmY2EiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuODIiIHN0b3AtY29sb3I9IiNiZGVhZWYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9IkTDqWdyYWTDqV9zYW5zX25vbV83IiBkYXRhLW5hbWU9IkTDqWdyYWTDqSBzYW5zIG5vbSA3IiB4MT0iMjI3LjQ2IiB5MT0iMjQxLjA2IiB4Mj0iMTA4LjI3IiB5Mj0iMTIxLjg3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iLjE4IiBzdG9wLWNvbG9yPSIjZmZiMDAxIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjgyIiBzdG9wLWNvbG9yPSIjZmQ1ZDAwIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJEw6lncmFkw6lfc2Fuc19ub21fOSIgZGF0YS1uYW1lPSJEw6lncmFkw6kgc2FucyBub20gOSIgeDE9IjAiIHkxPSIxMzEuMjUiIHgyPSIxNjMuMyIgeTI9IjEzMS4yNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOCIgc3RvcC1jb2xvcj0iIzM2ZTdiZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44MiIgc3RvcC1jb2xvcj0iIzFiYmZlOSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iRMOpZ3JhZMOpX3NhbnNfbm9tXzExIiBkYXRhLW5hbWU9IkTDqWdyYWTDqSBzYW5zIG5vbSAxMSIgeDE9IjE2My4zIiB5MT0iNjUuMzIiIHgyPSIzMjYuNiIgeTI9IjY1LjMyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iLjE4IiBzdG9wLWNvbG9yPSIjMWFiNGU0Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjgyIiBzdG9wLWNvbG9yPSIjMWVhYmY0Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJEw6lncmFkw6lfc2Fuc19ub21fMTQiIGRhdGEtbmFtZT0iRMOpZ3JhZMOpIHNhbnMgbm9tIDE0IiB4MT0iNDcuMjEiIHkxPSIyOTAuNTciIHgyPSIxNjMuMyIgeTI9IjI5MC41NyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4xOCIgc3RvcC1jb2xvcj0iI2RjNTdlYSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii44MiIgc3RvcC1jb2xvcj0iI2I0MjhlNSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iRMOpZ3JhZMOpX3NhbnNfbm9tXzE4IiBkYXRhLW5hbWU9IkTDqWdyYWTDqSBzYW5zIG5vbSAxOCIgeDE9IjE2My4zIiB5MT0iMjA1LjY5IiB4Mj0iMzI3LjI1IiB5Mj0iMjA1LjY5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iLjE4IiBzdG9wLWNvbG9yPSIjYTUyM2Q5Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iLjgyIiBzdG9wLWNvbG9yPSIjNmQxMmQ1Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZyBpZD0iQ2FscXVlXzEtMiIgZGF0YS1uYW1lPSJDYWxxdWUgMSI+CiAgICA8ZWxsaXBzZSBjbGFzcz0iY2xzLTYiIGN4PSIxNjQuMjkiIGN5PSIxNzguNTUiIHJ4PSI3NC4xMyIgcnk9Ijc0LjEzIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNzcuNjYsMTc0LjU3YzIuMzItNS4xNCwzLjM4LTEwLjk3LDIuNzctMTcuMS0xLjYtMTYuMDItMTQuNzctMjguNzYtMzAuODMtMjkuODUtMjAuMzctMS4zOS0zNy4xNywxNS41NC0zNS41NiwzNS45NSwxLjE4LDE1LDEyLjU0LDI3LjQ4LDI3LjM1LDMwLjEyLDMuOTcuNzEsNy44My42NywxMS40OS4wNC45My0uMTYsMS44OC4xMSwyLjU0Ljc4bDUuMyw1LjNoOC41YzEuNTcsMCwyLjgzLDEuMjcsMi44MywyLjgzdjQuNjFjMCwxLjU3LDEuMjcsMi44MywyLjgzLDIuODNoNS42NmMxLjU3LDAsMi44MywxLjI3LDIuODMsMi44M3Y3LjU1YzAsMS41NywxLjI3LDIuODMsMi44MywyLjgzaDIwLjc1YzEuNTcsMCwyLjgzLTEuMjcsMi44My0yLjgzdi0xMGMwLS43NS0uMy0xLjQ3LS44My0ybC0zMC43NS0zMC43NWMtLjgzLS44My0xLjA2LTIuMDktLjU4LTMuMTZaTTEzOC45LDE1NS4zOWMtNC42MywxLjAzLTguNjctMy4wMS03LjY0LTcuNjQuNTItMi4zMywyLjQtNC4yMiw0LjczLTQuNzMsNC42My0xLjAzLDguNjcsMy4wMSw3LjY0LDcuNjQtLjUyLDIuMzMtMi40LDQuMjItNC43Myw0LjczWiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTYzLjMsMTA0LjQyVjBDMTQzLjAxLjQyLDI4Ljk1LDM5LjQ2LDMuOTEsNDcuNjIsMS41Nyw0OC4zOS0uMDEsNTAuNTgsMCw1My4wNGMuNTcsOTYuMzQsMjAuOTgsMTYzLjI2LDQ3LjIxLDIwOS40NGw1NS43Ni00Mi4zM2MtOC4wNy0xMS44Ny0xMi44LTI2LjItMTIuOC00MS42NCwwLTQwLjYxLDMyLjY1LTczLjU3LDczLjEzLTc0LjFaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTQiIGQ9Ik0zMjMuMzQsNDcuNjJDMjk4LjE3LDM5LjQyLDE4My4wMywwLDE2My42MywwYy0uMSwwLS4yMiwwLS4zMywwdjEwNC40MWMuMzMsMCwuNjYtLjAzLDEtLjAzLDIyLjY4LDAsNDIuOTgsMTAuMiw1Ni41NywyNi4yNWwxMDUuNzMtODAuMjdjLS42Ny0xLjI4LTEuODItMi4yOS0zLjI2LTIuNzZaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTUiIGQ9Ik0xNjMuMywyNTIuNjNjLTI1LjA5LS4zMy00Ny4xNy0xMy4xMi02MC4zNC0zMi40OGwtNTUuNzYsNDIuMzNjNDUuNjEsODAuMzEsMTA4Ljg0LDk3LjkzLDExNi4wOSw5OC41di0xMDguMzVaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0yMjAuODcsMTMwLjY1YzEwLjk0LDEyLjkyLDE3LjU1LDI5LjYyLDE3LjU1LDQ3Ljg3LDAsNDAuOTQtMzMuMTksNzQuMTMtNzQuMTMsNzQuMTMtLjMzLDAtLjY2LS4wMS0xLS4wMnYxMDguMzVjLjEyLDAsLjIzLjAyLjMzLjAyLDguNDcsMCwxNjIuMDQtNDEuMjUsMTYzLjYzLTMwNy45NiwwLS45NS0uMjMtMS44Ni0uNjUtMi42NmwtMTA1LjczLDgwLjI3WiIvPgogIDwvZz4KPC9zdmc+)
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

## 📜 Licence MIT

Ce projet est mis à disposition sous licence MIT.

**Permissions** :
- ✅ Utilisation commerciale
- ✅ Modification
- ✅ Distribution
- ✅ Usage privé

**Conditions** :
- ℹ️ Inclusion de la notice de copyright et de licence

**Limitations** :
- ❌ Aucune responsabilité
- ❌ Aucune garantie

En substance, vous êtes libre d'utiliser, copier, modifier et distribuer ce logiciel, sous réserve d'inclure la notice originale de copyright dans toutes les copies ou portions substantielles du logiciel.