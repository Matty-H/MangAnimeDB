//frontend/src/components/cardAnime/AnimeSeasonManager.tsx
import React from 'react';
import GenericItemManager, { ItemConfig } from '../GenericItemManager';
import { animeSeasonService } from '../../../services';

export enum AnimeFidelity {
  FAITHFUL = 'FAITHFUL',
  PARTIAL = 'PARTIAL',
  ANIME_ORIGINAL = 'ANIME_ORIGINAL'
}

export interface Season {
  id: string;
  animeAdaptationId: string;
  seasonNumber: number;
  episodes: number;
  fidelity: AnimeFidelity;
  coverageFromVolume: number | null;
  coverageToVolume: number | null;
  notes: string;
}

export interface AnimeWork {
  id: string;
  seasons?: Season[];
}

interface AnimeSeasonManagerProps {
  anime: AnimeWork;
  seasons: Season[];
  onSeasonsUpdated?: (seasons: Season[]) => void;
}

const createSeasonConfig = (animeId: string): ItemConfig<Season> => ({
  itemName: 'saison',
  itemNamePlural: 'saisons',
  addButtonText: 'Ajouter une saison',
  
  createItem: (season: Partial<Season>) => 
    animeSeasonService.createSeason({ ...season, animeAdaptationId: animeId }),
  updateItem: (id: string, season: Partial<Season>) => 
    animeSeasonService.updateSeason(id, season),
  deleteItem: (id: string) => 
    animeSeasonService.deleteSeason(id),
  
  formFields: [
    {
      name: 'seasonNumber',
      label: 'Numéro de saison',
      type: 'number',
      required: true,
      colSpan: 1
    },
    {
      name: 'episodes',
      label: 'Épisodes',
      type: 'number',
      required: true,
      colSpan: 1
    },
    {
      name: 'fidelity',
      label: 'Fidélité',
      type: 'select',
      required: true,
      colSpan: 1,
      options: Object.values(AnimeFidelity).map(fidelity => ({
        value: fidelity,
        label: fidelity
      }))
    },
    {
      name: 'coverageFromVolume',
      label: 'Tome de début',
      type: 'number',
      colSpan: 1,
      processValue: (value: any) => value === '' ? null : (typeof value === 'string' ? parseInt(value, 10) : value)
    },
    {
      name: 'coverageToVolume',
      label: 'Tome de fin',
      type: 'number',
      colSpan: 1,
      processValue: (value: any) => value === '' ? null : (typeof value === 'string' ? parseInt(value, 10) : value)
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'text',
      colSpan: 2,
      placeholder: 'Notes optionnelles...'
    }
  ],
  
  createDefaultItem: () => ({
    animeAdaptationId: animeId,
    seasonNumber: 1,
    episodes: 12,
    fidelity: AnimeFidelity.FAITHFUL,
    coverageFromVolume: null,
    coverageToVolume: null,
    notes: ''
  }),
  
  renderListItem: (season: Season) => ({
    title: `Saison ${season.seasonNumber}`,
    subtitle: `${season.episodes} épisode${season.episodes !== 1 ? 's' : ''}`,
    badges: [
      { type: 'fidelity', value: season.fidelity },
      ...(season.coverageFromVolume && season.coverageToVolume 
        ? [{ 
            type: 'coverage', 
            value: null, 
            label: `Tomes ${season.coverageFromVolume}-${season.coverageToVolume}` 
          }] 
        : [])
    ]
  }),
  
  validateItem: (season: Partial<Season>) => {
    if (!season.seasonNumber || season.seasonNumber < 1) {
      return 'Le numéro de saison doit être supérieur à 0';
    }
    if (!season.episodes || season.episodes < 1) {
      return 'Le nombre d\'épisodes doit être supérieur à 0';
    }
    if (season.coverageFromVolume && season.coverageToVolume && 
        season.coverageFromVolume > season.coverageToVolume) {
      return 'Le tome de début ne peut pas être supérieur au tome de fin';
    }
    return null;
  }
});

const AnimeSeasonManager: React.FC<AnimeSeasonManagerProps> = ({ 
  anime, 
  seasons, 
  onSeasonsUpdated 
}) => {
  const config = createSeasonConfig(anime.id);

  return (
    <GenericItemManager
      parentId={anime.id}
      items={seasons}
      config={config}
      onItemsUpdated={onSeasonsUpdated}
      showDebugger={true}
    />
  );
};

export default AnimeSeasonManager;