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
  onAnimeDeleted?: (animeId: string) => void;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({
  anime,
  licenseId,
  isEmptyTemplate = false,
  onAnimeUpdated,
  onAnimeDeleted
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnime, setEditedAnime] = useState(anime);
  const [apiResponse, setApiResponse] = useState('');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  // Fonction pour ajouter un nouvel anime
  const handleAddAnime = async () => {
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
    
    try {
      // Assurons-nous que licenseId est bien défini
      if (!licenseId) {
        throw new Error("L'ID de licence est obligatoire");
      }
      
      // Création d'un anime avec tous les champs obligatoires
      const newAnime = {
        licenseId: licenseId,
        title: "Nouvel anime",
        studio: "Studio à déterminer", // Champ obligatoire
        adaptationType: "TV_SERIES",   // Valeurs d'enum obligatoires
        status: "ONGOING",
        fidelity: "FAITHFUL",
        relationType: "MANGA_ADAPTATION"
      };
      
      console.log('Tentative de création d\'anime avec:', JSON.stringify(newAnime));
      
      const response = await fetch('/api/anime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnime),
      });

      console.log('Statut de la réponse:', response.status);
      
      // Capturer le texte de la réponse brute pour un meilleur débogage
      const responseText = await response.text();
      console.log('Texte de la réponse brute:', responseText);
      
      // Tenter de parser le JSON, mais capturer les erreurs
      let responseData;
      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
        } else {
          responseData = { message: 'Réponse vide du serveur' };
        }
      } catch (parseError) {
        console.error('Erreur lors du parsing JSON:', parseError);
        responseData = { error: 'Format de réponse non valide', rawResponse: responseText };
      }
      
      setApiResponseData(responseData);
      
      if (!response.ok) {
        // Afficher les détails complets de l'erreur
        const errorDetails = responseData?.details || responseData?.error || `Erreur ${response.status}`;
        console.error('Erreur API complète:', responseData);
        throw new Error(errorDetails);
      }

      setApiResponse('Anime créé avec succès');
      setShowAlert(true);
      
      if (onAnimeUpdated && responseData) {
        onAnimeUpdated(responseData);
      }
      
      setEditedAnime(responseData);
      setIsEditing(true);
    } catch (err: any) {
      // Capture et affichage détaillé de l'erreur
      console.error('Erreur complète:', err);
      
      // Afficher l'erreur complète, y compris les propriétés potentielles comme code ou meta
      const errorMessage = err.message || 'Erreur inconnue lors de la création';
      const detailedError = typeof err === 'object' ? 
        `${errorMessage} (Code: ${err.code || 'inconnu'}) ${JSON.stringify(err.meta || {})}` : 
        errorMessage;
      
      setError(detailedError);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un anime
  const handleDeleteAnime = async () => {
    if (!editedAnime?.id) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
    
    try {
      const response = await fetch(`/api/anime/${editedAnime.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Capturer la réponse brute pour le débogage
      const responseText = await response.text();
      let responseData;
      
      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
        } else {
          responseData = { message: 'Anime supprimé avec succès' };
        }
      } catch (parseError) {
        console.error('Erreur lors du parsing JSON:', parseError);
        responseData = { message: 'Anime supprimé, mais format de réponse non valide' };
      }
      
      setApiResponseData(responseData);
      
      if (!response.ok) {
        const errorDetails = responseData?.details || responseData?.error || `Erreur ${response.status}`;
        throw new Error(errorDetails);
      }

      setApiResponse('Anime supprimé avec succès');
      setShowAlert(true);
      setShowDeleteConfirm(false);
      
      // Notifier le composant parent de la suppression
      if (onAnimeDeleted && editedAnime?.id) {
        onAnimeDeleted(editedAnime.id);
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'anime:', err);
      const errorMessage = err.message || 'Erreur inconnue lors de la suppression';
      const detailedError = typeof err === 'object' ? 
        `${errorMessage} (Code: ${err.code || 'inconnu'}) ${JSON.stringify(err.meta || {})}` : 
        errorMessage;
      
      setError(detailedError);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmptyTemplate || !anime) {
    return <EmptyAnimeCard onAddAnime={handleAddAnime} />;
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
        onDelete={() => setShowDeleteConfirm(true)}
        onFieldChange={handleFieldChange}
        isLoading={isLoading}
      />
      
      <div className="card-body gap-4 p-4">
        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="alert alert-warning shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Êtes-vous sûr de vouloir supprimer définitivement cet anime ?</span>
            </div>
            <div className="flex-none">
              <button className="btn btn-sm btn-error" onClick={handleDeleteAnime} disabled={isLoading}>
                {isLoading ? 'Suppression...' : 'Confirmer'}
              </button>
              <button className="btn btn-sm btn-ghost ml-2" onClick={() => setShowDeleteConfirm(false)} disabled={isLoading}>
                Annuler
              </button>
            </div>
          </div>
        )}

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