// AdaptationList.tsx
import React from 'react';
import AdaptationRow from './AdaptationRow';
import { AdaptationListProps } from './AdaptationTable';

const AdaptationList: React.FC<AdaptationListProps> = ({ adaptationRows }) => {
  return (
    <div className="rounded-lg border border-base-300  overflow-hidden">
      {/* En-tête du tableau */}
      <div className="bg-base-200 p-3 flex font-medium text-sm">
        <div className="flex-1">Anime</div>
        <div className="w-24 text-center">Épisodes</div>
        <div className="w-32 text-center">Vol. manga</div>
        <div className="w-16 text-center">Type</div>
        <div className="w-16 text-center">Actions</div>
      </div>

      {/* Contenu du tableau */}
      {adaptationRows.length > 0 ? (
        adaptationRows.map((row, index) => (
          <AdaptationRow 
            key={row.id}
            row={row}
            index={index}
            isLastRow={index === adaptationRows.length - 1}
          />
        ))
      ) : (
        <div className="p-6 text-center flex flex-col items-center justify-center text-gray-500">
          <p className="mb-3">Aucune adaptation trouvée pour cette licence, ajouter un anime et un manga pour créer le tableau</p>
        </div>
      )}
    </div>
  );
};

export default AdaptationList;