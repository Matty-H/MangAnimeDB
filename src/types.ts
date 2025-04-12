// Path: /Users/matisse/Documents/Dev/MangAnimeDB/src/types.ts
export interface Coverage {
  manga_volumes?: [number, number];
  anime_titles?: string[];
}

export interface DivergencePoint {
  manga_volume: number;
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
  coverage?: {
    manga_volumes: number[];
  };
  seasons?: {
    season: number;
    episodes: number;
    coverage?: {
      manga_volumes: number[];
      manga_chapters: number[];
    };
    notes?: string;
  }[];
  start_date: string;
  end_date?: string;
  relation_type?: string;
  related_to?: string;
  notes?: string;
  fidelity?: string;
  status?: string;
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
  manga: {
    id: string;
    authors: string[];
    volumes: number;
    status: string;
    publisher: string;
  };
  anime_adaptations: AnimeAdaptation[];
}
