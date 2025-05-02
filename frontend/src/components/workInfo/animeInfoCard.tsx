import React from 'react';
import { AnimeWork, WorkStatus, AnimeFidelity, RelationType } from '../../types';

interface AnimeInfoCardProps {
  anime: AnimeWork;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({ anime }) => {
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatStatus = (status: WorkStatus) => {
    switch (status) {
      case WorkStatus.ONGOING:
        return 'En cours';
      case WorkStatus.COMPLETED:
        return 'Terminé';
      case WorkStatus.HIATUS:
        return 'En pause';
      case WorkStatus.UNFINISHED:
        return 'Inachevé';
      default:
        const statusString = String(status);
        return statusString.charAt(0).toUpperCase() + statusString.slice(1).toLowerCase();
    }
  };

  const getStatusBadgeClass = (status: WorkStatus) => {
    switch (status) {
      case WorkStatus.ONGOING:
        return 'badge-primary';
      case WorkStatus.COMPLETED:
        return 'badge-success';
      case WorkStatus.HIATUS:
        return 'badge-warning';
      case WorkStatus.UNFINISHED:
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const formatFidelity = (fidelity: AnimeFidelity) => {
    switch (fidelity) {
      case AnimeFidelity.FAITHFUL:
        return 'Fidèle';
      case AnimeFidelity.PARTIAL:
        return 'Peu fidèle';
      case AnimeFidelity.ANIME_ORIGINAL:
        return 'Original';
      default:
        const statusString = String(fidelity);
        return statusString.replace('_', ' ');
    }
  };

  const getFidelityBadgeClass = (fidelity: AnimeFidelity) => {
    switch (fidelity) {
      case AnimeFidelity.FAITHFUL:
        return 'badge-success';
      case AnimeFidelity.PARTIAL:
        return 'badge-warning';
      case AnimeFidelity.ANIME_ORIGINAL:
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  const formatRelationType = (type: RelationType) => {
    switch (type) {
      case RelationType.ORIGINAL:
        return 'Original';
      case RelationType.SEQUEL:
        return 'Suite';
      case RelationType.PREQUEL:
        return 'Préquelle';
      case RelationType.REMAKE:
        return 'Remake';
      case RelationType.SPIN_OFF:
        return 'Spin-off';
      case RelationType.REBOOT:
        return 'Reboot';
      default:
        return String(type).replace('_', ' ');
    }
  };

  const seasonCount = anime.seasons?.length || 0;
  const totalEpisodes = anime.episodes;
  const startYear = anime.startDate ? new Date(anime.startDate).getFullYear() : 'N/A';
  const endYear = anime.endDate
    ? new Date(anime.endDate).getFullYear()
    : (anime.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const airYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  // Créer un tableau des éléments à afficher dans la grille
  interface GridItem {
    value: React.ReactNode;
    label: string;
  }
  
  const gridItems: GridItem[] = [];
  
  if (seasonCount > 0) {
    gridItems.push({
      value: seasonCount,
      label: `Saison${seasonCount !== 1 ? 's' : ''}`
    });
  }
  
  gridItems.push({
    value: totalEpisodes,
    label: `Épisode${totalEpisodes !== 1 ? 's' : ''}`
  });
  
  gridItems.push({
    value: airYears,
    label: 'Diffusion'
  });
  
  gridItems.push({
    value: (
      <div className={`badge ${getStatusBadgeClass(anime.status)}`}>
        {formatStatus(anime.status)}
      </div>
    ),
    label: ''
  });
  
  gridItems.push({
    value: (
      <div className={`badge ${getFidelityBadgeClass(anime.fidelity)}`}>
        {formatFidelity(anime.fidelity)}
      </div>
    ),
    label: ''
  });

  // Déterminer la classe de grille en fonction du nombre d'éléments
  const getGridClass = () => {
    const count = gridItems.length;
    // Toujours sur une seule ligne, avec le nombre exact de colonnes
    return `grid-cols-${count}`;
  };

  return (
    <div className="card bg-base-200 shadow-sm w-full">
      <div className="card-body">
        <h2 className="card-title">{anime.title}</h2>
        <div className="divider m-0"></div>
        
        <div className="grid grid-cols-1 gap-1">
          <div className="flex text-sm">
            <div className="font-semibold w-1/4">Studio :</div>
            <div className="italic">{anime.studio}</div>
          </div>
          <div className="flex text-sm">
            <div className="font-semibold w-1/4">Type :</div>
            <div className="italic">{formatRelationType(anime.relationType)}</div>
          </div>
        </div>

        <div className="card bg-primary shadow-sm mt-1">
          <div className="card-body p-2">
            <div className="flex justify-between w-full gap-2 items-center">
              {gridItems.map((item, index) => (
                <div key={index} className="text-center flex-1">
                  <div className="font-semibold">{item.value}</div>
                  {item.label && <div className="text-xs">{item.label}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {anime.seasons && anime.seasons.length > 0 && (
            <ul className="list bg-base-100 rounded-box shadow-md">
              {anime.seasons.map((season) => (
                <li key={season.id} className="list-row">
                  <div className="flex-1">
                    <div className="font-semibold">Saison {season.seasonNumber}</div>
                    <div className="text-xs opacity-60">
                      {season.episodes} épisode{season.episodes !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end text-sm">
                    <span className={`badge ${getFidelityBadgeClass(season.fidelity)}`}>
                      {formatFidelity(season.fidelity)}
                    </span>
                    {season.coverageFromVolume && season.coverageToVolume && (
                      <span className="badge badge-secondary">
                        Tomes {season.coverageFromVolume}-{season.coverageToVolume}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
        )}

        {anime.notes && (
          <div className="card bg-base-300 shadow-sm mt-1">
            <div className="card-body p-3">
              <h3 className="font-bold text-lg">Notes</h3>
              <p className="text-xs">{anime.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeInfoCard;