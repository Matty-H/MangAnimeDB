// frontend/src/services/api-config.ts
/**
 * Configuration centralisée pour les points d'API
 */

export const API_ENDPOINTS = {
    // Endpoints de recherche
    SEARCH: {
      DETAILED: '/api/search/detailed',
      SUGGESTIONS: '/api/search/suggestions',
    },
    
    // Endpoints des licences
    LICENSES: {
      ALL: '/api/getAllLicenses',
    },
    
    // Endpoints des animes
    ANIME: {
      DETAIL: (id: string) => `/api/anime/${id}`,
      SEASONS: (id: string) => `/api/anime/${id}/seasons`,
      SEASON: {
        CREATE: '/api/anime/season',
        UPDATE: (id: string) => `/api/anime/season/${id}`,
        DELETE: (id: string) => `/api/anime/season/${id}`,
      }
    }
  };