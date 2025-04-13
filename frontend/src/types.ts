// MangAnimeDB/src/types.ts

export interface Author {
  id: number;
  name: string;
}

export interface MangaData {
  id: number;
  volumes: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  publisher: string;
  authors: Author[];
}

export interface Coverage {
  id: number;
  volumeStart: number;
  volumeEnd: number;
  manga_volumes?: [number, number];
  anime_titles?: string[];
}

export interface DivergencePoint {
  id: number;
  mangaVolume: number;
  description: string;
}

export interface Season {
  season: number;
  episodes: number;
  start_date: string;
  end_date: string;
  fidelity: string;
  notes?: string;
  coverage?: {
    manga_volumes: [number, number];
    manga_chapters: [number, number];
  };
  divergence_point?: DivergencePoint;
}

export interface AnimeAdaptation {
  id: string;
  title: string;
  studio: string;
  episodes: number;
  seasons?: Season[];
  startDate: Date | null;
  endDate: Date | null;
  relation_type?: string;
  related_to?: string;
  notes?: string;
  fidelity?: string;
  status?: string;
  coverage: Coverage[];
  divergencePoints: DivergencePoint[];
}

export interface Manga {
  authors: string[];
  volumes: number;
  status: string;
  start_date: string;
  end_date?: string;
  publisher: string;
  coverage?: Coverage;
}

export interface MangaAnimeItem {
  id: string;
  title: string;
  manga: MangaData | null;
  anime_adaptations: AnimeAdaptation[];
}
