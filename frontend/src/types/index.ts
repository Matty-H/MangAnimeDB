// frontend/src/types/index.ts

// Enums
export * from './enums';

// Core entities (all related types in one file to avoid circular deps)
export * from './core';

// Authentication
export {
    AuthUser,
    AuthSession,
    AuthContextType,
} from './auth';

// Utilities
export {
  SearchSuggestion
} from './utils';

// Type aliases for easier imports
export type {
  // Main entities
  License,
  MangaWork,
  MangaPart,
  AnimeWork,
  AnimeSeason,
  
  // Relations
  MangaToAnime,
  MangaPartToAnime,
} from './core';