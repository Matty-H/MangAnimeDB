# ✅ **Documentation API - Anime/Manga Tracking**

## Table des matières

* [Introduction](#introduction)
* [Configuration du serveur](#configuration-du-serveur)
* [Authentification](#authentification)
  * [Configuration OAuth](#configuration-oauth)
  * [Endpoints d'authentification](#endpoints-dauthentification)
  * [Middlewares](#middlewares)
  * [Variables d'environnement](#variables-denvironnement)
* [Endpoints](#endpoints)
  * [Animes](#animes)
  * [Mangas](#mangas)
  * [Licences](#licences)
  * [Recherche](#recherche)
  * [Adaptations](#adaptations)
  * [Utilisateurs](#utilisateurs)
* [Gestion des erreurs](#gestion-des-erreurs)
* [Codes de statut](#codes-de-statut)
* [Notes spécifiques](#notes-spécifiques)

---

## Introduction

Cette API permet de gérer une base de données de mangas et d'animes, incluant leurs adaptations, parties, saisons, licences et recherche.

Technologies :

* **Express.js** pour le serveur
* **Prisma** pour l'ORM
* **Auth.js** pour l'authentification OAuth avec Google

---

## Configuration du serveur

Le serveur est configuré dans `api/index.js`, avec montage des routes par type de ressource (`anime`, `manga`, `license`, etc.)

---

## 🔐 Authentification

L'API utilise [Auth.js](https://authjs.dev) avec Google comme fournisseur OAuth via le middleware `ExpressAuth`.

### Configuration OAuth

Pour utiliser l'authentification Google OAuth :

1. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Configurez des identifiants OAuth avec :
   * **URI de redirection autorisés** : `https://votre-domaine.com:port/api/auth/callback/google`
   * **Domaines autorisés** incluant votre domaine principal
3. Récupérez le **Client ID** et le **Client Secret**
4. Ajoutez-les à votre fichier `.env` (voir section variables d'environnement)

### Endpoints d'authentification

#### GET `/api/auth/session`

Retourne la session utilisateur actuelle si authentifié.

**Réponse si authentifié** :

```json
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "expires": "timestamp"
}
```

**Réponse si non authentifié** :

```json
null
```

#### GET `/api/auth/signin/google`

Redirige l'utilisateur vers la page de connexion Google.

#### GET `/api/auth/callback/google`

Point de redirection OAuth après authentification Google.

#### GET `/api/auth/signout`

Déconnecte l'utilisateur et supprime la session.

#### GET `/api/auth-test`

Endpoint de test pour vérifier l'authentification.

**Réponse si authentifié** :

```json
{
  "authenticated": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "message": "Authentification réussie"
}
```

**Réponse si non authentifié** :

```json
{
  "authenticated": false,
  "message": "Non authentifié"
}
```

### Middlewares

#### `requireAuth`

Vérifie que l'utilisateur est connecté.

```js
// Exemple d'utilisation
import { requireAuth } from '../auth/auth-config.js';

router.get('/protected-route', requireAuth, (req, res) => {
  res.send("Contenu protégé");
});
```

#### `requireRole(role)`

Vérifie que l'utilisateur possède un rôle spécifique (ex: `admin`).

```js
// Exemple d'utilisation
import { requireRole } from '../auth/auth-config.js';

router.get('/admin-route', requireAuth, requireRole('admin'), (req, res) => {
  res.send("Contenu admin");
});
```

### Variables d'environnement

Les variables suivantes doivent être définies dans votre fichier `.env` :

```
# Secret pour Auth.js (requis pour chiffrer les cookies de session)
AUTH_SECRET=votre_secret_tres_securise_ici

# URL de base de l'application (pour les redirections)
AUTH_URL=https://votre-domaine.com:port

# Identifiants OAuth Google
GOOGLE_ID=votre_client_id_google
GOOGLE_SECRET=votre_client_secret_google

# Configuration optionnelle
SESSION_MAXAGE=30d  # Durée de vie de la session (défaut: 30 jours)
```

---

## Endpoints

### 📺 Animes

#### GET `/api/anime/:id`

Récupère un anime par ID, avec ses saisons.

#### POST `/api/anime` (admin requis)

Crée un nouvel anime.

#### PUT `/api/anime/:id` (admin requis)

Met à jour un anime existant.

#### DELETE `/api/anime/:id` (admin requis)

Supprime un anime et ses saisons.

#### POST `/api/anime/season` (admin requis)

Ajoute une saison à un anime.

#### PUT `/api/anime/season/:id` (admin requis)

Met à jour une saison.

#### DELETE `/api/anime/season/:id` (admin requis)

Supprime une saison.

---

### 📚 Mangas

#### GET `/api/manga/:id`

Récupère un manga par ID, avec ses parties.

#### POST `/api/manga` (admin requis)

Crée un manga.

#### PUT `/api/manga/:id` (admin requis)

Met à jour un manga.

#### PUT `/api/manga/license/:licenseId/manga/:mangaId` (admin requis)

Met à jour un manga en fonction de sa licence.

#### POST `/api/manga/part` (admin requis)

Ajoute une partie à un manga.

#### PUT `/api/manga/part/:id` (admin requis)

Met à jour une partie.

#### DELETE `/api/manga/part/:id` (admin requis)

Supprime une partie.

---

### 🏷️ Licences

#### GET `/api/license`

Liste toutes les licences triées alphabétiquement.

#### POST `/api/license` (admin requis)

Crée une licence.

#### PUT `/api/license/:id` (admin requis)

Met à jour une licence.

#### DELETE `/api/license/:id` (admin requis)

Supprime une licence.

---

### 🔍 Recherche

#### GET `/api/search/suggestions?query=...`

Renvoie des suggestions de titres (limité à 10).

#### GET `/api/search/detailed?query=...`

Recherche détaillée incluant animes et mangas.

---

### 🔄 Adaptations

#### PUT `/api/adaptation/:id` (admin requis)

Met à jour une adaptation (anime ou saison).

**Body attendu** :

```json
{
  "episodes": number,
  "fromVolume": number,
  "toVolume": number,
  "type": "anime" | "season"
}
```

---

### 👤 Utilisateurs

#### GET `/api/admin/admin-dashboard` (admin requis)

Accès au dashboard admin.

**Réponse** :

```json
{
  "message": "Bienvenue, administrateur!"
}
```

---

## Gestion des erreurs

```json
{
  "error": "Message d'erreur",
  "details": "Détails optionnels",
  "path": "Chemin de la requête"
}
```

---

## Codes de statut

* **200**: Succès
* **201**: Création réussie
* **400**: Requête invalide
* **401**: Non authentifié
* **403**: Accès interdit
* **404**: Non trouvé
* **500**: Erreur serveur

---

## Notes spécifiques

* **Dates** : Format ISO 8601
* **Champs `fidelity`** : `FAITHFUL`, `PARTIAL`, `ANIME_ORIGINAL`
* **Volumes** dans les adaptations : `fromVolume`, `toVolume`
* **Authentification** : La session utilisateur est automatiquement attachée à `req.auth.user` si l'utilisateur est connecté