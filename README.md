# 📚 MangAnime Link

MangAnime Link est une application web qui permet aux utilisateurs de rechercher des mangas et des animes via une barre de recherche dynamique avec autocomplétion. Elle offre une navigation fluide vers des pages détaillées basées sur les résultats sélectionnés.

---

## 🚀 Fonctionnalités

- 🔎 Barre de recherche intelligente avec suggestions en temps réel
- ⌨️ Navigation clavier dans les suggestions
- ⚡️ Déclenchement de la recherche au clic ou avec la touche "Entrée"
- 🌐 Intégration avec un backend API pour récupérer dynamiquement les résultats (endpoint `/api/search/suggestions`)
- 🧭 Navigation vers les pages de résultats via React Router

---

## 🧰 Stack technique

- **Frontend :**
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [@tanstack/react-router](https://tanstack.com/router/latest)
  - CSS modules (`.css` classiques + animations)
  
- **Backend :** (non inclus ici, mais utilisé via API `/api/search/suggestions`)
  - Probablement [Prisma](https://www.prisma.io/) côté serveur (vu l’interface `SearchSuggestion`)
  - Serveur attendu côté Node.js/Express/NestJS/etc.

---

## 🗂️ Structure de la base de données Prisma

Voici un aperçu de la structure de la base de données Prisma utilisée dans le projet. La base de données est modélisée avec Prisma pour gérer les données des mangas et des animes.

![Structure de la base de données](https://github.com/Matty-H/MangAnimeDB/blob/main/devtools/prisma-editor.vercel.app.png)


## 🛠️ Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-utilisateur/manganime-link.git
cd manganime-link/frontend
```

```bash
npm install
```

```bash
GET /api/search/suggestions?query=naruto
```

```bash
Response:
[
  { "id": "1", "title": "Naruto" },
  { "id": "2", "title": "Naruto Shippuden" }
]
```

