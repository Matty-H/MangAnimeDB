//src/services/apiService.tsx
import { MangaAnimeItem } from '../types';

export async function fetchMangaAnimeByTitle(
  title: string,
): Promise<MangaAnimeItem[]> {
  const response = await fetch(
    `/api/mangaanime?title=${encodeURIComponent(title)}`,
  );
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données');
  }
  return response.json();
}
