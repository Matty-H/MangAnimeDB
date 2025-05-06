// AnimeCardHeader.jsx
import React from 'react';
import { Pencil, Check, X } from 'lucide-react';

const AnimeCardHeader = ({ 
  anime, 
  isEditing, 
  editedAnime, 
  onEdit, 
  onSave, 
  onCancel, 
  onFieldChange, 
  isLoading 
}) => {
  return (
    <div className="border-base-300 bg-base-200 border-b border-dashed">
      <div className="flex items-center gap-2 p-4">
        <div className="grow">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <input
                className="input input-sm max-w-xs"
                value={editedAnime?.title || ''}
                onChange={(e) => onFieldChange('title', e.target.value)}
              />
            ) : (
              <div className="text-lg font-medium">{anime.title}</div>
            )}
            
            {isEditing ? (
              <input
                className="input input-sm max-w-xs"
                value={editedAnime?.studio || ''}
                onChange={(e) => onFieldChange('studio', e.target.value)}
              />
            ) : (
              <div className="italic opacity-70 text-sm">{anime.studio}</div>
            )}
          </div>
        </div>
        
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                className={`btn btn-sm btn-success ${isLoading ? 'loading' : ''}`}
                onClick={onSave}
                disabled={isLoading}
              >
                <Check size={16} /> Sauvegarder
              </button>
              <button 
                className="btn btn-sm btn-outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                <X size={16} /> Annuler
              </button>
            </div>
          ) : (
            <button className="btn btn-sm btn-outline" onClick={onEdit}>
              <Pencil size={16} /> Éditer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeCardHeader;