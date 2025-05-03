import React from 'react';
import { MangaWork, WorkStatus, MangaPart } from '../../types';
import { Info, Calendar, Book, Layers } from 'lucide-react';
import Badge from './ui/badge';

interface MangaInfoCardProps {
  manga: MangaWork;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({ manga }) => {
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const startYear = manga.startDate ? new Date(manga.startDate).getFullYear() : 'N/A';
  const endYear = manga.endDate
    ? new Date(manga.endDate).getFullYear()
    : (manga.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const publishYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;
  const partsCount = manga.parts?.length || 0;

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <div className="border-base-300 bg-base-200 border-b border-dashed">
        <div className="flex items-center gap-2 p-4">
          <div className="grow">
            <div className="flex items-center justify-between gap-2">
              <div className="text-lg font-medium">{manga.title}</div>
              <div className="italic opacity-70 text-sm">{manga.authors.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body gap-4 p-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Book size={16} className="opacity-40" />
            <span>
              {manga.volumes} Volume{manga.volumes !== 1 ? 's' : ''}
              {partsCount > 0 && ` • ${partsCount} Partie${partsCount !== 1 ? 's' : ''}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} className="opacity-40" />
            <span>{publishYears}</span>
          </div>
          
          <div className="flex gap-2">
            <Badge contentType="status" value={manga.status} />
          </div>
        </div>
        
        {manga.parts!.length > 0 && (() => {
          const parts = manga.parts!;
          return (
            <div className="mt-2">
              <div className="text-sm font-medium mb-2">Détails des parties</div>
              <div className="rounded-lg border border-base-300 overflow-hidden">
                {parts.map((part: MangaPart, index) => (
                  <div
                    key={part.id}
                    className={`p-3 flex items-center justify-between ${
                      index < parts.length - 1 ? 'border-b border-base-300 border-dashed' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {part.title || `Partie ${part.partNumber}`}
                      </div>
                      <div className="text-xs opacity-60">
                        Tomes {part.startVolume}-{part.endVolume}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge contentType="status" value={part.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default MangaInfoCard;