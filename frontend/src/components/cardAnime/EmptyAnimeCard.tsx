import React from 'react';
import { Film, Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext'; // Import the useEditMode hook

interface EmptyAnimeCardProps {
  onAddAnime: () => void;
}

const EmptyAnimeCard: React.FC<EmptyAnimeCardProps> = ({ onAddAnime }) => {
  // Use the EditModeContext to access the current edit mode state
  const { isEditMode, isDebugMode } = useEditMode();

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <div className="border-base-300 bg-base-200 border-b border-dashed">
        <div className="flex items-center gap-2 p-4">
          <Film size={18} className="opacity-70" />
          <h3 className="text-lg font-medium">Anime</h3>
        </div>
      </div>
      <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
        <p className="mb-3">Aucun anime trouvé pour cette licence</p>
        {/* Only show the Add button if in edit mode */}
        {isEditMode && (
          <button className="btn btn-success btn-sm btn-outline" onClick={onAddAnime}>
            <Plus size={16} /> Ajouter un anime
          </button>
        )}
        {/* Debug info shown only when both edit mode and debug mode are active */}
        {isEditMode && isDebugMode && (
          <div className="mt-4 p-2 bg-base-200 rounded text-xs">
            <p>Mode édition: <span className="font-bold">{isEditMode ? 'Activé' : 'Désactivé'}</span></p>
            <p>Mode débogage: <span className="font-bold">{isDebugMode ? 'Activé' : 'Désactivé'}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyAnimeCard;