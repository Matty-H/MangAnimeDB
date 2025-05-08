// frontend/src/services/anime-service.ts
import { AnimeWork } from '../types';
import { httpClient } from './http-client';
import { API_ENDPOINTS } from './api-config';

class AnimeService {
  /**
   * Récupère un anime par son ID
   * @param animeId Identifiant de l'anime
   */
  async getAnimeById(animeId: string): Promise<AnimeWork> {
    return httpClient.get<AnimeWork>(API_ENDPOINTS.ANIME.DETAIL(animeId));
  }

  /**
   * Met à jour un anime existant
   * @param animeId Identifiant de l'anime à mettre à jour
   * @param animeData Données à mettre à jour
   */
  async updateAnime(animeId: string, animeData: Partial<AnimeWork>): Promise<AnimeWork> {
    return httpClient.put<AnimeWork>(API_ENDPOINTS.ANIME.DETAIL(animeId), animeData);
  }

  /**
   * Crée un nouvel anime
   * @param animeData Données de l'anime à créer
   */
  async createAnime(animeData: Partial<AnimeWork>): Promise<AnimeWork> {
    return httpClient.post<AnimeWork>(API_ENDPOINTS.ANIME.CREATE, animeData);
  }

  /**
   * Supprime un anime
   * @param animeId Identifiant de l'anime à supprimer
   */
  async deleteAnime(animeId: string): Promise<void> {
    return httpClient.delete(API_ENDPOINTS.ANIME.DETAIL(animeId));
  }
}

// Exporter une instance singleton par défaut
export const animeService = new AnimeService();

// Exporter la classe pour permettre des tests ou des instances personnalisées
export default AnimeService;