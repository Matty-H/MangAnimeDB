// frontend/src/components/cardAnime/AnimeDisplayInfo.tsx
import React from 'react';
import { Tv, Calendar, Info } from 'lucide-react';
import Badge from '../../ui/badge';
import AnimeSeasonManager from './AnimeSeasonManager';

const AnimeDisplayInfo = ({ anime, onSeasonsUpdated }) => {
  const seasonCount = anime.seasons?.length || 0;
  const totalEpisodes = anime.episodes;
  const startYear = anime.startDate ? new Date(anime.startDate).getFullYear() : 'N/A';
  const endYear = anime.endDate
    ? new Date(anime.endDate).getFullYear()
    : (anime.status === 'ONGOING' ? 'présent' : 'N/A');
  const airYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  return (
    <>
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Tv size={16} className="opacity-40" />
          <span>
            {seasonCount === 0 ? 'Saison unique' : `${seasonCount} Saison${seasonCount > 1 ? 's' : ''}`} • {totalEpisodes} Épisode{totalEpisodes !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="opacity-40" />
          <span>{airYears}</span>
        </div>
        
        <div className="flex gap-2">
          <Badge contentType="status" value={anime.status} />
          <Badge contentType="fidelity" value={anime.fidelity} />
        </div>
      </div>
      
      {/* Composant de gestion des saisons */}
      <AnimeSeasonManager 
        anime={anime}
        seasons={anime.seasons || []}
        onSeasonsUpdated={onSeasonsUpdated}
      />

      {anime.notes && (
        <div className="mt-2 bg-base-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info size={16} className="mt-0.5 text-primary" />
            <p className="text-sm">{anime.notes}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimeDisplayInfo;