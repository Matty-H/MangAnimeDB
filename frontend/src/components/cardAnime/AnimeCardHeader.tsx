import React from 'react';
import { BookOpen, Pencil, Check, X, Loader } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';

interface AnimeHeaderProps {
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

const AnimeHeader: React.FC<AnimeHeaderProps> = ({
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
  const { isEditMode, isDebugMode } = useEditMode();

  return (
    <div className="border-base-300 bg-base-200 border-b border-dashed">
      <div className="flex items-center gap-2 p-4">
        <BookOpen size={18} className="opacity-70" />
        <div className="grow">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <>
                <input
                  className="input input-sm max-w-xs"
                  value={editedAnime?.title || ''}
                  onChange={(e) => onFieldChange('title', e.target.value)}
                  placeholder="Titre de l'anime"
                />
                <input
                  className="input input-sm max-w-xs"
                  value={editedAnime?.studio || ''}
                  onChange={(e) => onFieldChange('studio', e.target.value)}
                  placeholder="Studio"
                />
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium">{anime?.title || 'Sans titre'}</h3>
                <div className="italic opacity-70 text-sm">{anime?.studio || ''}</div>
              </>
            )}
          </div>
        </div>
        
        {isDebugMode && (
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={onSave}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                  Sauvegarder
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  <X size={16} /> Annuler
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <button className="btn btn-success btn-sm btn-outline" onClick={onEdit}>
                <Pencil size={16} /> Éditer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeHeader;