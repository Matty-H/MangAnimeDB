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

  return (
    <div className="manga-info-card">
      <div className="manga-header">
        <h3>{manga.publisher}</h3>
      </div>
      
      <div className="manga-details">
        <div className="manga-detail-row">
          <div className="detail-label">Auteur(s)</div>
          <div className="detail-value">{manga.authors.join(', ')}</div>
        </div>
        
        <div className="manga-detail-row">
          <div className="detail-label">Volumes</div>
          <div className="detail-value">{manga.volumes}</div>
        </div>
        
        <div className="manga-detail-row">
          <div className="detail-label">Statut</div>
          <div className="detail-value">
            <span className={`status-badge status-${manga.status.toLowerCase()}`}>
              {formatStatus(manga.status)}
            </span>
          </div>
        </div>
        
        <div className="manga-detail-row">
          <div className="detail-label">Début</div>
          <div className="detail-value">{formatDate(manga.startDate)}</div>
        </div>
        
        {manga.status === WorkStatus.COMPLETED && (
          <div className="manga-detail-row">
            <div className="detail-label">Fin</div>
            <div className="detail-value">{formatDate(manga.endDate)}</div>
          </div>
        )}
        
        <div className="manga-detail-row">
          <div className="detail-label">Éditeur</div>
          <div className="detail-value">{manga.publisher}</div>
        </div>
      </div>
    </div>
  );
};

export default MangaInfoCard;