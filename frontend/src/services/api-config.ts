// frontend/src/services/api-config.ts
/**
 * Configuration des endpoints de l'API
 */
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
    CREATE: '/api/anime', // Endpoint de création d'anime
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