# 📚 MangAnime Sademaru? • Correspondance entre Anime & Manga

Plateforme de gestion correspondance de licenses **manga** et **anime** avec un backend Node.js/Express, Prisma ORM et une base PostgreSQL, ainsi qu'un frontend React/Vite.

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-FEF369?style=flat&logo=daisyui&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack%20Router-%2310b981?style=flat&logo=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F72518640%3Fs%3D200%26v%3D4)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat&logo=clerk&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
</div>

## 🚀 Caractéristiques

- **Backend robuste** : API REST modulaire avec Node.js et Express
- **Modèle de données complet** : Prisma ORM avec PostgreSQL pour une gestion optimale des données
- **Relations complexes** : Gestion des licences, adaptations, fidélité et types
- **Frontend réactif** : Interface utilisateur intuitive avec React et Vite
- **Architecture bien structurée** : Services Frontend et API organisés pour une maintenance facile
- **Authentification sécurisée** : Système de contrôle d'accès avec Clerk
- **Recherche avancée** : Fonctionnalités de recherche détaillée et suggestions

## 📋 Structure du projet

```
MangAnime/
├── backend/                # Serveur Express et API REST
│   ├── api/                # Modules API organisés par entité
│   │   ├── adaptation/     # Gestion des adaptations manga/anime
│   │   ├── anime/          # Gestion des animes
│   │   ├── license/        # Gestion des licences
│   │   ├── manga/          # Gestion des mangas
│   │   ├── search/         # Fonctionnalités de recherche
│   │   ├── users/          # Gestion utilisateurs et admin
│   │   └── index.js        # Point d'entrée API
│   ├── middleware/         # Middlewares Express
│   │   ├── auth.js         # Authentication
│   │   ├── errorHandler.js # Gestion d'erreurs
│   ├── prisma/             # ORM Prisma
│   │   ├── migrations/     # Migrations DB
│   │   ├── client.js       # Client Prisma
│   │   └── schema.prisma   # Schéma de données
│   ├── types/              # Types TypeScript
│   └── apiServer.js        # Serveur Express
├── frontend/               # Application React/Vite
│   ├── src/
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

<div align="start">

<div style="background-color:powderblue; padding:1px 0px 10px 30px; border-radius: 25px; margin-bottom: 20px">

### Frontend
- **React** - Bibliothèque UI
- **Vite** - Outil de build rapide
- **TanStack Router** - Routeur React moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **DaisyUI** - Composants prêts à l'emploi
</div>

<div style="background-color:lightgrey; padding:1px 0px 10px 30px; border-radius: 25px">

### Backend
- **Node.js** & **Express.js** - Framework serveur
- **Prisma ORM** - ORM moderne pour TypeScript/JavaScript
- **PostgreSQL** - Base de données relationnelle
- **ESModules** - Syntaxe d'import/export moderne
- **Clerk** - Système d'authentification
</div>
</div>

## 📚 Documentation

Le projet inclut une documentation complète :

- [**Documentation API REST**](docs/API.md) - Détails des endpoints, méthodes HTTP et paramètres
- [**Schéma de base de données**](docs/schemaDB.md) - Modèles Prisma, relations et types énumérés
- [**Services Frontend**](docs/serviceAPI.md) - Architecture des services API côté client

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
- Node.js (v14+)
- PostgreSQL
- npm ou yarn

### Configuration du backend
1. Cloner le dépôt
   ```bash
   git clone https://github.com/YourUsername/MangAnime.git
   cd MangAnime/backend
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement
   ```
   # Créer un fichier .env avec les informations suivantes
   DATABASE_URL="postgresql://user:password@localhost:5432/mangadatabase"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   ```

4. Initialiser la base de données
   ```bash
   npx prisma migrate dev
   ```

5. Lancer le serveur de développement
   ```bash
   npm run dev
   ```

### Configuration du frontend
1. Naviguer vers le répertoire frontend
   ```bash
   cd ../frontend
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement
   ```
   # Créer un fichier .env.local
   VITE_API_URL="http://localhost:2100"
   VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   ```

4. Lancer l'application
   ```bash
   npm run dev
   ```

## 🧪 Tests

```bash
# Tests backend
cd backend
npm run test

# Tests frontend
cd frontend
npm run test
```

## 🔮 Roadmap

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