import React, { useState, useEffect } from 'react';
import { Check, Pencil } from 'lucide-react';
import { AdaptationRowProps } from './AdaptationTable';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { useEditMode } from '../ui/EditModeContext';
import { searchService } from '../../services';

const AdaptationRow: React.FC<AdaptationRowProps> = ({ row, index, isLastRow }) => {
  const { isEditMode } = useEditMode(); // Utilisation du contexte d'édition
  const [episodes, setEpisodes] = useState(row.episodes);
  const [fromVolume, setFromVolume] = useState<string | number>(row.fromVolume ?? '');
  const [toVolume, setToVolume] = useState<string | number>(row.toVolume ?? '');
  const [isRowEditing, setIsRowEditing] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const handleSaveRow = async () => {
    try {
      const data = await searchService.updateAdaptation(row.id, {
        type: row.type,
        episodes: Number(episodes),
        fromVolume: fromVolume !== '' ? Number(fromVolume) : null,
        toVolume: toVolume !== '' ? Number(toVolume) : null
      });
      
      setApiResponse(JSON.stringify(data, null, 2));
      setShowResponse(true);
      setIsRowEditing(false);
      setError(null);
    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
      setError(`Erreur lors de la sauvegarde: ${err instanceof Error ? err.message : 'Inconnue'}`);
      setShowResponse(true);
    }
  };

  const handleCancel = () => {
    setEpisodes(row.episodes);
    setFromVolume(row.fromVolume ?? '');
    setToVolume(row.toVolume ?? '');
    setIsRowEditing(false);
    setError(null);
  };

  useEffect(() => {
    if (apiResponse || error) setShowResponse(true);
  }, [apiResponse, error]);

  const renderVolumeRange = () => {
    if (isRowEditing) {
      return (
        <>
          <input
            type="number"
            className="input input-sm w-14 text-center"
            value={fromVolume}
            onChange={(e) => setFromVolume(e.target.value)}
          />
          <span className="mx-1">-</span>
          <input
            type="number"
            className="input input-sm w-14 text-center"
            value={toVolume}
            onChange={(e) => setToVolume(e.target.value)}
          />
        </>
      );
    } else {
      if (row.fromVolume && row.toVolume) {
        return `${row.fromVolume}-${row.toVolume}`;
      } else if (row.fromVolume) {
        return `${row.fromVolume}+`;
      } else if (row.toVolume) {
        return `Jusqu'au tome ${row.toVolume}`;
      } else {
        return 'N/A';
      }
    }
  };

  return (
    <>
      <div
        className={`p-3 flex items-center ${
          !isLastRow ? 'border-b border-base-300 border-dashed' : ''
        }`}
      >
        <div className="flex-1">{row.seasonName}</div>

        <div className="w-24 text-center">
          {isRowEditing ? (
            <input
              type="number"
              className="input input-sm w-12 text-center"
              value={episodes}
              onChange={(e) => setEpisodes(Number(e.target.value))}
            />
          ) : (
            row.episodes
          )}
        </div>

        <div className="w-32 text-center flex justify-center gap-1">
          {renderVolumeRange()}
        </div>

        <div className="w-16 text-center text-xs opacity-50">
          {row.type}
        </div>

        {/* Affichage de la colonne d'actions seulement en mode édition */}
        {isEditMode && (
          <div className="w-16 text-center">
            {isRowEditing ? (
              <div className="flex gap-2 justify-center">
                <button className="btn btn-sm btn-success" onClick={handleSaveRow}>
                  <Check size={16} />
                </button>
                <button className="btn btn-sm btn-ghost" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            ) : (
              <button className="btn btn-success btn-sm btn-outline" onClick={() => setIsRowEditing(true)}>
                <Pencil size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Affichage réponse ou erreur */}
      {showResponse && (apiResponse || error) && (
        <div className="px-3 pb-3">
          <ApiResponseDisplay
            response={apiResponse}
            error={error}
            onClose={() => setShowResponse(false)}
          />
        </div>
      )}
    </>
  );
};

export default AdaptationRow;