//frontend/src/components/cardManga/MangaEditForm.tsx
import React from 'react';
import { MangaWork, WorkStatus } from '../../../types';

interface MangaEditFormProps {
  manga: MangaWork; // Changé de editedManga vers manga
  onFieldChange: (field: keyof MangaWork, value: any) => void;
  onAuthorsChange?: (authorsString: string) => void; // Optionnel car géré en interne
}

const MangaEditForm: React.FC<MangaEditFormProps> = ({
  manga, // Utilisé manga au lieu de editedManga
  onFieldChange
}) => {
  const handleAuthorsChange = (authorsString: string) => {
    const authorsArray = authorsString
      .split(',')
      .map(author => author.trim())
      .filter(author => author.length > 0);
    onFieldChange('authors', authorsArray);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nombre de tomes</span>
        </label>
        <input
          type="number"
          className="input input-sm input-bordered"
          value={manga?.volumes || 0}
          onChange={(e) => onFieldChange('volumes', parseInt(e.target.value) || 0)}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Éditeur</span>
        </label>
        <input
          type="text"
          className="input input-sm input-bordered"
          value={manga?.publisher || ''}
          onChange={(e) => onFieldChange('publisher', e.target.value)}
        />
      </div>
      
      <div className="form-control col-span-2">
        <label className="label">
          <span className="label-text">Auteurs (séparés par des virgules)</span>
        </label>
        <input
          type="text"
          className="input input-sm input-bordered"
          value={manga?.authors ? manga.authors.join(', ') : ''}
          onChange={(e) => handleAuthorsChange(e.target.value)}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Date de début</span>
        </label>
        <input
          type="date"
          className="input input-sm input-bordered"
          value={manga?.startDate ? new Date(manga.startDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onFieldChange('startDate', e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Date de fin</span>
        </label>
        <input
          type="date"
          className="input input-sm input-bordered"
          value={manga?.endDate ? new Date(manga.endDate).toISOString().split('T')[0] : ''}
          onChange={(e) => onFieldChange('endDate', e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Statut</span>
        </label>
        <select
          className="select select-sm select-bordered"
          value={manga?.status || WorkStatus.ONGOING}
          onChange={(e) => onFieldChange('status', e.target.value as WorkStatus)}
        >
          {Object.values(WorkStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MangaEditForm;