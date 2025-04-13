// frontend/src/services/apiService.ts
import { License, SearchSuggestion } from '../types';

export const searchDetailed = async (searchTerm: string): Promise<License[]> => {
  try {
    const response = await fetch(`/api/detailed?query=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// Fonction pour les suggestions de recherche
export const fetchSuggestions = async (searchTerm: string): Promise<SearchSuggestion[]> => {
  try {
    const response = await fetch(`/api/suggestions?query=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// Export par défaut pour ceux qui préfèrent importer le service entier
export default {
  searchDetailed,
  fetchSuggestions
};