//frontend/src/components/cardAnime/EmptyAnimeCard.tsx
import React from 'react';
import { Season } from './AnimeSeasonManager';
import { Pencil, X } from 'lucide-react';
import Badge from '../ui/badge';

interface SeasonItemProps {
  season: Season;
  isLast: boolean;
  onEdit: (seasonId: string) => void;
  onDelete: (seasonId: string) => void;
  isLoading: boolean;
}

const SeasonItem: React.FC<SeasonItemProps> = ({ 
  season, 
  isLast, 
  onEdit, 
  onDelete,
  isLoading 
}) => {
  return (
    <div 
      className={`p-3 ${!isLast ? 'border-b border-base-300 border-dashed' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Saison {season.seasonNumber}</div>
          <div className="text-xs opacity-60">
            {season.episodes} épisode{season.episodes !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Badge 
            contentType="fidelity"
            value={season.fidelity}
            size="sm"
          />
          {season.coverageFromVolume && season.coverageToVolume && (
            <Badge 
              contentType="coverage"
              label={`Tomes ${season.coverageFromVolume}-${season.coverageToVolume}`}
              size="sm" 
            />
          )}
          <div className="flex gap-1">
            <button 
              className="btn btn-success btn-xs btn-outline" 
              onClick={() => onEdit(season.id)}
            >
              <Pencil size={14} />
            </button>
            <button 
              className="btn btn-xs btn-outline btn-error" 
              onClick={() => onDelete(season.id)}
              disabled={isLoading}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonItem;