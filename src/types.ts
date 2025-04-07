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
    };
    divergence_point?: DivergencePoint;
  }
  
  export interface AnimeAdaptation {
    title: string;
    studio: string;
    episodes?: number;
    start_date: string;
    end_date: string;
    status: string;
    fidelity: string;
    coverage?: {
      manga_volumes: [number, number];
    };
    divergence_point?: DivergencePoint;
    diverges_from_manga?: boolean;
    notes?: string;
    seasons?: Season[];
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
    title: string;
    manga: Manga;
    anime_adaptations: AnimeAdaptation[];
  }
  