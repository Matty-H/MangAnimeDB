import React, { useState, useEffect } from 'react';
import EmptyMangaCard from './EmptyMangaCard';
import MangaHeader from './MangaCardHeader';
import MangaEditForm from './MangaEditForm';
import MangaDisplayInfo from './MangaDisplayInfo';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';
import { searchService } from '../../services';

interface MangaInfoCardProps {
  manga?: any;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onMangaUpdated?: (updatedManga: any) => void;
  onMangaDeleted?: (mangaId: string) => void;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({
  manga,
  licenseId,
  isEmptyTemplate = false,
  onMangaUpdated,
  onMangaDeleted
}) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedManga, setEditedManga] = useState(manga);
  const [apiResponse, setApiResponse] = useState('');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setEditedManga(manga);
    setApiResponse('');
    setApiResponseData(null);
    setError(null);
  }, [manga]);

  // Mise à jour des états lors de nouvelles réponses API ou erreurs
  useEffect(() => {
    if (apiResponse || error) {
      setShowAlert(true);
    }
  }, [apiResponse, error]);

  // Fonction pour ajouter un nouveau manga
  const handleAddManga = async () => {
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');

    try {
      // Assurons-nous que licenseId est bien défini
      if (!licenseId) {
        throw new Error("L'ID de licence est obligatoire");
      }

      // Création d'un manga avec tous les champs obligatoires
      const newManga = {
        licenseId: licenseId,
        title: "Nouveau manga",
        publisher: "Éditeur à déterminer", // Champ obligatoire
        status: "ONGOING", // Statut par défaut
        genre: "ACTION" // Genre par défaut
      };

      const responseData = await searchService.createManga(newManga);
      setApiResponseData(responseData);
      setApiResponse('Manga créé avec succès');

      // Recharger les données ou mettre à jour l'état local
      // await loadMangaData(); // ou autre logique de rafraîchissement

    } catch (error: any) {
      console.error('Erreur lors de la création du manga:', error);
      
      // Gestion des erreurs plus précise
      if (error.response) {
        // Erreur HTTP avec réponse du serveur
        const errorDetails = error.response.details || error.response.error || `Erreur ${error.status}`;
        setError(`Erreur API: ${errorDetails}`);
        setApiResponseData(error.response);
      } else if (error.message) {
        // Erreur JavaScript standard
        setError(error.message);
      } else {
        // Erreur inconnue
        setError('Une erreur inattendue s\'est produite');
      }
      
      setApiResponse('Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un manga
  const handleDeleteManga = async () => {
    if (!editedManga?.id) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
    
    try {
      // Utilisation du SearchService au lieu de fetch direct
      const responseData = await searchService.deleteManga(editedManga.id);
      
      setApiResponseData(responseData);
      setApiResponse('Manga supprimé avec succès');
      setShowAlert(true);
      setShowDeleteConfirm(false);
      
      // Notifier le composant parent de la suppression
      if (onMangaDeleted && editedManga?.id) {
        onMangaDeleted(editedManga.id);
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression du manga:', err);
      
      // Le SearchService encapsule déjà la gestion des erreurs HTTP
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

  if (isEmptyTemplate || !manga) {
    return <EmptyMangaCard onAddManga={handleAddManga} />;
  }

  const handleFieldChange = (field: string, value: any) => {
    if (!editedManga) return;
    setEditedManga({ ...editedManga, [field]: value });
  };

  const saveMangaChanges = async () => {
    if (!editedManga) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
    
    try {
      // Utilisation du SearchService au lieu de fetch direct
      const responseData = await searchService.updateManga(editedManga.id, editedManga);
      
      setApiResponseData(responseData);
      setApiResponse('Manga mis à jour avec succès');
      setShowAlert(true);
      setIsEditing(false);
      
      if (onMangaUpdated) {
        onMangaUpdated(responseData);
      }
      setEditedManga(responseData);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du manga:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolumesUpdated = (updatedVolumes: any) => {
    if (onMangaUpdated && manga) {
      const updatedManga = {
        ...manga,
        volumes: updatedVolumes
      };
      onMangaUpdated(updatedManga);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedManga(manga);
    setError(null);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  // Fonctions pour MangaHeader
  const handleTitleChange = (value: string) => {
    handleFieldChange('title', value);
  };

  const handlePublisherChange = (value: string) => {
    handleFieldChange('publisher', value);
  };

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <MangaHeader
        title={editedManga?.title || ''}
        publisher={editedManga?.publisher || ''}
        isEditing={isEditing}
        isLoading={isLoading}
        onEditClick={() => setIsEditing(true)}
        onSaveClick={saveMangaChanges}
        onCancelClick={handleCancel}
        onDeleteClick={() => setShowDeleteConfirm(true)}
        onTitleChange={handleTitleChange}
        onPublisherChange={handlePublisherChange}
      />
      
      <div className="card-body gap-4 p-4">
        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="alert alert-warning shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Êtes-vous sûr de vouloir supprimer définitivement ce manga ?</span>
            </div>
            <div className="flex-none">
              <button className="btn btn-sm btn-error" onClick={handleDeleteManga} disabled={isLoading}>
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

        {isEditMode && (
          <button 
            className="btn btn-error btn-sm btn-outline" 
            onClick={handleResponseToggle}
          >
            {showResponse ? (
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

        {/* Affichage du débogueur - indépendant des alertes */}
        {showResponse && (
          <ApiResponseDisplay
            response={apiResponseData ? JSON.stringify(apiResponseData, null, 2) : null}
            error={error}
            onClose={handleResponseToggle}
          />
        )}

        {isEditing ? (
          <MangaEditForm
            editedManga={editedManga}
            onFieldChange={handleFieldChange}
          />
        ) : (
          <>
            <MangaDisplayInfo
              manga={manga}
              onVolumesUpdated={handleVolumesUpdated}
            />
            {isEditMode && (
              <div className="text-right">
                <button className="btn btn-success btn-sm btn-outline" onClick={handleAddManga}>
                  <Plus size={16} className="mr-1" />
                  Ajouter un manga
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MangaInfoCard;