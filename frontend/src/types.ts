import { CANCELLED } from "dns";

export enum WorkStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  HIATUS = 'HIATUS',
  UNFINISHED = 'UNFINISHED',
  CANCELED = 'CANCELED'
}

export enum AnimeFidelity {
  FAITHFUL = 'FAITHFUL',
  PARTIAL = 'PARTIAL',
  ANIME_ORIGINAL = 'ANIME_ORIGINAL',
  CANCELED = 'CANCELED'
}

export enum RelationType {
  ORIGINAL = 'ORIGINAL',
  MANGA_ADAPTATION = 'MANGA_ADAPTATION', //TODO AJOUTER A PRISMA LE TYPE
  SEQUEL = 'SEQUEL',
  PREQUEL = 'PREQUEL',
  REMAKE = 'REMAKE',
  SPIN_OFF = 'SPIN_OFF',
  REBOOT = 'REBOOT'
}

export enum AdaptationType {
  TV_SERIES = 'TV_SERIES',
  MOVIE = 'MOVIE',
  OVA = 'OVA',
  ONA = 'ONA',
  SPECIAL = 'SPECIAL'
}

export interface License {
  id: string;
  externalId?: string;
  title: string;
  mangas: MangaWork[];
  animeAdaptations: AnimeWork[];
  createdAt: Date;
  updatedAt: Date;
}

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
  parts?: MangaPart[]; // ✅ Ajout ici
  createdAt: Date;
  updatedAt: Date;
}

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

export interface SearchSuggestion {
  id: string;
  title: string;
}

// frontend/src/types/auth.ts
/**
 * Type représentant un utilisateur authentifié
 */
export interface AuthUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * Type représentant une session d'authentification
 */
export interface AuthSession {
  user?: AuthUser | null;
  expires?: string | null;
}

/**
 * Type représentant le contexte d'authentification fourni par useAuth
 */
export interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  error: Error | null;
  signIn: (provider: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
  user: AuthUser | null;
}