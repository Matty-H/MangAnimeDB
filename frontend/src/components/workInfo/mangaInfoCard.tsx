import React from 'react';
import { MangaWork, WorkStatus } from '../../types';
import './mangaInfoCard.css';

interface MangaInfoCardProps {
  manga: MangaWork;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({ manga }) => {
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

  // Get the start and end years for publication
  const startYear = manga.startDate ? new Date(manga.startDate).getFullYear() : 'N/A';
  const endYear = manga.endDate 
    ? new Date(manga.endDate).getFullYear() 
    : (manga.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const publishYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  return (
    <div className="manga-info-card media-card">
      <div className="manga-header media-header">
        <h3>{manga.title}</h3>
      </div>

      <div className="media-detail-row">
        <div className="detail-label">Éditeur : </div>
        <div className="detail-value">{manga.publisher}</div>
      </div>
      
      <div className="manga-stats media-stats">
        <div className="stat-item">
          <div className="stat-value">{manga.volumes}</div>
          <div className="stat-label">Volume{manga.volumes !== 1 ? 's' : ''}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{startYear}</div>
          <div className="stat-label">Publication</div>
        </div>
        
        <div className="stat-item">
          <div className={`stat-value status-badge status-${manga.status.toLowerCase()}`}>
            {formatStatus(manga.status)}
          </div>
          <div className="stat-label">Statut</div>
        </div>
      </div>
      
      <div className="manga-details media-details">
        {/* Vous pouvez ajouter d'autres détails ici */}
      </div>
    </div>
  );
};

export default MangaInfoCard;