import React, { useState } from 'react';
import { BookOpen, Tv, ArrowRight, Pencil, Check } from 'lucide-react';
import { AdaptationHeaderProps } from './AdaptationTable';
import { useEditMode } from '../ui/EditModeContext';
import { searchService } from '../../services';

const AdaptationHeader: React.FC<AdaptationHeaderProps> = ({ title, license, onTitleChange }) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  
  const handleSaveTitle = async () => {
    try {
      await searchService.updateLicenseTitle(license.id, editedTitle);
      onTitleChange(editedTitle);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur de mise à jour du titre :', err);
      alert("Échec de la mise à jour du titre.");
    }
  };
  
  return (
    <div className="border-base-300 bg-base-200 border-b border-dashed">
      <div className="flex items-center gap-2 p-4">
        <div className="grow">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="opacity-70" />
            <ArrowRight size={16} className="opacity-50" />
            <Tv size={18} className="opacity-70" />
            {isEditing ? (
              <input
                className="input input-sm max-w-xs"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            ) : (
              <h2 className="text-lg font-medium">{title}</h2>
            )}
          </div>
        </div>
        
        {/* N'afficher le bouton d'édition que si isEditMode est vrai */}
        {isEditMode && (
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button className="btn btn-sm btn-success" onClick={handleSaveTitle}>
                  <Check size={16} /> Sauvegarder
                </button>
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setEditedTitle(title);
                    setIsEditing(false);
                  }}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button className="btn btn-success btn-sm btn-outline" onClick={() => setIsEditing(true)}>
                <Pencil size={16} /> Éditer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptationHeader;