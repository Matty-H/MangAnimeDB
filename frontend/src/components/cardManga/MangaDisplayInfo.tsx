// components/manga/MangaInfo.tsx
import React from 'react';
import { MangaWork } from '../../types';
import { BookCopy, Calendar, Pen } from 'lucide-react';
import Badge from '../ui/badge';

interface MangaInfoProps {
  manga: MangaWork;
}

const MangaInfo: React.FC<MangaInfoProps> = ({ manga }) => {
  // Format des dates pour l'affichage
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calcul des années de publication
  const startYear = manga.startDate ? new Date(manga.startDate).getFullYear() : 'N/A';
  const endYear = manga.endDate
    ? new Date(manga.endDate).getFullYear()
    : (manga.status === 'ONGOING' ? 'présent' : 'N/A');
  const publicationYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {/* Info sur les auteurs */}
      {manga.authors && manga.authors.length > 0 && (
        <div className="flex items-center gap-2">
          <Pen size={16} className="opacity-40" />
          <span>{manga.authors.join(', ')}</span>
        </div>
      )}
      
      {/* Info sur la période de publication */}
      <div className="flex items-center gap-2">
        <Calendar size={16} className="opacity-40" />
        <span>{publicationYears}</span>
      </div>
      
      {/* Info sur les volumes */}
      <div className="flex items-center gap-2">
        <BookCopy size={16} className="opacity-40" />
        <span>{manga.volumes} tome{manga.volumes !== 1 ? 's' : ''}</span>
      </div>
      
      {/* Badge de statut */}
      <div className="flex gap-2">
        <Badge contentType="status" value={manga.status} />
      </div>
    </div>
  );
};

export default MangaInfo;