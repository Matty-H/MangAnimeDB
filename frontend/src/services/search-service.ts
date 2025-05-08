// frontend/src/services/search-service.ts
import { License, SearchSuggestion } from '../types';
import { httpClient } from './http-client';
import { API_ENDPOINTS } from './api-config';

/**
 * Service pour gérer les fonctionnalités de recherche
 */
export class SearchService {
  /**
   * Effectue une recherche détaillée
   */
  async searchDetailed(searchTerm: string): Promise<License[]> {
    return httpClient.get<License[]>(`${API_ENDPOINTS.SEARCH.DETAILED}?query=${encodeURIComponent(searchTerm)}`);
  }

  /**
   * Récupère les suggestions de recherche
   */
  async fetchSuggestions(searchTerm: string): Promise<SearchSuggestion[]> {
    return httpClient.get<SearchSuggestion[]>(`${API_ENDPOINTS.SEARCH.SUGGESTIONS}?query=${encodeURIComponent(searchTerm)}`);
  }

  /**
   * Récupère toutes les licences
   */
  async getAllLicenses(): Promise<License[]> {
    return httpClient.get<License[]>(API_ENDPOINTS.LICENSES.ALL);
  }
}

// Exporter une instance singleton par défaut
export const searchService = new SearchService();

// Exporter la classe pour permettre des tests ou des instances personnalisées
export default SearchService;