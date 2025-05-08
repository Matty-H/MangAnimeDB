// frontend/src/services/anime-service.ts
import { AnimeWork } from '../types';
import { httpClient } from './http-client';
import { API_ENDPOINTS } from './api-config';

/**
 * Service pour gérer les animes
 */
export class AnimeService {
  /**
   * Récupère un anime par son ID
   */
  async getAnimeById(animeId: string): Promise<AnimeWork> {
    return httpClient.get<AnimeWork>(API_ENDPOINTS.ANIME.DETAIL(animeId));
  }

  /**
   * Met à jour un anime
   */
  async updateAnime(animeId: string, animeData: Partial<AnimeWork>): Promise<AnimeWork> {
    return httpClient.put<AnimeWork>(API_ENDPOINTS.ANIME.DETAIL(animeId), animeData);
  }
}

// Exporter une instance singleton par défaut
export const animeService = new AnimeService();

// Exporter la classe pour permettre des tests ou des instances personnalisées
export default AnimeService;