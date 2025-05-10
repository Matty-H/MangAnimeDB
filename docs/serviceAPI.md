# Documentation des Services API Frontend - MangAnime Tracking

Cette documentation détaille les services frontend qui communiquent avec l'API backend pour gérer les données d'anime, de manga et les fonctionnalités de recherche.

## Table des matières

- [Architecture générale](#architecture-générale)
- [Configuration API](#configuration-api)
- [Services disponibles](#services-disponibles)
  - [Client HTTP](#client-http)
  - [Service d'Anime](#service-danime)
  - [Service de Saisons d'Anime](#service-de-saisons-danime)
  - [Service de Recherche](#service-de-recherche)
  - [Service Utilisateur](#service-utilisateur)
- [Utilisation des services](#utilisation-des-services)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Bonnes pratiques](#bonnes-pratiques)

## Architecture générale

L'architecture frontend des services API suit le modèle "service layer" qui encapsule toutes les communications avec le backend. Cette approche permet:

- Une séparation claire des préoccupations
- Une réutilisation facile des appels API
- Une gestion centralisée des erreurs
- Une meilleure testabilité

Tous les services partagent un client HTTP commun qui gère les détails de bas niveau comme les en-têtes et le traitement des erreurs.

## Configuration API

Les endpoints de l'API sont définis de manière centralisée dans le fichier `api-config.ts`:

```typescript
// frontend/src/services/api-config.ts
export const API_ENDPOINTS = {
  SEARCH: {
    DETAILED: '/api/search/detailed',
    SUGGESTIONS: '/api/search/suggestions',
  },
  LICENSES: {
    ALL: '/api/license',
  },
  ANIME: {
    DETAIL: (id: string) => `/api/anime/${id}`,
    CREATE: '/api/anime',
    SEASONS: (id: string) => `/api/anime/${id}/seasons`,
    SEASON: {
      CREATE: '/api/anime/season',
      UPDATE: (id: string) => `/api/anime/season/${id}`,
      DELETE: (id: string) => `/api/anime/season/${id}`,
    }
  },
  MANGA: {
    DETAIL: (id: string) => `/api/manga/${id}`,
    CREATE: '/api/manga',
    UPDATE: (id: string) => `/api/manga/${id}`,
    PARTS: {
      CREATE: '/api/manga/part',
      UPDATE: (id: string) => `/api/manga/part/${id}`,
      DELETE: (id: string) => `/api/manga/part/${id}`,
    }
  }
};
```

Cette approche offre plusieurs avantages:
- Centralisation des URLs API
- Modification facile des chemins d'API
- Utilisation de fonctions pour les endpoints paramétrés

## Services disponibles

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

### Service d'Anime

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

**Fonctionnalités:**
- Récupération des détails d'un anime
- Création de nouveaux animes
- Mise à jour d'animes existants
- Suppression d'animes

### Service de Saisons d'Anime

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

**Fonctionnalités:**
- Récupération des saisons d'un anime
- Création de nouvelles saisons
- Mise à jour de saisons existantes
- Suppression de saisons

### Service de Recherche

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

**Fonctionnalités:**
- Recherche détaillée par terme
- Suggestions de recherche automatiques
- Récupération de toutes les licences

### Service Utilisateur

Le service utilisateur gère les opérations liées aux utilisateurs et à l'administration.

```typescript
const userService = {
  // Vérifie si l'utilisateur actuel est un administrateur
  async checkIsAdmin(): Promise<boolean> { ... },
  
  // Définit un utilisateur comme administrateur
  async setUserAsAdmin(targetUserId: string): Promise<{success: boolean}> { ... }
}
```

**Fonctionnalités:**
- Vérification du statut d'administrateur
- Attribution des droits d'administrateur

## Utilisation des services

Chaque service est exporté comme un singleton et comme une classe:

```typescript
// Utilisation du singleton (recommandé pour la plupart des cas)
import { animeService } from './services';

// Dans un composant React
const fetchAnime = async (id) => {
  try {
    const animeData = await animeService.getAnimeById(id);
    // Traitement des données
  } catch (error) {
    // Gestion des erreurs
  }
};

// Utilisation de la classe (pour les tests ou configurations personnalisées)
import { AnimeService } from './services';

const customAnimeService = new AnimeService();
```

## Gestion des erreurs

Tous les services utilisent une gestion d'erreurs cohérente via le client HTTP:

1. Les erreurs HTTP sont détectées par le status code
2. Une tentative est faite pour extraire un message d'erreur du corps de la réponse
3. Une erreur JavaScript est lancée avec un message descriptif
4. Les composants doivent envelopper les appels de service dans des blocs try/catch

Exemple:
```typescript
try {
  const animeData = await animeService.getAnimeById(id);
  // Traitement normal
} catch (error) {
  // error.message contiendra soit le message d'erreur du serveur,
  // soit une description générique de l'erreur HTTP
  console.error('Erreur lors de la récupération de l\'anime:', error);
  // Afficher une notification à l'utilisateur
}
```

## Bonnes pratiques

1. **Toujours utiliser les services API** plutôt que de faire des appels fetch directement dans les composants
2. **Gérer les erreurs** avec des blocs try/catch
3. **Utiliser les types TypeScript** pour les requêtes et réponses
4. **Maintenir à jour les endpoints** dans le fichier `api-config.ts`
5. **Tester les services** avec des mocks pour les appels réseau
