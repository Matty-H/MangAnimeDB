# ✅ **Documentation API complète - Anime/Manga Tracking**

## Table des matières

* [Introduction](#introduction)
* [Configuration du serveur](#configuration-du-serveur)
* [Authentification](#authentification)
  * [Configuration OAuth](#configuration-oauth)
  * [Endpoints d'authentification](#endpoints-dauthentification)
  * [Middlewares](#middlewares)
  * [Variables d'environnement](#variables-denvironnement)
* [Endpoints Backend](#endpoints-backend)
  * [Animes](#animes)
  * [Mangas](#mangas)
  * [Licences](#licences)
  * [Recherche](#recherche)
  * [Adaptations](#adaptations)
  * [Utilisateurs](#utilisateurs)
* [Services Frontend](#services-frontend)
  * [Architecture générale](#architecture-générale)
  * [Configuration API](#configuration-api-frontend)
  * [Client HTTP](#client-http)
  * [Services disponibles](#services-disponibles)
  * [Utilisation des services](#utilisation-des-services)
* [Gestion des erreurs](#gestion-des-erreurs)
* [Codes de statut](#codes-de-statut)
* [Notes spécifiques](#notes-spécifiques)

---

## Introduction

Cette API permet de gérer une base de données de mangas et d'animes, incluant leurs adaptations, parties, saisons, licences et recherche. Le projet comprend un backend Express.js avec Prisma et un frontend avec des services API TypeScript.

**Technologies Backend :**
* **Express.js** pour le serveur
* **Prisma** pour l'ORM
* **Auth.js** pour l'authentification OAuth avec Google

**Technologies Frontend :**
* **TypeScript** pour le typage
* **Services API** avec client HTTP centralisé
* **Fetch API** pour les requêtes

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

```env
# Secret pour Auth.js (requis pour chiffrer les cookies de session)
AUTH_SECRET=votre_secret_tres_securise_ici

# URL de base de l'application (pour les redirections)
AUTH_URL=https://votre-domaine.com:port

# Identifiants OAuth Google
GOOGLE_ID=votre_client_id_google
GOOGLE_SECRET=votre_client_secret_google

# Configuration optionnelle
SESSION_MAXAGE=30d  # Durée de vie de la session (défaut: 30 jours)

# URL de l'API pour le frontend
VITE_API_URL=https://localhost:2150
```

---

## Endpoints Backend

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

#### GET `/api/user/me` (authentifié requis)

Récupère le profil de l'utilisateur actuel.

**Réponse** :

```json
{
  "id": "string",
  "email": "string",
  "role": "string",
  "name": "string"
}
```

#### PUT `/api/user/me` (authentifié requis)

Met à jour le profil de l'utilisateur actuel.

**Body attendu** :

```json
{
  "name": "string",
  "email": "string"
}
```

---

## Services Frontend

### Architecture générale

L'architecture frontend des services API suit le modèle "service layer" qui encapsule toutes les communications avec le backend. Cette approche permet:

- Une séparation claire des préoccupations
- Une réutilisation facile des appels API
- Une gestion centralisée des erreurs
- Une meilleure testabilité

Tous les services partagent un client HTTP commun qui gère les détails de bas niveau comme les en-têtes et le traitement des erreurs.

### Configuration API Frontend

Les endpoints de l'API sont définis de manière centralisée dans le fichier `api-config.ts`:

```typescript
// frontend/src/services/api-config.ts
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'https://localhost:2150';

const buildApiUrl = (endpoint: string): string => `${API_BASE_URL}${endpoint}`;

export const API_ENDPOINTS = {
  SEARCH: {
    DETAILED: buildApiUrl('/api/search/detailed'),
    SUGGESTIONS: buildApiUrl('/api/search/suggestions'),
  },
  LICENSES: {
    ALL: buildApiUrl('/api/license'),
    CREATE: buildApiUrl('/api/license'),
    UPDATE: (id: string) => buildApiUrl(`/api/license/${id}`),
  },
  ADAPTATIONS: {
    UPDATE: (id: string) => buildApiUrl(`/api/adaptation/${id}`),
  },
  ANIME: {
    DETAIL: (id: string) => buildApiUrl(`/api/anime/${id}`),
    CREATE: buildApiUrl('/api/anime'),
    UPDATE: (id: string) => buildApiUrl(`/api/anime/${id}`),
    DELETE: (id: string) => buildApiUrl(`/api/anime/${id}`),
    SEASON: {
      CREATE: buildApiUrl('/api/anime/season'),
      UPDATE: (id: string) => buildApiUrl(`/api/anime/season/${id}`),
      DELETE: (id: string) => buildApiUrl(`/api/anime/season/${id}`),
    }
  },
  MANGA: {
    DETAIL: (id: string) => buildApiUrl(`/api/manga/${id}`),
    CREATE: buildApiUrl('/api/manga'),
    UPDATE: (id: string) => buildApiUrl(`/api/manga/${id}`),
    PARTS: {
      CREATE: buildApiUrl('/api/manga/part'),
      UPDATE: (id: string) => buildApiUrl(`/api/manga/part/${id}`),
      DELETE: (id: string) => buildApiUrl(`/api/manga/part/${id}`),
    }
  },
  USER: {
    ME: buildApiUrl('/api/user/me'),
  },
};
```

Cette approche offre plusieurs avantages:
- Centralisation des URLs API
- Modification facile des chemins d'API
- Utilisation de fonctions pour les endpoints paramétrés
- Configuration automatique de l'URL de base via les variables d'environnement

### Client HTTP

Le client HTTP (`http-client.ts`) sert de fondation pour tous les services API. Il encapsule la logique de communication HTTP et offre une interface simplifiée.

```typescript
class HttpClient {
  // Configuration avec URL de base optionnelle
  constructor(baseUrl: string = '') { ... }
  
  // Méthode générique pour toutes les requêtes
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> { ... }
  
  // Méthodes d'aide pour les verbes HTTP communs
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> { ... }
  async post<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> { ... }
  async put<T>(endpoint: string, body: any, headers?: Record<string, string>): Promise<T> { ... }
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> { ... }
}
```

**Caractéristiques principales:**
- Gestion automatique des en-têtes Content-Type
- Conversion des réponses en JSON
- Gestion des erreurs avec informations détaillées
- Support de la généricité TypeScript
- Inclusion automatique des credentials (cookies d'authentification)

### Services disponibles

#### Service d'Anime

Le service d'anime (`anime-service.ts`) gère les opérations CRUD pour les animes.

```typescript
class AnimeService {
  // Récupère un anime par son ID
  async getAnimeById(animeId: string): Promise<AnimeWork> { ... }
  
  // Met à jour un anime existant
  async updateAnime(animeId: string, animeData: Partial<AnimeWork>): Promise<AnimeWork> { ... }
  
  // Crée un nouvel anime
  async createAnime(animeData: Partial<AnimeWork>): Promise<AnimeWork> { ... }
  
  // Supprime un anime
  async deleteAnime(animeId: string): Promise<void> { ... }
}
```

#### Service de Saisons d'Anime

Le service de saisons d'anime (`anime-season-service.ts`) gère les opérations CRUD pour les saisons d'anime.

```typescript
class AnimeSeasonService {
  // Récupère toutes les saisons d'un anime
  async getSeasons(animeId: string): Promise<Season[]> { ... }
  
  // Crée une nouvelle saison
  async createSeason(season: Partial<Season>): Promise<Season> { ... }
  
  // Met à jour une saison existante
  async updateSeason(seasonId: string, season: Partial<Season>): Promise<Season> { ... }
  
  // Supprime une saison
  async deleteSeason(seasonId: string): Promise<Season> { ... }
}
```

#### Service de Recherche

Le service de recherche (`search-service.ts`) gère les fonctionnalités de recherche et de récupération des licences.

```typescript
class SearchService {
  // Effectue une recherche détaillée
  async searchDetailed(searchTerm: string): Promise<License[]> { ... }
  
  // Récupère les suggestions de recherche
  async fetchSuggestions(searchTerm: string): Promise<SearchSuggestion[]> { ... }
  
  // Récupère toutes les licences
  async getAllLicenses(): Promise<License[]> { ... }
}
```

#### Service Utilisateur

Le service utilisateur (`user-service.ts`) gère les opérations liées aux utilisateurs et à l'administration.

```typescript
class UserService {
  // Vérifie si l'utilisateur actuel est un administrateur
  async checkIsAdmin(): Promise<boolean> { ... }
  
  // Récupère le profil de l'utilisateur actuel
  async getCurrentUser(): Promise<User> { ... }
  
  // Met à jour le profil de l'utilisateur actuel
  async updateCurrentUser(userData: Partial<User>): Promise<User> { ... }
  
  // Vérifie si l'utilisateur a un rôle spécifique
  async hasRole(role: string): Promise<boolean> { ... }
  
  // Vérifie si l'utilisateur a l'un des rôles spécifiés
  async hasAnyRole(roles: string[]): Promise<boolean> { ... }
}
```

**Fonctionnalités:**
- Vérification du statut d'administrateur
- Gestion du profil utilisateur
- Vérification des rôles et permissions

### Utilisation des services

Chaque service est exporté comme un singleton et comme une classe:

```typescript
// Utilisation du singleton (recommandé pour la plupart des cas)
import { animeService, userService } from './services';

// Dans un composant React
const fetchAnime = async (id) => {
  try {
    const animeData = await animeService.getAnimeById(id);
    // Traitement des données
  } catch (error) {
    // Gestion des erreurs
  }
};

// Vérification des droits admin
const checkAdminRights = async () => {
  try {
    const isAdmin = await userService.checkIsAdmin();
    if (isAdmin) {
      // Afficher les fonctionnalités admin
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des droits:', error);
  }
};

// Utilisation de la classe (pour les tests ou configurations personnalisées)
import { AnimeService } from './services';

const customAnimeService = new AnimeService();
```

---

## Gestion des erreurs

### Flux de gestion des erreurs

```
Erreur Backend → HttpClient → Service → Composant → Interface utilisateur
```

## Codes de statut HTTP

L'API utilise les codes de statut HTTP standards pour indiquer le résultat des requêtes :

### Codes de succès (2xx)

| Code | Signification | Utilisation |
|------|---------------|-------------|
| **200** | OK | Succès général, récupération de données |
| **201** | Created | Création réussie d'une ressource |
| **204** | No Content | Succès sans contenu de réponse (suppression) |

### Codes d'erreur client (4xx)

| Code | Signification | Utilisation | Exemples |
|------|---------------|-------------|----------|
| **400** | Bad Request | Requête invalide, données malformées | Champs manquants, format JSON invalide |
| **401** | Unauthorized | Non authentifié | Session expirée, token manquant |
| **403** | Forbidden | Accès interdit | Permissions insuffisantes, rôle admin requis |
| **404** | Not Found | Ressource non trouvée | Anime/Manga inexistant, endpoint invalide |
| **409** | Conflict | Conflit de données | Titre déjà existant, contrainte d'unicité |
| **422** | Unprocessable Entity | Données valides mais non traitables | Validation métier échouée |
| **429** | Too Many Requests | Limite de taux dépassée | Trop de requêtes de recherche |

### Codes d'erreur serveur (5xx)

| Code | Signification | Utilisation | Exemples |
|------|---------------|-------------|----------|
| **500** | Internal Server Error | Erreur serveur générique | Erreur de base de données, exception non gérée |
| **502** | Bad Gateway | Erreur de passerelle | Problème avec services externes |
| **503** | Service Unavailable | Service temporairement indisponible | Maintenance, surcharge |

---

## Notes spécifiques

* **Dates** : Format ISO 8601
* **Champs `fidelity`** : `FAITHFUL`, `PARTIAL`, `ANIME_ORIGINAL`
* **Volumes** dans les adaptations : `fromVolume`, `toVolume`
* **Authentification** : La session utilisateur est automatiquement attachée à `req.auth.user` si l'utilisateur est connecté
* **Configuration API Frontend** : L'URL de base de l'API est configurée via `VITE_API_URL` (défaut: `https://localhost:2150`)
* **Credentials** : Toutes les requêtes incluent automatiquement les cookies d'authentification (`credentials: 'include'`)
* **Gestion d'erreurs** : Les services frontend extraient automatiquement les messages d'erreur du backend via la propriété `error`
* **Types de réponse** : Toutes les réponses API sont automatiquement converties en JSON
* **Headers** : `Content-Type: application/json` est automatiquement ajouté à toutes les requêtes POST/PUT
* **Rôles utilisateur** : Le système supporte la vérification de rôles multiples via `hasRole()` et `hasAnyRole()`
* **Endpoints paramétrés** : Les URLs avec paramètres sont générées dynamiquement via des fonctions (ex: `API_ENDPOINTS.ANIME.DETAIL(id)`)
* **Singleton services** : Chaque service est disponible comme instance singleton pour une utilisation simplifiée
* **Architecture modulaire** : Les services frontend suivent le pattern "service layer" pour une séparation claire des préoccupations