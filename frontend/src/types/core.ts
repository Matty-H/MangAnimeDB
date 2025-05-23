//frontend/src/types/core.ts

import type { WorkStatus, AnimeFidelity, RelationType } from './enums';

/**
 * Licence représentant une propriété intellectuelle
 */
export interface License {
  id: string;
  externalId?: string;
  title: string;
  mangas: MangaWork[];
  animeAdaptations: AnimeWork[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Œuvre manga complète
 */
export interface MangaWork {
  id: string;
  externalId?: string;
  licenseId: string;
  license?: License;
  authors: string[];
  title: string;
  volumes: number;
  status: WorkStatus;
  startDate?: Date;
  endDate?: Date;
  publisher: string;
  adaptations?: MangaToAnime[];
  parts?: MangaPart[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Partie d'un manga (pour les mangas divisés en parties)
 */
export interface MangaPart {
  id: string;
  externalId?: string;
  mangaId: string;
  manga?: MangaWork;
  licenseId: string;
  license?: License;
  title: string;
  partNumber: number;
  volumes: number;
  startVolume: number;
  endVolume: number;
  status: WorkStatus;
  startDate?: Date;
  endDate?: Date;
  adaptations?: MangaPartToAnime[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Œuvre anime complète
 */
export interface AnimeWork {
  id: string;
  externalId?: string;
  licenseId: string;
  license?: License;
  title: string;
  studio: string;
  episodes?: number;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  status: WorkStatus;
  fidelity: AnimeFidelity;
  notes?: string;
  relationType: RelationType;
  seasons: AnimeSeason[];
  sourcedFrom?: MangaToAnime[];
  partSourcedFrom?: MangaPartToAnime[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Saison d'un anime
 */
export interface AnimeSeason {
  id: string;
  animeAdaptationId: string;
  animeAdaptation?: AnimeWork;
  seasonNumber: number;
  episodes: number;
  fidelity: AnimeFidelity;
  coverageFromVolume?: number;
  coverageToVolume?: number;
  notes?: string;
  relationType?: RelationType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Relation entre un manga et son adaptation anime
 */
export interface MangaToAnime {
  id: string;
  mangaId: string;
  manga_name?: MangaWork;
  animeAdaptationId: string;
  anime_name?: AnimeWork;
  coverageFromVolume?: number;
  coverageToVolume?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Relation entre une partie de manga et son adaptation anime
 */
export interface MangaPartToAnime {
  id: string;
  mangaPartId: string;
  mangaPart?: MangaPart;
  animeAdaptationId: string;
  animeAdaptation?: AnimeWork;
  coverageComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}