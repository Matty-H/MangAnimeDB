// src/services/apiService.ts
import { MangaAnimeItem } from '../types';

const apiHandler = async (searchTerm: string): Promise<MangaAnimeItem[]> => {
  try {
    // Call the API endpoint we created for searching
    const response = await fetch(`/api/search/detailed?query=${encodeURIComponent(searchTerm)}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export default apiHandler;