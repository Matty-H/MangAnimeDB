//frontend/src/types/enums.ts

/**
 * Statut d'une œuvre (manga ou anime)
 */
export enum WorkStatus {
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    HIATUS = 'HIATUS',
    UNFINISHED = 'UNFINISHED',
    CANCELED = 'CANCELED'
  }
  
  /**
   * Fidélité d'une adaptation anime par rapport au manga source
   */
  export enum AnimeFidelity {
    FAITHFUL = 'FAITHFUL',
    PARTIAL = 'PARTIAL',
    ANIME_ORIGINAL = 'ANIME_ORIGINAL',
    CANCELED = 'CANCELED'
  }
  
  /**
   * Type de relation entre les œuvres
   */
  export enum RelationType {
    ORIGINAL = 'ORIGINAL',
    MANGA_ADAPTATION = 'MANGA_ADAPTATION',
    SEQUEL = 'SEQUEL',
    PREQUEL = 'PREQUEL',
    REMAKE = 'REMAKE',
    SPIN_OFF = 'SPIN_OFF',
    REBOOT = 'REBOOT'
  }
  
  /**
   * Type d'adaptation anime
   */
  export enum AdaptationType {
    TV_SERIES = 'TV_SERIES',
    MOVIE = 'MOVIE',
    OVA = 'OVA',
    ONA = 'ONA',
    SPECIAL = 'SPECIAL'
  }