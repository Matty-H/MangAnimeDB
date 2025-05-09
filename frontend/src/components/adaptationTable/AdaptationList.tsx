//frontend/src/components/adaptationTable/AdaptationList.tsx
import React from 'react';
import { AdaptationListProps } from './AdaptationTable';
import AdaptationRow from './AdaptationRow';
import { useEditMode } from '../ui/EditModeContext';

const AdaptationList: React.FC<AdaptationListProps> = ({ adaptationRows }) => {
  const { isEditMode } = useEditMode();
  
  return (
    <div className="bg-base-100 rounded-md shadow-sm overflow-hidden">
      {/* En-têtes */}
      <div className="bg-base-200 p-3 flex font-medium text-sm">
        <div className="flex-1">Saison</div>
        <div className="w-24 text-center">Épisodes</div>
        <div className="w-32 text-center">Tomes</div>
        <div className="w-16 text-center">Type</div>
        {/* Affichage conditionnel de l'en-tête "Actions" */}
        {isEditMode && <div className="w-16 text-center">Actions</div>}
      </div>
      
      {/* Lignes de données */}
      {adaptationRows.map((row, index) => (
        <AdaptationRow
          key={row.id}
          row={row}
          index={index}
          isLastRow={index === adaptationRows.length - 1}
        />
      ))}
      
      {adaptationRows.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Aucune adaptation disponible
        </div>
      )}
    </div>
  );
};

export default AdaptationList;