import React, { useState, useEffect } from 'react';
import { ChevronsLeftRightEllipsis, Plus } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';
import ApiResponseDisplay from '../ui/ApiResponseDisplay';
import { ErrorAlert } from '../ui/ErrorAlert';
import { SuccessAlert } from '../ui/SuccessAlert';
import GenericForm from './GenericForm';
import GenericList from './GenericList';
import { useGenericCrud, CrudOperations } from './hooks/useGenericCrud';

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
  // États pour l'interface utilisateur
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  
  const { isEditMode } = useEditMode();
  
  // Configuration des opérations CRUD
  const crudOperations: CrudOperations<T> = {
    create: config.createItem,
    update: config.updateItem,
    delete: config.deleteItem,
  };
  
  // Utilisation du hook CRUD unifié
  const crud = useGenericCrud<T>(
    crudOperations,
    config.itemName,
    onItemsUpdated
  );
  
  // Synchroniser les items avec les props
  useEffect(() => {
    if (items && items.length > 0) {
      crud.setItems(items);
    }
  }, [items]);

  // Fonction pour sauvegarder les modifications d'un item
  const saveItemChanges = async (updatedItem: Partial<T>) => {
    if (!updatedItem.id) return;
    
    // Validation personnalisée
    if (config.validateItem) {
      const validationError = config.validateItem(updatedItem);
      if (validationError) {
        crud.setError(validationError);
        return;
      }
    }
    
    try {
      await crud.updateItem(updatedItem.id, updatedItem);
      setEditingItemId(null);
    } catch (err) {
      // L'erreur est déjà gérée par useGenericCrud
    }
  };

  // Fonction pour ajouter un nouvel item
  const addNewItem = async (newItem: Partial<T>) => {
    // Validation personnalisée
    if (config.validateItem) {
      const validationError = config.validateItem(newItem);
      if (validationError) {
        crud.setError(validationError);
        return;
      }
    }
    
    try {
      await crud.createItem(newItem);
      setIsAddingItem(false);
    } catch (err) {
      // L'erreur est déjà gérée par useGenericCrud
    }
  };

  // Fonction pour supprimer un item
  const deleteItem = async (itemId: string) => {
    try {
      await crud.deleteItem(itemId);
    } catch (err) {
      // L'erreur est déjà gérée par useGenericCrud
    }
  };

  // Handlers pour l'interface utilisateur
  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleCancelAdd = () => {
    setIsAddingItem(false);
  };

  const handleResponseToggle = () => {
    setShowResponse(!showResponse);
  };

  return (
    <>
      {/* Alertes de succès et d'erreur */}
      {crud.showAlert && crud.error && (
        <ErrorAlert message={crud.error} onClose={crud.closeAlert} />
      )}
      
      {crud.showAlert && crud.apiResponse && !crud.error && (
        <SuccessAlert message={crud.apiResponse} onClose={crud.closeAlert} />
      )}
      
      {/* En-tête avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        {(crud.items.length > 0 || isAddingItem || editingItemId) && (
          <div className="text-sm font-medium">Détails des {config.itemNamePlural}</div>
        )}
        {isEditMode && (
          <button 
            className="btn btn-success btn-xs btn-outline" 
            onClick={() => setIsAddingItem(true)}
            disabled={isAddingItem || crud.isLoading}
          >
            <Plus size={14} /> {config.addButtonText}
          </button>
        )}
      </div>

      {/* Bouton de débogage */}
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
          response={crud.apiResponseData ? JSON.stringify(crud.apiResponseData, null, 2) : null}
          error={crud.error}
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
          isLoading={crud.isLoading}
          onSave={addNewItem}
          onCancel={handleCancelAdd}
        />
      )}
      
      {/* Formulaire d'édition d'item */}
      {editingItemId && (
        <GenericForm
          config={config}
          parentId={parentId}
          defaultItem={crud.items.find(item => item.id === editingItemId)}
          isEditing={true}
          isLoading={crud.isLoading}
          onSave={saveItemChanges}
          onCancel={handleCancelEdit}
        />
      )}
      
      {/* Liste des items */}
      <GenericList
        items={crud.items}
        config={config}
        onEdit={handleEditItem}
        onDelete={deleteItem}
        isLoading={crud.isLoading}
      />
    </>
  );
}

export default GenericItemManager;