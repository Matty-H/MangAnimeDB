// frontend/src/components/cardAnime/EmptyAnimeCard.tsx
import React from 'react';
import { Film, Plus } from 'lucide-react';

interface EmptyAnimeCardProps {
  onAddAnime: () => void;
}

const EmptyAnimeCard: React.FC<EmptyAnimeCardProps> = ({ onAddAnime }) => {
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
        <button className="btn btn-sm btn-outline" onClick={onAddAnime}>
          <Plus size={16} /> Ajouter un anime
        </button>
      </div>
    </div>
  );
};

export default EmptyAnimeCard;