export interface Correspondence {
    mangaVolumes: string;
    animeEpisodes: string;
    animeSeason: number | null;
    arc: string;
  }
  
  export interface MangaAnimeItem {
    id: string;
    title: string;
    alternativeTitles: string[];
    correspondences: Correspondence[];
  }