import React from 'react';
import { AnimeWork, WorkStatus, AnimeFidelity, RelationType } from '../../types';
import { Info, Calendar, Tv, Film, BarChart2 } from 'lucide-react';
import Badge from './ui/badge';

interface AnimeInfoCardProps {
  anime: AnimeWork;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({ anime }) => {
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const seasonCount = anime.seasons?.length || 0;
  const totalEpisodes = anime.episodes;
  const startYear = anime.startDate ? new Date(anime.startDate).getFullYear() : 'N/A';
  const endYear = anime.endDate
    ? new Date(anime.endDate).getFullYear()
    : (anime.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const airYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <div className="border-base-300 bg-base-200 border-b border-dashed">
        <div className="flex items-center gap-2 p-4">
          <div className="grow">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">{anime.title}</div>
              <div className="italic opacity-70 text-sm">{anime.studio}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body gap-4 p-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Tv size={16} className="opacity-40" />
            <span>
              {seasonCount} Saison{seasonCount !== 1 ? 's' : ''} • {totalEpisodes} Épisode{totalEpisodes !== 1 ? 's' : ''}
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
        
        {anime.seasons && anime.seasons.length > 0 && (
          <div className="mt-2">
            <div className="text-sm font-medium mb-2">Détails des saisons</div>
            <div className="rounded-lg border border-base-300 overflow-hidden">
              {anime.seasons.map((season, index) => (
                <div key={season.id} className={`p-3 flex items-center justify-between ${
                  index < anime.seasons.length - 1 ? 'border-b border-base-300 border-dashed' : ''
                }`}>
                  <div>
                    <div className="font-medium">Saison {season.seasonNumber}</div>
                    <div className="text-xs opacity-60">
                      {season.episodes} épisode{season.episodes !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {anime.notes && (
          <div className="mt-2 bg-base-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 text-primary" />
              <p className="text-sm">{anime.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeInfoCard;