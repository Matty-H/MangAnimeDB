import React from 'react';
import { Pencil, Check, X, Loader, BookOpen } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';

interface MangaHeaderProps {
  title: string;
  publisher: string;
  isEditing: boolean;
  isLoading: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onDeleteClick: () => void;
  onTitleChange: (value: string) => void;
  onPublisherChange: (value: string) => void;
}

const MangaHeader: React.FC<MangaHeaderProps> = ({
  title,
  publisher,
  isEditing,
  isLoading,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onDeleteClick,
  onTitleChange,
  onPublisherChange
}) => {
  const { isEditMode } = useEditMode();
  
  return (
    <div className="border-base-300 bg-base-200 border-b border-dashed">
      <div className="flex items-center gap-2 p-4">
        <BookOpen size={18} className="opacity-70" />
        <div className="grow">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <input
                className="input input-sm max-w-xs"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            ) : (
              <div className="text-lg font-medium">{title}</div>
            )}
            {isEditing ? (
              <input
                className="input input-sm max-w-xs"
                value={publisher || ''}
                onChange={(e) => onPublisherChange(e.target.value)}
              />
            ) : (
              <div className="italic opacity-70 text-sm">{publisher}</div>
            )}
          </div>
        </div>
        {isEditMode && (
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={onSaveClick}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                  Sauvegarder
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={onCancelClick}
                  disabled={isLoading}
                >
                  <X size={16} /> Annuler
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={onDeleteClick}
                  disabled={isLoading}
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <button className="btn btn-success btn-sm btn-outline" onClick={onEditClick}>
                <Pencil size={16} /> Éditer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaHeader;
