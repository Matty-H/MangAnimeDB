// frontend/src/services/index.ts
/**
 * Point d'entrée centralisé pour tous les services API
 */

// Exporter les instances des services
export { httpClient } from './http-client.ts';
export { searchService } from './search-service.ts';
export { animeService } from './anime-service.ts';
export { animeSeasonService } from './anime-season-service.ts';

// Exporter les classes pour permettre des tests ou des instances personnalisées
export { default as HttpClient } from './http-client.ts';
export { default as SearchService } from './search-service.ts';
export { default as AnimeService } from './anime-service.ts';
export { default as AnimeSeasonService } from './anime-season-service.ts';

// Exporter la configuration API
export { API_ENDPOINTS } from './api-config.ts';