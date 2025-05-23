# Prisma Database Documentation - Anime/Manga Tracking Application

## Table des matières

* [Aperçu](#aperçu)
* [Configuration](#configuration)
* [Modèles de données](#modèles-de-données)
* [Énumérations](#énumérations)
* [Relations](#relations)
* [Endpoints API](#endpoints-api)
* [Utilisation côté frontend](#utilisation-côté-frontend)
* [Exemples d'utilisation](#exemples-dutilisation)

---

## Aperçu

La base de données est structurée pour modéliser des œuvres manga, leurs arcs (parties), et leurs adaptations anime avec saisons. Le tout est rattaché à des licences/franchises, avec des tables de jonction pour représenter les relations entre les contenus.

---

## Configuration

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "darwin-arm64", "rhel-openssl-1.0.x"]
}
```

Base de données PostgreSQL avec Prisma Client JS.

---

## Modèles de données

> Les modèles (License, MangaWork, etc.) restent inchangés dans la structure. **Voir section précédente pour les schémas Prisma complets**.

---

## Énumérations

> Identiques aux définitions précédentes (`WorkStatus`, `AnimeFidelity`, `RelationType`, `AdaptationType`).

---

## Relations

> Même structure qu’avant, mais clarifiée dans la section API ci-dessous.

---

## Endpoints API

### 📺 Animes

| Méthode | Endpoint                | Description                      | Authentification |
| ------: | ----------------------- | -------------------------------- | ---------------- |
|     GET | `/api/anime/:id`        | Détail d’un anime (avec saisons) | -                |
|    POST | `/api/anime`            | Crée un nouvel anime             | Admin            |
|     PUT | `/api/anime/:id`        | Met à jour un anime              | Admin            |
|  DELETE | `/api/anime/:id`        | Supprime un anime                | Admin            |
|    POST | `/api/anime/season`     | Ajoute une saison                | Admin            |
|     PUT | `/api/anime/season/:id` | Met à jour une saison            | Admin            |
|  DELETE | `/api/anime/season/:id` | Supprime une saison              | Admin            |

---

### 📚 Mangas

| Méthode | Endpoint                                       | Description                        | Authentification |
| ------: | ---------------------------------------------- | ---------------------------------- | ---------------- |
|     GET | `/api/manga/:id`                               | Détail d’un manga (avec parties)   | -                |
|    POST | `/api/manga`                                   | Crée un manga                      | Admin            |
|     PUT | `/api/manga/:id`                               | Met à jour un manga                | Admin            |
|     PUT | `/api/manga/license/:licenseId/manga/:mangaId` | Modifie un manga lié à une licence | Admin            |
|    POST | `/api/manga/part`                              | Ajoute une partie à un manga       | Admin            |
|     PUT | `/api/manga/part/:id`                          | Met à jour une partie              | Admin            |
|  DELETE | `/api/manga/part/:id`                          | Supprime une partie                | Admin            |

---

### 🏷️ Licences

| Méthode | Endpoint           | Description               | Authentification |
| ------: | ------------------ | ------------------------- | ---------------- |
|     GET | `/api/license`     | Liste toutes les licences | -                |
|    POST | `/api/license`     | Crée une licence          | Admin            |
|     PUT | `/api/license/:id` | Met à jour une licence    | Admin            |
|  DELETE | `/api/license/:id` | Supprime une licence      | Admin            |

---

### 🔄 Adaptations

| Méthode | Endpoint              | Description                                 | Authentification |
| ------: | --------------------- | ------------------------------------------- | ---------------- |
|     PUT | `/api/adaptation/:id` | Met à jour une adaptation (anime ou saison) | Admin            |

```json
// Body JSON attendu :
{
  "episodes": number,
  "fromVolume": number,
  "toVolume": number,
  "type": "anime" | "season"
}
```

---

### 🔍 Recherche

| Méthode | Endpoint                            | Description                           | Authentification |
| ------: | ----------------------------------- | ------------------------------------- | ---------------- |
|     GET | `/api/search/suggestions?query=...` | Suggestions rapides                   | -                |
|     GET | `/api/search/detailed?query=...`    | Résultats détaillés (animes + mangas) | -                |

---

### 👤 Utilisateurs

| Méthode | Endpoint                     | Description                      | Authentification |
| ------: | ---------------------------- | -------------------------------- | ---------------- |
|     GET | `/api/user/me`               | Infos de l’utilisateur connecté  | Requis           |
|     PUT | `/api/user/me`               | Met à jour nom/email utilisateur | Requis           |
|     GET | `/api/admin/admin-dashboard` | Dashboard d’administration       | Admin            |

---

## Utilisation côté frontend

Architecture des services (voir `api-config.ts` et `http-client.ts`) :

* **`API_ENDPOINTS`** centralise tous les chemins d’API.
* Utilisation via `HttpClient` avec support des en-têtes, erreurs, typage TypeScript.
* Préfixe dynamique via `VITE_API_URL` (dev/prod).

---

## Exemples d'utilisation

### Créer une nouvelle licence avec manga et anime

```ts
await prisma.license.create({
  data: {
    title: "One Piece",
    mangas: {
      create: {
        title: "One Piece",
        authors: ["Eiichiro Oda"],
        volumes: 100,
        status: "ONGOING",
        publisher: "Shueisha"
      }
    },
    animeAdaptations: {
      create: {
        title: "One Piece",
        studio: "Toei Animation",
        adaptationType: "TV_SERIES",
        episodes: 1000,
        status: "ONGOING",
        fidelity: "FAITHFUL",
        relationType: "MANGA_ADAPTATION"
      }
    }
  }
});
```

### Récupérer les adaptations d’un manga

```ts
const manga = await prisma.mangaWork.findUnique({
  where: { id: mangaId },
  include: {
    adaptations: {
      include: {
        anime_name: true
      }
    }
  }
});
```