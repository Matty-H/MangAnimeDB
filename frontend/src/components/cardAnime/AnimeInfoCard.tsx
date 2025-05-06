import React, { useState, useEffect } from 'react';
import EmptyAnimeCard from './EmptyAnimeCard';
import AnimeCardHeader from './AnimeCardHeader';
import AnimeEditForm from './AnimeEditForm';
import AnimeDisplayInfo from './AnimeDisplayInfo';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';

interface AnimeInfoCardProps {
  anime?: any;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onAnimeUpdated?: (updatedAnime: any) => void;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({
  anime,
  licenseId,
  isEmptyTemplate = false,
  onAnimeUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnime, setEditedAnime] = useState(anime);
  const [apiResponse, setApiResponse] = useState('');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    setEditedAnime(anime);
    setApiResponse('');
    setApiResponseData(null);
    setError(null);
  }, [anime]);

  // Mise à jour des états lors de nouvelles réponses API ou erreurs
  useEffect(() => {
    if (apiResponse || error) {
      setShowAlert(true);
    }
  }, [apiResponse, error]);

  if (isEmptyTemplate || !anime) {
    return <EmptyAnimeCard onAddAnime={() => {/* Logique pour ajouter un anime */}} />;
  }

  const handleFieldChange = (field: string, value: any) => {
    if (!editedAnime) return;
    setEditedAnime({ ...editedAnime, [field]: value });
  };

  const saveAnimeChanges = async () => {
    if (!editedAnime) return;
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
    
    try {
      const response = await fetch(`/api/anime/${editedAnime.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAnime),
      });

      const responseData = await response.json();
      setApiResponseData(responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || `Erreur: ${response.status}`);
      }

      setApiResponse('Anime mis à jour avec succès');
      setShowAlert(true);
      setIsEditing(false);
      
      if (onAnimeUpdated) {
        onAnimeUpdated(responseData);
      }
      
      setEditedAnime(responseData);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de l\'anime:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeasonsUpdated = (updatedSeasons: any) => {
    if (onAnimeUpdated && anime) {
      const updatedAnime = {
        ...anime,
        seasons: updatedSeasons
      };
      onAnimeUpdated(updatedAnime);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAnime(anime);
    setError(null);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <AnimeCardHeader
        anime={anime}
        isEditing={isEditing}
        editedAnime={editedAnime}
        onEdit={() => setIsEditing(true)}
        onSave={saveAnimeChanges}
        onCancel={handleCancel}
        onFieldChange={handleFieldChange}
        isLoading={isLoading}
      />
      
      <div className="card-body gap-4 p-4">
        {/* Affichage des alertes - indépendant du débogueur */}
        {showAlert && error && (
          <ErrorAlert message={error} onClose={handleAlertClose} />
        )}
        {showAlert && apiResponse && !error && (
          <SuccessAlert message={apiResponse} onClose={handleAlertClose} />
        )}

        {/* Bouton pour afficher/masquer le débogueur */}
        {(apiResponseData || error) && (
          <button 
            className="btn btn-sm btn-outline" 
            onClick={handleResponseToggle}
          >
            {showResponse ? "Masquer le débogage" : "Afficher le débogage"}
          </button>
        )}

        {/* Affichage du débogueur - indépendant des alertes */}
        {showResponse && (
          <ApiResponseDisplay
            response={apiResponseData ? JSON.stringify(apiResponseData, null, 2) : null}
            error={error}
            onClose={handleResponseToggle}
          />
        )}

        {isEditing ? (
          <AnimeEditForm
            editedAnime={editedAnime}
            onFieldChange={handleFieldChange}
          />
        ) : (
          <AnimeDisplayInfo
            anime={anime}
            onSeasonsUpdated={handleSeasonsUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default AnimeInfoCard;