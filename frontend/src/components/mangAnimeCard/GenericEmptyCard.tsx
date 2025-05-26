//frontend/src/components/mangAnimeCard/GenericEmptyCard.tsx (optimisé)
import React from 'react';
import { Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';
import { ItemType, getTypeConfig } from './utils/typeUtils';

interface GenericEmptyCardProps {
  type: ItemType;
  onAdd: () => void;
}

const GenericEmptyCard: React.FC<GenericEmptyCardProps> = ({ type, onAdd }) => {
  const { isEditMode } = useEditMode();
  const { icon: Icon, displayName, displayNameLower } = getTypeConfig(type);

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <div className="border-base-300 bg-base-200 border-b border-dashed">
        <div className="flex items-center gap-2 p-4">
          <Icon size={18} className="opacity-70" />
          <h3 className="text-lg font-medium">{displayName}</h3>
        </div>
      </div>
      <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
        <p className="mb-3">Aucun {displayNameLower} trouvé pour cette licence</p>
        {isEditMode && (
          <button className="btn btn-success btn-sm btn-outline" onClick={onAdd}>
            <Plus size={16} /> Ajouter un {displayNameLower}
          </button>
        )}
      </div>
    </div>
  );
};

export default GenericEmptyCard;