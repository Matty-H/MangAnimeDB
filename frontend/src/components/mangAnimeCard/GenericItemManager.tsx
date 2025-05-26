//frontend/src/components/mangAnimeCard/GenericItemManager.tsx
import React, { useState, useEffect } from 'react';
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';
import GenericForm from './GenericForm';
import GenericList from './GenericList';

// Interface de base pour tous les items gérés
export interface BaseItem {
  id: string;
  [key: string]: any;
}

// Configuration pour définir comment afficher et gérer chaque type d'item
export interface ItemConfig<T extends BaseItem> {
  // Labels et textes
  itemName: string; // "saison", "partie"
  itemNamePlural: string; // "saisons", "parties"
  addButtonText: string; // "Ajouter une saison", "Ajouter une partie/arc"
  
  // Fonctions de service API
  createItem: (item: Partial<T>) => Promise<T>;
  updateItem: (id: string, item: Partial<T>) => Promise<T>;
  deleteItem: (id: string) => Promise<T>;
  
  // Configuration des champs pour le formulaire
  formFields: FormFieldConfig[];
  
  // Fonction pour créer un nouvel item par défaut
  createDefaultItem: () => Partial<T>;
  
  // Fonction pour afficher l'item dans la liste
  renderListItem: (item: T) => {
    title: string;
    subtitle: string;
    badges: Array<{ type: string; value: any; label?: string }>;
  };
  
  // Validation personnalisée
  validateItem?: (item: Partial<T>) => string | null;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required?: boolean;
  options?: Array<{ value: any; label: string }>;
  placeholder?: string;
  colSpan?: 1 | 2;
  processValue?: (value: any) => any; // Fonction pour traiter la valeur avant sauvegarde
}

interface GenericItemManagerProps<T extends BaseItem> {
  parentId: string; // ID du parent (anime, manga)
  items: T[];
  config: ItemConfig<T>;
  onItemsUpdated?: (items: T[]) => void;
  showDebugger?: boolean;
}

function GenericItemManager<T extends BaseItem>({
  parentId,
  items,
  config,
  onItemsUpdated,
  showDebugger = false
}: GenericItemManagerProps<T>) {
  // États pour la gestion des items
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<T[]>(items || []);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour le système d'alerte et de débogage
  const { isEditMode } = useEditMode();
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiResponseData, setApiResponseData] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  
  // Synchroniser les items avec les props
  useEffect(() => {
    setEditedItems(items || []);
  }, [items]);

  // Effet pour afficher les alertes lors de nouvelles réponses API ou erreurs
  useEffect(() => {
    if (apiResponse || error) {
      setShowAlert(true);
    }
  }, [apiResponse, error]);

  // Fonction pour sauvegarder les modifications d'un item
  const saveItemChanges = async (updatedItem: Partial<T>) => {
    if (!updatedItem.id) return;
    
    // Validation personnalisée
    if (config.validateItem) {
      const validationError = config.validateItem(updatedItem);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    setApiResponse('');
    setApiResponseData(null);
    
    try {
      const returnedItem = await config.updateItem(updatedItem.id, updatedItem);
      
      // Mettre à jour les données de réponse API
      setApiResponseData(returnedItem);
      setApiResponse(`${config.itemName} mise à jour avec succès`);
      
      // Mettre à jour l'état local des items
      const updatedItems = editedItems.map(item => 
        item.id === updatedItem.id ? returnedItem : item
      );
      
      setEditedItems(updatedItems);
      setEditingItemId(null);
      
      // Notifier le parent des changements
      if (onItemsUpdated) {
        onItemsUpdated(updatedItems);
      }
      
    } catch (err: any) {
      console.error(`Erreur lors de la mise à jour de ${config.itemName}:`, err);
      setError(err.message || `Erreur lors de la mise à jour de ${config.itemName}`);
      setApiResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter un nouvel item
  const addNewItem = async (newItem: Partial<T>) => {
    // Validation personnalisée
    if (config.validateItem) {
      const validationError = config.validateItem(newItem);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    setApiResponse('');
    setApiResponseData(null);
    
    try {
      const createdItem = await config.createItem(newItem);
      
      // Mettre à jour les données de réponse API
      setApiResponseData(createdItem);
      setApiResponse(`${config.itemName} créée avec succès`);
      
      // Mettre à jour l'état local des items
      const updatedItems = [...editedItems, createdItem];
      setEditedItems(updatedItems);
      
      // Réinitialiser le formulaire d'ajout
      setIsAddingItem(false);
      
      // Notifier le parent des changements
      if (onItemsUpdated) {
        onItemsUpdated(updatedItems);
      }
      
    } catch (err: any) {
      console.error(`Erreur lors de l'ajout de ${config.itemName}:`, err);
      setError(err.message || `Erreur lors de l'ajout de ${config.itemName}`);
      setApiResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un item
  const deleteItem = async (itemId: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cette ${config.itemName} ?`)) return;
    
    setIsLoading(true);
    setError(null);
    setApiResponse('');
    setApiResponseData(null);
    
    try {
      const deletedItem = await config.deleteItem(itemId);
      
      // Mettre à jour les données de réponse API
      setApiResponseData(deletedItem);
      setApiResponse(`${config.itemName} supprimée avec succès`);
      
      // Mettre à jour l'état local des items
      const updatedItems = editedItems.filter(item => item.id !== itemId);
      setEditedItems(updatedItems);
      
      // Notifier le parent des changements
      if (onItemsUpdated) {
        onItemsUpdated(updatedItems);
      }
      
    } catch (err: any) {
      console.error(`Erreur lors de la suppression de ${config.itemName}:`, err);
      setError(err.message || `Erreur lors de la suppression de ${config.itemName}`);
      setApiResponseData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleCancelAdd = () => {
    setIsAddingItem(false);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  return (
    <>
      {showAlert && error && (
        <ErrorAlert message={error} onClose={handleAlertClose} />
      )}
      
      {showAlert && apiResponse && !error && (
        <SuccessAlert message={apiResponse} onClose={handleAlertClose} />
      )}
      
      <div className="flex justify-between items-center">
        {(editedItems.length > 0 || isAddingItem || editingItemId) && (
          <div className="text-sm font-medium">Détails des {config.itemNamePlural}</div>
        )}
        {isEditMode && (
          <button 
            className="btn btn-success btn-xs btn-outline" 
            onClick={() => setIsAddingItem(true)}
            disabled={isAddingItem}
          >
            <Plus size={14} /> {config.addButtonText}
          </button>
        )}
      </div>

      {isEditMode && showDebugger && (
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
      
      {/* Formulaire d'ajout d'item */}
      {isAddingItem && (
        <GenericForm
          config={config}
          parentId={parentId}
          defaultItem={config.createDefaultItem()}
          isEditing={false}
          isLoading={isLoading}
          onSave={addNewItem}
          onCancel={handleCancelAdd}
        />
      )}
      
      {/* Formulaire d'édition d'item */}
      {editingItemId && (
        <GenericForm
          config={config}
          parentId={parentId}
          defaultItem={editedItems.find(item => item.id === editingItemId)}
          isEditing={true}
          isLoading={isLoading}
          onSave={saveItemChanges}
          onCancel={handleCancelEdit}
        />
      )}
      
      {/* Liste des items */}
      <GenericList
        items={editedItems}
        config={config}
        onEdit={handleEditItem}
        onDelete={deleteItem}
        isLoading={isLoading}
      />
    </>
  );
}

export default GenericItemManager;