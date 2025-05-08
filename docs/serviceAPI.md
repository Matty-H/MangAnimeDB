# 📁 Documentation – `frontend/src/services`

Ce dossier regroupe tous les services utilisés pour interagir avec l'API backend, y compris la configuration des endpoints, le client HTTP, et les services métiers comme les animes ou la recherche.

---

## `anime-season-service.ts`

### Description

Gère les opérations CRUD liées aux **saisons** d'un anime.

### Classe : `AnimeSeasonService`

* `getSeasons(animeId: string)`: Récupère toutes les saisons pour un anime donné.
* `createSeason(season: Partial<Season>)`: Crée une nouvelle saison.
* `updateSeason(seasonId: string, season: Partial<Season>)`: Met à jour une saison existante.
* `deleteSeason(seasonId: string)`: Supprime une saison existante.

✅ **Export par défaut** : `AnimeSeasonService`
✅ **Instance exportée** : `animeSeasonService`

---

## `anime-service.ts`

### Description

Gère les opérations liées aux **animes** eux-mêmes.

### Classe : `AnimeService`

* `getAnimeById(animeId: string)`: Récupère un anime par son ID.
* `updateAnime(animeId: string, animeData: Partial<AnimeWork>)`: Met à jour un anime.

✅ **Export par défaut** : `AnimeService`
✅ **Instance exportée** : `animeService`

---

## `api-config.ts`

### Description

Fichier de **configuration des endpoints** utilisés par les services API.

### Contenu exporté

```ts
API_ENDPOINTS: {
  SEARCH: {
    DETAILED: '/api/search/detailed',
    SUGGESTIONS: '/api/search/suggestions',
  },
  LICENSES: {
    ALL: '/api/getAllLicenses',
  },
  ANIME: {
    DETAIL: (id: string) => `/api/anime/${id}`,
    SEASONS: (id: string) => `/api/anime/${id}/seasons`,
    SEASON: {
      CREATE: '/api/anime/season',
      UPDATE: (id: string) => `/api/anime/season/${id}`,
      DELETE: (id: string) => `/api/anime/season/${id}`,
    }
  }
}
```

✅ **Export** : `API_ENDPOINTS`

---

## `http-client.ts`

### Description

Client HTTP **générique** pour toutes les requêtes vers l'API.

### Classe : `HttpClient`

* `request<T>(endpoint, options)`: Méthode générique de requête.
* `get<T>(endpoint)`, `post<T>(endpoint, body)`, `put<T>(...)`, `delete<T>(...)`: Méthodes simplifiées pour chaque verbe HTTP.

✅ **Export par défaut** : `HttpClient`
✅ **Instance exportée** : `httpClient`

---

## `index.ts`

### Description

Point d'entrée unique pour importer tous les services facilement.

### Exportations

* Instances : `httpClient`, `searchService`, `animeService`, `animeSeasonService`
* Classes : `HttpClient`, `SearchService`, `AnimeService`, `AnimeSeasonService`
* Config : `API_ENDPOINTS`

---

## `search-service.ts`

### Description

Gère les fonctionnalités liées à la **recherche** et à la récupération de **licences**.

### Classe : `SearchService`

* `searchDetailed(searchTerm)`: Recherche avancée.
* `fetchSuggestions(searchTerm)`: Suggestions de recherche.
* `getAllLicenses()`: Récupère toutes les licences disponibles.

✅ **Export par défaut** : `SearchService`
✅ **Instance exportée** : `searchService`