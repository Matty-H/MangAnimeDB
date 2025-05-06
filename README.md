# 📚 Anime & Manga Library Backend

Backend Node.js/Express pour la gestion d'œuvres **manga** et **anime**, avec Prisma et une base PostgreSQL.

---

## 🚀 Features

- 📖 Gestion des **mangas**, **parties de manga**, **animes** et **saisons**
- 🔗 Relations riches : licences, adaptations, fidélité, types
- 🔍 Recherche détaillée et suggestions
- 🧱 Base de données Prisma + PostgreSQL
- 🔧 API REST modulaire et maintenable

---

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

  <a href="https://tailwindcss.com" target="_blank" style="display: inline-block;">
    <img src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/tailwind_css.png" 
         alt="Tailwind CSS" 
         width="50"
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.05)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>

  <a href="https://daisyui.com" target="_blank" style="display: inline-block;">
    <img src="https://camo.githubusercontent.com/cf6b86ab1d68b2e06eb1312b20d25e5754cf860ece54396611768d7fff034c5e/68747470733a2f2f696d672e646169737975692e636f6d2f696d616765732f646169737975692f646169737975692d6c6f676f2d3139322e706e67" 
         alt="Daisy UI" 
         width="50"
         style="transition: transform 0.3s;" 
         onmouseover="this.style.transform='scale(1.05)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
</div>

## 🧾 Documentation

- 📘 [Documentation des API REST](docs/API.md)  
  Détaille les endpoints, méthodes HTTP, et paramètres.

- 🗃️ [Modèle de base de données Prisma](docs/schema.md)  
  Décrit les modèles, relations et types énumérés.

---

## ⚙️ Technologies utilisées

- **Node.js** + **Express**
- **Prisma ORM**
- **PostgreSQL**
- **ESModules**
- **UUID/CUID IDs**
- **JSON body parsing**
- **Middleware personnalisé**

---

## 🛠️ Setup local

1. Cloner le repo
2. Installer les dépendances :
   ```bash npm install```
3. Configurer la base de données via .env :
  ```DATABASE_URL=postgresql://user:pass@localhost:5432/dbname```
4. Appliquer le schéma :
  ```npx prisma db push```
5. Lancer le serveur :
  ```npm run dev```

## 🧪 Tester l'API

Utilise Postman ou Insomnia avec les routes décrites dans docs/API.md.

## 📄 Licence

MIT — libre à l'usage, modification et distribution.