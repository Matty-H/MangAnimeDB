import React from 'react';
import { AnimeWork, WorkStatus, AnimeFidelity, RelationType } from '../../types';
import './animeInfoCard.css';

interface AnimeInfoCardProps {
  anime: AnimeWork;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({ anime }) => {
  // Helper function to format dates
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to display status in a more readable format
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

  // Helper function to display fidelity in a more readable format
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

  // Helper function to display relation type in a more readable format
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
        const statusString = String(type);
        return statusString.replace('_', ' ');
    }
  };

  // Get the total number of seasons
  const seasonCount = anime.seasons?.length || 0;
  const totalEpisodes = anime.episodes;

  // Get the air years range
  const startYear = anime.startDate ? new Date(anime.startDate).getFullYear() : 'N/A';
  const endYear = anime.endDate 
    ? new Date(anime.endDate).getFullYear() 
    : (anime.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const airYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  return (
    <div className="anime-info-card media-card">
      <div className="anime-header media-header">
        <h3>{anime.title}</h3>
      </div>

      <div className="media-detail-row">
        <div className="detail-label">Studio : </div>
        <div className="detail-value">{anime.studio}</div>

        <div className="detail-label">Type : </div>
        <div className="detail-value">{formatRelationType(anime.relationType)}</div>
      </div>
      
      <div className="anime-stats media-stats">
        {seasonCount === 0 ? "" :
          <div className="stat-item">
            <div className="stat-value">{seasonCount}</div>
            <div className="stat-label">Saison{seasonCount !== 1 ? 's' : ''}</div>
          </div>
        }
          
        <div className="stat-item">
          <div className="stat-value">{totalEpisodes}</div>
          <div className="stat-label">Épisode{totalEpisodes !== 1 ? 's' : ''}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{startYear}</div>
          <div className="stat-label">Diffusion</div>
        </div>
        
        <div className="stat-item">
          <div className={`stat-value status-badge status-${anime.status.toLowerCase()}`}>
            {formatStatus(anime.status)}
          </div>
          <div className="stat-label">Statut</div>
        </div>
        <span className={`fidelity-badge fidelity-${anime.fidelity.toLowerCase()}`}>
          {formatFidelity(anime.fidelity)}
        </span>
      </div>
      
      <div className="anime-details media-details">
        {anime.seasons && anime.seasons.length > 0 && (
          <div className="anime-seasons">
            <h4>Saisons</h4>
            <div className="seasons-list">
              {anime.seasons.map(season => (
                <div key={season.id} className="season-item">
                  <div className="season-header">
                    <div className="season-title">Saison {season.seasonNumber}</div>
                    <div className="season-episodes">{season.episodes} épisodes</div>
                  </div>
                  <div className="season-detail">
                    <span className={`fidelity-badge fidelity-${season.fidelity.toLowerCase()}`}>
                      {formatFidelity(season.fidelity)}
                    </span>
                    {season.coverageFromVolume && season.coverageToVolume && (
                      <span className="season-coverage">
                        Tomes {season.coverageFromVolume}-{season.coverageToVolume}
                      </span>
                    )}
                  </div>
                  {season.notes && (
                    <div className="season-notes">
                      <p>{season.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {anime.notes && (
          <div className="anime-notes media-notes">
            <h4>Notes</h4>
            <p>{anime.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeInfoCard;