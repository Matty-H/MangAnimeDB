import React from 'react';
import { Season } from './AnimeSeasonManager';
import SeasonItem from './SeasonItem';

interface SeasonListProps {
  seasons: Season[];
  onEdit: (seasonId: string) => void;
  onDelete: (seasonId: string) => void;
  isLoading: boolean;
}

const SeasonList: React.FC<SeasonListProps> = ({ 
  seasons, 
  onEdit, 
  onDelete,
  isLoading 
}) => {
  if (seasons.length === 0) {
    return (
      <div className="text-center py-4 border border-base-300 rounded-lg">
        <p className="text-sm text-gray-500">Aucune saison ajoutée</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-base-300 overflow-hidden">
      {seasons.map((season, index) => (
        <SeasonItem
          key={season.id}
          season={season}
          isLast={index === seasons.length - 1}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default SeasonList;