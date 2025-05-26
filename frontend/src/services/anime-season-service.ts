// frontend/src/services/anime-season-service.ts
import { Season } from '../components/mangAnimeCard/cardAnime/AnimeSeasonManager';
import { httpClient } from './http-client';
import { API_ENDPOINTS } from './api-config';

/**
 * Service pour gérer les saisons d'anime
 */
export class AnimeSeasonService {
  /**
   * Récupère toutes les saisons d'un anime
   */
  async getSeasons(animeId: string): Promise<Season[]> {
    return httpClient.get<Season[]>(API_ENDPOINTS.ANIME.SEASONS(animeId));
  }

  /**
   * Crée une nouvelle saison
   */
  async createSeason(season: Partial<Season>): Promise<Season> {
    return httpClient.post<Season>(API_ENDPOINTS.ANIME.SEASON.CREATE, season);
  }

  /**
   * Met à jour une saison existante
   */
  async updateSeason(seasonId: string, season: Partial<Season>): Promise<Season> {
    return httpClient.put<Season>(API_ENDPOINTS.ANIME.SEASON.UPDATE(seasonId), season);
  }

  /**
   * Supprime une saison
   */
  async deleteSeason(seasonId: string): Promise<Season> {
    return httpClient.delete<Season>(API_ENDPOINTS.ANIME.SEASON.DELETE(seasonId));
  }
}

// Exporter une instance singleton par défaut
export const animeSeasonService = new AnimeSeasonService();

// Exporter la classe pour permettre des tests ou des instances personnalisées
export default AnimeSeasonService;