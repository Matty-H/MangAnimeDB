import React from 'react';

interface AnimeCardHeaderProps {
  anime: any;
  isEditing: boolean;
  editedAnime: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onFieldChange: (field: string, value: any) => void;
  isLoading: boolean;
}

const AnimeCardHeader: React.FC<AnimeCardHeaderProps> = ({
  anime,
  isEditing,
  editedAnime,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFieldChange,
  isLoading
}) => {
  return (
    <div className="card-header p-4 bg-base-200 border-b border-base-300 flex flex-wrap justify-between items-center gap-2">
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editedAnime?.title || ''}
            onChange={(e) => onFieldChange('title', e.target.value)}
            className="input input-bordered w-full"
            placeholder="Titre de l'anime"
          />
        ) : (
          <h2 className="card-title">{anime?.title || 'Sans titre'}</h2>
        )}
      </div>
      
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              className="btn btn-sm btn-primary"
              onClick={onSave}
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={onDelete}
              disabled={isLoading}
            >
              Supprimer
            </button>
          </>
        ) : (
          <button
            className="btn btn-sm btn-outline"
            onClick={onEdit}
          >
            Modifier
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimeCardHeader;