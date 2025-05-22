// frontend/src/services/search-service.ts
import { License, SearchSuggestion } from '../types';
import { httpClient } from './http-client';
import { API_ENDPOINTS } from './api-config';

/**
 * Service pour gérer les fonctionnalités de recherche et les licences
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

  /**
   * Met à jour le titre d'une licence
   */
  async updateLicenseTitle(licenseId: string, title: string): Promise<void> {
    return httpClient.put<void>(API_ENDPOINTS.LICENSES.UPDATE(licenseId), { title });
  }

  /**
   * Met à jour une adaptation
   */
  async updateAdaptation(adaptationId: string, adaptationData: {
    type: string;
    episodes: number;
    fromVolume: number | null;
    toVolume: number | null;
  }): Promise<any> {
    return httpClient.put<any>(API_ENDPOINTS.ADAPTATIONS.UPDATE(adaptationId), adaptationData);
  }

  /**
   * Crée une nouvelle licence
   */
  async createLicense(licenseData: any): Promise<void> {
    return httpClient.post<void>(API_ENDPOINTS.LICENSES.CREATE, licenseData);
  }

  /**
   * Crée un nouvel anime
   */
  async createAnime(animeData: any): Promise<any> {
    return httpClient.post<any>(API_ENDPOINTS.ANIME.CREATE, animeData);
  }

  /**
   * Met à jour un anime
   */
  async updateAnime(animeId: string, animeData: any): Promise<any> {
    return httpClient.put<any>(API_ENDPOINTS.ANIME.UPDATE(animeId), animeData);
  }

  /**
   * Supprime un anime
   */
  async deleteAnime(animeId: string): Promise<void> {
    return httpClient.delete<void>(API_ENDPOINTS.ANIME.DELETE(animeId));
  }

  /**
   * Crée un nouveau manga
   */
  async createManga(mangaData: any): Promise<any> {
    return httpClient.post(API_ENDPOINTS.MANGA.CREATE, mangaData);
  }

  /**
   * Met à jour un manga
   */
  async updateManga(mangaId: string, mangaData: any): Promise<any> {
    return httpClient.put(API_ENDPOINTS.MANGA.UPDATE(mangaId), mangaData);
  }

  /**
   * Crée une nouvelle partie de manga
   */
  async createMangaPart(partData: any): Promise<any> {
    return httpClient.post(API_ENDPOINTS.MANGA.PARTS.CREATE, partData);
  }

  /**
   * Met à jour une partie de manga
   */
  async updateMangaPart(partId: string, partData: any): Promise<any> {
    return httpClient.put(API_ENDPOINTS.MANGA.PARTS.UPDATE(partId), partData);
  }

  /**
   * Supprime une partie de manga
   */

  async deleteMangaPart(partId: string): Promise<any> {
    return httpClient.delete(API_ENDPOINTS.MANGA.PARTS.DELETE(partId));
  }
}

// Exporter une instance singleton par défaut
export const searchService = new SearchService();

// Exporter la classe pour permettre des tests ou des instances personnalisées
export default SearchService;