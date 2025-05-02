//frontend/src/components/workInfo/mangaInfoCard.tsx
import React from 'react';
import { MangaWork, WorkStatus, MangaPart } from '../../types';

interface MangaInfoCardProps {
  manga: MangaWork;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({ manga }) => {
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

  const startYear = manga.startDate ? new Date(manga.startDate).getFullYear() : 'N/A';
  const endYear = manga.endDate
    ? new Date(manga.endDate).getFullYear()
    : (manga.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const publishYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;
  const partsCount = manga.parts?.length || 0;

  return (
    <div className="card bg-base-200 shadow-sm w-full">
      <div className="card-body">
        <h2 className="card-title">{manga.title}</h2>
        
        <div className="flex text-sm">
          <div className="font-semibold w-1/4">
            Auteur{manga.authors.length > 1 ? 's' : ''} :
          </div>
          <div className="italic">{manga.authors.join(', ')}</div>
        </div>

        <div className="card bg-primary shadow-sm">
          <div className="card-body p-2">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="font-semibold">{manga.volumes}</div>
                <div className="text-xs">Volume{manga.volumes !== 1 ? 's' : ''}</div>
              </div>
              {partsCount > 0 && (
                <div className="text-center">
                  <div className="font-semibold">{partsCount}</div>
                  <div className="text-xs">Partie{partsCount !== 1 ? 's' : ''}</div>
                </div>
              )}
              <div className="text-center">
                <div className="font-semibold">{publishYears}</div>
                <div className="text-xs">Publication</div>
              </div>
              <div className="text-center">
                <div className={`badge ${getStatusBadgeClass(manga.status)}`}>
                  {formatStatus(manga.status)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {manga.parts && manga.parts.length > 0 && (
          <div className="mt-4">
            <ul className="list bg-base-100 rounded-box shadow-md divide-y divide-base-300">
              {manga.parts.map((part: MangaPart) => (
                <li key={part.id} className="list-row p-4 flex items-center justify-between gap-4">
                  <span className="font-semibold">
                    {part.title || `Partie ${part.partNumber}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-semibold opacity-60">
                      Tomes {part.startVolume}-{part.endVolume}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(part.status)}`}>
                      {formatStatus(part.status)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaInfoCard;