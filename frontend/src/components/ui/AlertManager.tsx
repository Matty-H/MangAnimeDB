// components/ui/AlertManager.tsx
import React from 'react';
import { ErrorAlert } from './ErrorAlert';
import { SuccessAlert } from './SuccessAlert';
import ApiResponseDisplay from './ApiResponseDisplay';
import { ChevronsLeftRightEllipsis } from 'lucide-react';

interface AlertManagerProps {
  error: string | null;
  success: string | null;
  response?: any;
  isDebugMode?: boolean;
  showDebug?: boolean;
  onClose: () => void;
  onToggleDebug?: () => void;
}

export const AlertManager: React.FC<AlertManagerProps> = ({
  error,
  success,
  response,
  isDebugMode = false,
  showDebug = false,
  onClose,
  onToggleDebug
}) => {
  return (
    <>
      {/* Alertes d'erreur et de succès */}
      {error && <ErrorAlert message={error} onClose={onClose} />}
      {success && !error && <SuccessAlert message={success} onClose={onClose} />}
      
      {/* Bouton de debug */}
      {isDebugMode && onToggleDebug && (
        <button 
          className="btn btn-error btn-sm btn-outline" 
          onClick={onToggleDebug}
        >
          {showDebug ? (
            <>
              <ChevronsLeftRightEllipsis size={16} /> Masquer le débogage
            </>
          ) : (
            <>
              <ChevronsLeftRightEllipsis size={16} /> Afficher le débogage
            </>
          )}
        </button>
      )}

      {/* Affichage du débogueur */}
      {showDebug && (
        <ApiResponseDisplay
          response={response ? JSON.stringify(response, null, 2) : null}
          error={error}
          onClose={onToggleDebug!}
        />
      )}
    </>
  );
};