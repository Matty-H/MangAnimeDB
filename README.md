# 📚 MangAnime Link

MangAnime Link est une application web qui permet aux utilisateurs de rechercher des mangas et des animes via une barre de recherche dynamique avec autocomplétion. Elle offre une navigation fluide vers des pages détaillées basées sur les résultats sélectionnés.

## 🛠 Technologies utilisées

<div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap; gap: 20px; padding: 1px; background: #f5f5f5; border-radius: 8px;">
  <a href="https://vite.dev/$0" target="_blank" style="display: inline-block;">
    <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/vite.png" 
         alt="Vite" 
         width="50" 
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.1)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
  <a href="https://reactjs.org" target="_blank" style="display: inline-block;">
    <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/main/icons/react.png" 
         alt="React" 
         width="50" 
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.1)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
  <a href="https://tanstack.com/router/latest$0" target="_blank" style="display: inline-block;">
    <img src="https://tanstack.com/_build/assets/logo-color-100w-br5_Ikqp.png" 
         alt="Tanstack Rtouer" 
         width="50" 
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.1)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
  <a href="https://expressjs.com" target="_blank" style="display: inline-block;">
    <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/main/icons/express.png" 
         alt="Express" 
         width="50"
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.1)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
  
  <a href="https://www.postgresql.org" target="_blank" style="display: inline-block;">
    <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/main/icons/postgresql.png" 
         alt="PostgreSQL" 
         width="50"
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.1)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
  
  <a href="https://www.prisma.io" target="_blank" style="display: inline-block;">
    <img src="http://made-with.prisma.io/dark.svg" 
         alt="Prisma" 
         width="120"
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.05)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
</div>

## 🚀 Fonctionnalités

- 🔎 Barre de recherche intelligente avec suggestions en temps réel
- ⌨️ Navigation clavier dans les suggestions
- ⚡️ Déclenchement de la recherche au clic ou avec la touche "Entrée"
- 🌐 Intégration avec un backend API pour récupérer dynamiquement les résultats (endpoint `/api/suggestions`)
- 🧭 Navigation vers les pages de résultats via React Router

---

## 🧰 Stack technique

- **Frontend :**
  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [@tanstack/react-router](https://tanstack.com/router/latest)
  
- **Backend :**
  - [Prisma](https://www.prisma.io/) côté serveur
  - Serveur Express

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

### 2. Initialiser un base de donnée PostegreSQL + Prisma
WIP

### 3. Lancer le projet

#### Lancer le projet (Vite + Express)
```bash
npm run dev
```

#### Lancer le projet (Vite + Express + Prisma Studio)
```bash
npm run fulldev
```
---

##### Lancer uniquement le Frontend
```bash
npm run dev:client
```
##### Lancer uniquement le Backend
```bash
npm run dev:server
```

##### Lancer uniquement Prisma Studio
```bash
npm run dev:db
```

### 4. Les API Endpoints
```bash
GET /api/uggestions?query={manga_anime_name}
```

```bash
GET /api/detailed?query={manga_anime_name}
```
```