// frontend/src/services/api-config.ts
/**
 * Configuration des endpoints de l'API
 */

// URL de base de votre API
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'https://localhost:2150';

// Fonction utilitaire pour construire les URLs complètes
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
    SEASONS: (id: string) => buildApiUrl(`/api/anime/${id}/seasons`),
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

// Export de l'URL de base pour d'autres utilisations si nécessaire
export { API_BASE_URL };