import { Season } from '../components/cardAnime/AnimeSeasonManager';

/**
 * Service pour gérer les appels API liés aux saisons d'anime
 */
export const AnimeSeasonAPI = {
  /**
   * Récupère toutes les saisons d'un anime
   */
  getSeasons: async (animeId: string): Promise<Season[]> => {
    const response = await fetch(`/api/anime-season?animeId=${animeId}`);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des saisons: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Crée une nouvelle saison
   */
  createSeason: async (season: Partial<Season>): Promise<Season> => {
    const response = await fetch('/api/anime-season', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(season),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la création de la saison: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * Met à jour une saison existante
   */
  updateSeason: async (seasonId: string, season: Partial<Season>): Promise<Season> => {
    const response = await fetch(`/api/anime-season/${seasonId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(season),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour de la saison: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * Supprime une saison
   */
  deleteSeason: async (seasonId: string): Promise<Season> => {
    const response = await fetch(`/api/anime-season/${seasonId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression de la saison: ${response.status}`);
    }
    
    return response.json();
  },
};