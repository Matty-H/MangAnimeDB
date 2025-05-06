//frontend/src/services/animeApi.ts
import { AnimeWork } from '../types';

/**
 * Service pour gérer les appels API liés aux animes
 */
export const AnimeAPI = {
  /**
   * Récupère un anime avec ses saisons par ID
   */
  getAnimeById: async (animeId: string): Promise<AnimeWork> => {
    const response = await fetch(`/api/anime/${animeId}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération de l'anime: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Met à jour un anime
   */
  updateAnime: async (animeId: string, animeData: Partial<AnimeWork>): Promise<AnimeWork> => {
    const response = await fetch(`/api/anime/${animeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(animeData),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour de l'anime: ${response.status}`);
    }
    
    return response.json();
  }
};