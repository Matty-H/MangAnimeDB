//frontend/src/components/mangAnimeCard/GenericInfoCard.tsx
import React, { useState, useEffect } from 'react';
import GenericCardHeader from './GenericCardHeader';
import GenericEmptyCard from './GenericEmptyCard';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';
import { searchService } from '../../services';

interface GenericInfoCardProps<T> {
  type: 'anime' | 'manga';
  item?: T;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onUpdate?: (updatedItem: T) => void;
  onDeleted?: (itemId: string) => void;
  getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string;
  createDefaultItem: (licenseId: string) => any;
  DisplayComponent: React.ComponentType<{ item: T; onUpdate?: (item: T) => void }>;
  EditComponent: React.ComponentType<{ item: T; onFieldChange: (field: string, value: any) => void }>;
  subtitlePlaceholder?: string;
}

function GenericInfoCard<T extends { id: string }>({
  type,
  item,
  licenseId,
  isEmptyTemplate = false,
  onUpdate,
  onDeleted,
  getTitle,
  getSubtitle,
  createDefaultItem,
  DisplayComponent,
  EditComponent,
  subtitlePlaceholder
}: GenericInfoCardProps<T>) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<T | undefined>(item);
  const [apiResponse, setApiResponse] = useState('');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setEditedItem(item);
    setApiResponse('');
    setApiResponseData(null);
    setError(null);
  }, [item]);

  useEffect(() => {
    if (apiResponse || error) {
      setShowAlert(true);
    }
  }, [apiResponse, error]);

  const handleAdd = async () => {
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
  
    try {
      if (!licenseId) {
        throw new Error("L'ID de licence est obligatoire");
      }
  
      const newItemData = createDefaultItem(licenseId);
      
      const serviceMethod = type === 'anime' ? searchService.createAnime : searchService.createManga;
      const responseData = await serviceMethod(newItemData);
      
      setApiResponseData(responseData);
      setApiResponse(`${type === 'anime' ? 'Anime' : 'Manga'} créé avec succès`);
      
      if (onUpdate) {
        onUpdate(responseData);
      }
    } catch (error: any) {
      console.error(`Erreur lors de la création du ${type}:`, error);
      
      if (error.response) {
        const errorDetails = error.response.details || error.response.error || `Erreur ${error.status}`;
        setError(`Erreur API: ${errorDetails}`);
        setApiResponseData(error.response);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
      
      setApiResponse('Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editedItem?.id) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
    
    try {
      const serviceMethod = type === 'anime' ? searchService.deleteAnime : searchService.deleteManga;
      const responseData = await serviceMethod(editedItem.id);
      
      setApiResponseData(responseData);
      setApiResponse(`${type === 'anime' ? 'Anime' : 'Manga'} supprimé avec succès`);
      setShowAlert(true);
      setShowDeleteConfirm(false);
      
      if (onDeleted && editedItem?.id) {
        onDeleted(editedItem.id);
      }
    } catch (err: any) {
      console.error(`Erreur lors de la suppression du ${type}:`, err);
      
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

  const handleSave = async () => {
    if (!editedItem) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponseData(null);
    setApiResponse('');
    
    try {
      const serviceMethod = type === 'anime' ? searchService.updateAnime : searchService.updateManga;
      const responseData = await serviceMethod(editedItem.id, editedItem);
      
      setApiResponseData(responseData);
      setApiResponse(`${type === 'anime' ? 'Anime' : 'Manga'} mis à jour avec succès`);
      setShowAlert(true);
      setIsEditing(false);
      
      if (onUpdate) {
        onUpdate(responseData);
      }
      setEditedItem(responseData);
    } catch (err: any) {
      console.error(`Erreur lors de la mise à jour du ${type}:`, err);
      setError(err.message || 'Erreur lors de la mise à jour');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!editedItem) return;
    setEditedItem({ ...editedItem, [field]: value } as T);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItem(item);
    setError(null);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  if (isEmptyTemplate || !item) {
    return <GenericEmptyCard type={type} onAdd={handleAdd} />;
  }

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <GenericCardHeader
        type={type}
        title={editedItem ? getTitle(editedItem) : ''}
        subtitle={getSubtitle && editedItem ? getSubtitle(editedItem) : undefined}
        isEditing={isEditing}
        isLoading={isLoading}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={() => setShowDeleteConfirm(true)}
        onTitleChange={(value) => handleFieldChange('title', value)}
        onSubtitleChange={getSubtitle ? (value) => handleFieldChange(type === 'anime' ? 'studio' : 'publisher', value) : undefined}
        subtitlePlaceholder={subtitlePlaceholder}
      />
      
      <div className="card-body gap-4 p-4">
        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="alert alert-warning shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Êtes-vous sûr de vouloir supprimer définitivement ce {type} ?</span>
            </div>
            <div className="flex-none">
              <button className="btn btn-sm btn-error" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? 'Suppression...' : 'Confirmer'}
              </button>
              <button className="btn btn-sm btn-ghost ml-2" onClick={() => setShowDeleteConfirm(false)} disabled={isLoading}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Affichage des alertes */}
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

        {/* Affichage du débogueur */}
        {showResponse && (
          <ApiResponseDisplay
            response={apiResponseData ? JSON.stringify(apiResponseData, null, 2) : null}
            error={error}
            onClose={handleResponseToggle}
          />
        )}

        {isEditing ? (
          <EditComponent
            item={editedItem as T}
            onFieldChange={handleFieldChange}
          />
        ) : (
          <>
            <DisplayComponent
              item={item}
              onUpdate={onUpdate}
            />
            {isEditMode && (
              <div className="text-right">
                <button className="btn btn-success btn-sm btn-outline" onClick={handleAdd}>
                  <Plus size={16} className="mr-1" />
                  Ajouter un autre {type}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GenericInfoCard;