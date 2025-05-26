//frontend/src/components/mangAnimeCard/GenericInfoCard.tsx
import React, { useState, useEffect } from 'react';
import GenericCardHeader from './GenericCardHeader';
import GenericEmptyCard from './GenericEmptyCard';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';
import { useGenericApi } from './hooks/useGenericApi';
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
  const api = useGenericApi();
  
  // États locaux simplifiés
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<T | undefined>(item);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // Synchronisation avec les props
  useEffect(() => {
    setEditedItem(item);
    api.resetState();
  }, [item]);

  // Opérations CRUD unifiées
  const handleAdd = async () => {
    api.setLoading(true);
  
    try {
      if (!licenseId) {
        throw new Error("L'ID de licence est obligatoire");
      }
  
      const newItemData = createDefaultItem(licenseId);
      const serviceMethod = type === 'anime' ? searchService.createAnime : searchService.createManga;
      const responseData = await serviceMethod(newItemData);
      
      api.setSuccess(`${type === 'anime' ? 'Anime' : 'Manga'} créé avec succès`, responseData);
      
      if (onUpdate) {
        onUpdate(responseData);
      }
    } catch (error: any) {
      console.error(`Erreur lors de la création du ${type}:`, error);
      
      const errorMessage = error.response?.details || 
                           error.response?.error || 
                           error.message || 
                           'Une erreur inattendue s\'est produite';
      
      api.setError(`Erreur lors de la création: ${errorMessage}`, error.response);
    }
  };

  const handleDelete = async () => {
    if (!editedItem?.id) return;
    
    api.setLoading(true);
    
    try {
      const serviceMethod = type === 'anime' ? searchService.deleteAnime : searchService.deleteManga;
      const responseData = await serviceMethod(editedItem.id);
      
      api.setSuccess(`${type === 'anime' ? 'Anime' : 'Manga'} supprimé avec succès`, responseData);
      setShowDeleteConfirm(false);
      
      if (onDeleted && editedItem?.id) {
        onDeleted(editedItem.id);
      }
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du ${type}:`, error);
      
      const errorMessage = error.response?.details || 
                           error.response?.error || 
                           error.message || 
                           'Erreur inconnue lors de la suppression';
      
      api.setError(`Erreur lors de la suppression: ${errorMessage}`, error);
    }
  };

  const handleSave = async () => {
    if (!editedItem) return;
    
    api.setLoading(true);
    
    try {
      const serviceMethod = type === 'anime' ? searchService.updateAnime : searchService.updateManga;
      const responseData = await serviceMethod(editedItem.id, editedItem);
      
      api.setSuccess(`${type === 'anime' ? 'Anime' : 'Manga'} mis à jour avec succès`, responseData);
      setIsEditing(false);
      
      if (onUpdate) {
        onUpdate(responseData);
      }
      setEditedItem(responseData);
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du ${type}:`, error);
      
      const errorMessage = error.response?.details || 
                           error.response?.error || 
                           error.message || 
                           'Erreur lors de la mise à jour';
      
      api.setError(`Erreur lors de la mise à jour: ${errorMessage}`, error);
    }
  };

  // Handlers simplifiés
  const handleFieldChange = (field: string, value: any) => {
    if (!editedItem) return;
    setEditedItem({ ...editedItem, [field]: value } as T);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItem(item);
    api.resetState();
  };

  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  // Rendu conditionnel pour template vide
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
        isLoading={api.isLoading}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={() => setShowDeleteConfirm(true)}
        onTitleChange={(value) => handleFieldChange('title', value)}
        onSubtitleChange={getSubtitle ? (value) => handleFieldChange(type === 'anime' ? 'studio' : 'publisher', value) : undefined}
        subtitlePlaceholder={subtitlePlaceholder}
      />
      
      <div className="card-body p-4">
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
              <button className="btn btn-sm btn-error" onClick={handleDelete} disabled={api.isLoading}>
                {api.isLoading ? 'Suppression...' : 'Confirmer'}
              </button>
              <button className="btn btn-sm btn-ghost ml-2" onClick={() => setShowDeleteConfirm(false)} disabled={api.isLoading}>
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Système d'alertes unifié */}
        {api.showAlert && api.error && (
          <ErrorAlert message={api.error} onClose={api.closeAlert} />
        )}
        {api.showAlert && api.apiResponse && !api.error && (
          <SuccessAlert message={api.apiResponse} onClose={api.closeAlert} />
        )}
        
        {/* Bouton de débogage */}
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
            response={api.apiResponseData ? JSON.stringify(api.apiResponseData, null, 2) : null}
            error={api.error}
            onClose={handleResponseToggle}
          />
        )}

        {/* Contenu principal */}
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
                <button className="btn btn-success btn-sm btn-outline" onClick={handleAdd} disabled={api.isLoading}>
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