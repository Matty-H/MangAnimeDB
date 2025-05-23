import React, { useState, useEffect } from 'react';
import { MangaWork } from '../../types';
import MangaPartsManager from './MangaPartsManager';
import MangaHeader from './MangaCardHeader';
import MangaInfo from './MangaDisplayInfo';
import MangaEditForm from './MangaEditForm';
import EmptyMangaCard from './EmptyMangaCard';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { searchService } from '../../services';
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';

interface MangaInfoCardProps {
  manga?: MangaWork;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onUpdate?: (updatedManga: MangaWork) => void;
  onAddManga?: () => void;
  onMangaDeleted?: (mangaId: string) => void;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({ 
  manga, 
  licenseId, 
  isEmptyTemplate = false,
  onUpdate,
  onAddManga,
  onMangaDeleted
}) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedManga, setEditedManga] = useState<MangaWork | undefined>(manga);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setEditedManga(manga);
    setApiResponse('');
    setApiResponseData(null);
    setError(null);
  }, [manga]);

  if (isEmptyTemplate || !manga) {
    return <EmptyMangaCard onAddManga={handleAddManga} />;
  }

  const handleFieldChange = (field: keyof MangaWork, value: any) => {
    if (!editedManga) return;
    setEditedManga({ ...editedManga, [field]: value });
  };

  const handleAuthorsChange = (authorsString: string) => {
    if (!editedManga) return;
    const authors = authorsString.split(',').map(a => a.trim()).filter(Boolean);
    setEditedManga({ ...editedManga, authors });
  };

  // Fonction pour gérer l'ajout d'un manga
  async function handleAddManga() {
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    
    try {
      // Création d'un nouveau manga à partir de la licence
      const newMangaData = {
        licenseId: licenseId,
        title: 'Nouveau manga', // Titre par défaut
        authors: [], // Tableau vide d'auteurs
        volumes: 0, // Nombre de volumes à 0 par défaut
        status: 'ONGOING', // Statut par défaut
        startDate: null, // Pas de date de début
        endDate: null, // Pas de date de fin
        publisher: '' // Éditeur vide par défaut
      };
      
      console.log('Données envoyées à l\'API:', newMangaData);
      
      // Utilisation du SearchService au lieu de fetch direct
      const responseData = await searchService.createManga(newMangaData);
      
      setApiResponseData(responseData);
      setApiResponse('Manga ajouté avec succès');
      setShowAlert(true);
      
      // Si le callback externe existe, on l'appelle
      if (onAddManga) onAddManga();
      
      // Si une mise à jour des données est nécessaire, on peut appeler onUpdate avec les données du manga créé
      if (onUpdate) onUpdate(responseData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'ajout du manga');
      setShowAlert(true);
      console.error('Erreur lors de l\'ajout du manga:', err);
    } finally {
      setIsLoading(false);
    }
  }

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

  const handleSaveManga = async () => {
    if (!editedManga) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    
    try {
      const payload = {
        licenseId,
        title: editedManga.title,
        authors: editedManga.authors,
        volumes: editedManga.volumes,
        status: editedManga.status,
        startDate: editedManga.startDate,
        endDate: editedManga.endDate,
        publisher: editedManga.publisher
      };
      
      // Utilisation du SearchService au lieu de fetch direct
      const responseData = await searchService.updateManga(editedManga.id, payload);
      
      setApiResponseData(responseData);
      setApiResponse('Manga mis à jour avec succès');
      setShowAlert(true);
      setIsEditing(false);
      setEditedManga(responseData);
      
      if (onUpdate) onUpdate(responseData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
      setShowAlert(true);
      console.error('Erreur lors de la mise à jour du manga:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedManga(manga);
    setError(null);
    setApiResponseData(null);
  };

  const handleMangaPartsUpdate = (updatedManga: MangaWork) => {
    setEditedManga(updatedManga);
    if (onUpdate) onUpdate(updatedManga);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  // Mise à jour des états lors de nouvelles réponses API ou erreurs
  useEffect(() => {
    if (apiResponse || error) {
      setShowAlert(true);
    }
  }, [apiResponse, error]);

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <MangaHeader
        title={editedManga?.title || ''}
        publisher={editedManga?.publisher || ''}
        isEditing={isEditing}
        isLoading={isLoading}
        onEditClick={() => setIsEditing(true)} 
        onSaveClick={handleSaveManga}
        onCancelClick={handleCancelEdit}
        onDeleteClick={() => setShowDeleteConfirm(true)}
        onTitleChange={(value) => handleFieldChange('title', value)}
        onPublisherChange={(value) => handleFieldChange('publisher', value)}
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
            manga={editedManga as MangaWork}
            onFieldChange={handleFieldChange}
            onAuthorsChange={handleAuthorsChange}
          />
        ) : (
          <>
            <MangaInfo manga={manga} />
            <MangaPartsManager 
              manga={manga}
              licenseId={licenseId}
              onUpdate={handleMangaPartsUpdate}
              setParentError={(err) => {
                setError(err);
                setShowAlert(true);
              }}
              setParentApiResponse={(res) => {
                setApiResponse(res);
                setShowAlert(true);
              }}
            />
            {isEditMode && (
              <div className="text-right">
                <button className="btn btn-success btn-sm btn-outline" onClick={handleAddManga}>
                  <Plus size={16} className="mr-1" />
                  Ajouter un autre manga
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