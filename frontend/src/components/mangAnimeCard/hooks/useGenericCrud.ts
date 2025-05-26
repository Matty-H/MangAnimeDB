//frontend/src/components/mangAnimeCard/hooks/useGenericCrud.ts
import { useState, useCallback } from 'react';
import { useGenericApi } from './useGenericApi';

export interface CrudOperations<T> {
  create: (item: Partial<T>) => Promise<T>;
  update: (id: string, item: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<T>;
}

export const useGenericCrud = <T extends { id: string }>(
  operations: CrudOperations<T>,
  itemName: string,
  onSuccess?: (items: T[]) => void
) => {
  const [items, setItems] = useState<T[]>([]);
  const api = useGenericApi();

  const executeOperation = useCallback(async <R>(
    operation: () => Promise<R>,
    successMessage: string,
    onOperationSuccess?: (result: R) => void
  ) => {
    api.setLoading(true);
    api.resetState();

    try {
      const result = await operation();
      api.setSuccess(successMessage, result);
      onOperationSuccess?.(result);
      return result;
    } catch (err: any) {
      console.error(`Erreur ${itemName}:`, err);
      const errorMessage = err.response?.details || err.response?.error || err.message || 'Erreur inconnue';
      api.setError(`Erreur API: ${errorMessage}`, err.response);
      throw err;
    }
  }, [api, itemName]);

  const createItem = useCallback(async (newItem: Partial<T>) => {
    return executeOperation(
      () => operations.create(newItem),
      `${itemName} créé(e) avec succès`,
      (result) => {
        const updatedItems = [...items, result];
        setItems(updatedItems);
        onSuccess?.(updatedItems);
      }
    );
  }, [executeOperation, operations.create, items, onSuccess, itemName]);

  const updateItem = useCallback(async (id: string, updatedItem: Partial<T>) => {
    return executeOperation(
      () => operations.update(id, updatedItem),
      `${itemName} mis(e) à jour avec succès`,
      (result) => {
        const updatedItems = items.map(item => item.id === id ? result : item);
        setItems(updatedItems);
        onSuccess?.(updatedItems);
      }
    );
  }, [executeOperation, operations.update, items, onSuccess, itemName]);

  const deleteItem = useCallback(async (id: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ce/cette ${itemName} ?`)) return;
    
    return executeOperation(
      () => operations.delete(id),
      `${itemName} supprimé(e) avec succès`,
      () => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        onSuccess?.(updatedItems);
      }
    );
  }, [executeOperation, operations.delete, items, onSuccess, itemName]);

  return {
    items,
    setItems,
    createItem,
    updateItem,
    deleteItem,
    ...api,
  };
};