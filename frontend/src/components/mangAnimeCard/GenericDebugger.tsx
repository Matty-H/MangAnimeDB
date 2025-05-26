//frontend/src/components/mangAnimeCard/GenericDebugger.tsx
import React, { useState } from 'react';
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { useEditMode } from '../ui/EditModeContext';

interface GenericDebuggerProps {
  apiResponseData: any;
  error: string | null;
  showByDefault?: boolean;
}

export const GenericDebugger: React.FC<GenericDebuggerProps> = ({
  apiResponseData,
  error,
  showByDefault = false
}) => {
  const { isEditMode } = useEditMode();
  const [showResponse, setShowResponse] = useState(showByDefault);

  if (!isEditMode) return null;

  return (
    <>
      <button 
        className="btn btn-error btn-sm btn-outline" 
        onClick={() => setShowResponse(!showResponse)}
      >
        <ChevronsLeftRightEllipsis size={16} />
        {showResponse ? 'Masquer le débogage' : 'Afficher le débogage'}
      </button>

      {showResponse && (
        <ApiResponseDisplay
          response={apiResponseData ? JSON.stringify(apiResponseData, null, 2) : null}
          error={error}
          onClose={() => setShowResponse(false)}
        />
      )}
    </>
  );
};