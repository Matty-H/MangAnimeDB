//frontend/src/components/cardManga/MangaPartsManager.tsx
import React, { useState, useEffect } from 'react';
import { MangaWork, WorkStatus, MangaPart } from '../../types';
import { Plus, Pencil, Check, X, Loader, Trash } from 'lucide-react';
import Badge from '../ui/badge';
import { useEditMode } from '../ui/EditModeContext';

interface MangaPartsManagerProps {
  manga: MangaWork;
  licenseId: string;
  onUpdate: (updatedManga: MangaWork) => void;
  setParentError: (error: string | null) => void;
  setParentApiResponse: (message: string) => void;
}

const MangaPartsManager: React.FC<MangaPartsManagerProps> = ({
  manga,
  licenseId,
  onUpdate,
  setParentError,
  setParentApiResponse
}) => {
  // États pour l'édition des parties
  const { isEditMode } = useEditMode();
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editedParts, setEditedParts] = useState(manga.parts || []);
  const [isAddingPart, setIsAddingPart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPart, setNewPart] = useState<Partial<MangaPart>>({
    title: '',
    partNumber: 1,
    startVolume: 1,
    endVolume: 1,
    status: WorkStatus.ONGOING
  });

  // Mettre à jour les parties lorsque le manga change
  useEffect(() => {
    setEditedParts(manga.parts || []);
  }, [manga]);

  const handlePartFieldChange = (partId: string, field: string, value: any) => {
    setEditedParts(prevParts => 
      prevParts.map(part => 
        part.id === partId 
          ? { ...part, [field]: value } 
          : part
      )
    );
  };
  
  const handleNewPartFieldChange = (field: string, value: any) => {
    setNewPart(prev => ({ ...prev, [field]: value }));
  };

  // Fonction pour sauvegarder les modifications d'une partie
  const handleSavePart = async (partId: string) => {
    const partToUpdate = editedParts.find(part => part.id === partId);
    if (!partToUpdate) return;
    
    setIsLoading(true);
    setParentError(null);
    
    try {
      const payload = {
        mangaId: manga.id,
        licenseId,
        title: partToUpdate.title,
        partNumber: partToUpdate.partNumber,
        volumes: partToUpdate.volumes,
        startVolume: partToUpdate.startVolume,
        endVolume: partToUpdate.endVolume,
        status: partToUpdate.status
      };
      
      const response = await fetch(`/api/manga/part/${partId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }
      
      const updatedPart = await response.json();
      
      // Mettre à jour la liste des parties
      const updatedParts = editedParts.map(part => 
        part.id === partId ? updatedPart : part
      );
      
      setEditedParts(updatedParts);
      setEditingPartId(null);
      setParentApiResponse('Partie mise à jour avec succès');
      
      // Mise à jour du manga parent
      onUpdate({
        ...manga,
        parts: updatedParts
      });
      
    } catch (err) {
      setParentError(err.message || 'Une erreur est survenue lors de la mise à jour');
      console.error('Erreur lors de la mise à jour de la partie:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour ajouter une nouvelle partie
  const handleAddPart = async () => {
    setIsLoading(true);
    setParentError(null);
    
    try {
      // Calculer le nombre de volumes de la nouvelle partie
      const volumes = (newPart.endVolume || 1) - (newPart.startVolume || 1) + 1;
      
      const payload = {
        mangaId: manga.id,
        licenseId,
        title: newPart.title,
        partNumber: newPart.partNumber || 1,
        startVolume: newPart.startVolume || 1,
        endVolume: newPart.endVolume || 1,
        volumes,
        status: newPart.status || WorkStatus.ONGOING
      };
      
      const response = await fetch('/api/manga/part', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }
      
      const createdPart = await response.json();
      
      // Ajouter la nouvelle partie à la liste
      const updatedParts = [...editedParts, createdPart];
      setEditedParts(updatedParts);
      
      // Réinitialiser le formulaire d'ajout
      setIsAddingPart(false);
      setNewPart({
        title: '',
        partNumber: 1,
        startVolume: 1,
        endVolume: 1,
        status: WorkStatus.ONGOING
      });
      
      setParentApiResponse('Nouvelle partie ajoutée avec succès');
      
      // Mise à jour du manga parent
      onUpdate({
        ...manga,
        parts: updatedParts
      });
      
    } catch (err) {
      setParentError(err.message || 'Une erreur est survenue lors de l\'ajout');
      console.error('Erreur lors de l\'ajout de la partie:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour supprimer une partie
  const handleDeletePart = async (partId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette partie?')) {
      return;
    }
    
    setIsLoading(true);
    setParentError(null);
    
    try {
      const response = await fetch(`/api/manga/part/${partId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }
      
      // Supprimer la partie de la liste
      const updatedParts = editedParts.filter(part => part.id !== partId);
      setEditedParts(updatedParts);
      
      setParentApiResponse('Partie supprimée avec succès');
      
      // Mise à jour du manga parent
      onUpdate({
        ...manga,
        parts: updatedParts
      });
      
    } catch (err) {
      setParentError(err.message || 'Une erreur est survenue lors de la suppression');
      console.error('Erreur lors de la suppression de la partie:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler l'édition d'une partie
  const handleCancelEditPart = () => {
    setEditingPartId(null);
    setEditedParts(manga.parts || []); // Restaurer les valeurs originales
    setParentError(null);
  };
  
  // Annuler l'ajout d'une partie
  const handleCancelAddPart = () => {
    setIsAddingPart(false);
    setNewPart({
      title: '',
      partNumber: 1,
      startVolume: 1,
      endVolume: 1,
      status: WorkStatus.ONGOING
    });
    setParentError(null);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">Parties</div>
        {isEditMode && (
          <button 
            className="btn btn-success btn-xs btn-outline"
            onClick={() => setIsAddingPart(true)}
          >
            <Plus size={14} /> Ajouter
          </button>
        )}
      </div>
      
      {/* Formulaire d'ajout de partie */}
      {isAddingPart && (
        <div className="bg-base-200 rounded-lg p-3 mb-3 border border-base-300">
          <div className="form-control mb-2">
            <label className="label py-1">
              <span className="label-text text-xs">Titre de la partie</span>
            </label>
            <input
              type="text"
              className="input input-sm input-bordered"
              value={newPart.title || ''}
              onChange={(e) => handleNewPartFieldChange('title', e.target.value)}
              placeholder="Exemple: Arc Skypiea"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs">Numéro</span>
              </label>
              <input
                type="number"
                className="input input-sm input-bordered"
                value={newPart.partNumber || 1}
                onChange={(e) => handleNewPartFieldChange('partNumber', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs">Statut</span>
              </label>
              <select
                className="select select-sm select-bordered"
                value={newPart.status || WorkStatus.ONGOING}
                onChange={(e) => handleNewPartFieldChange('status', e.target.value)}
              >
                {Object.values(WorkStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs">Tome début</span>
              </label>
              <input
                type="number"
                className="input input-sm input-bordered"
                value={newPart.startVolume || 1}
                onChange={(e) => handleNewPartFieldChange('startVolume', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs">Tome fin</span>
              </label>
              <input
                type="number"
                className="input input-sm input-bordered"
                value={newPart.endVolume || 1}
                onChange={(e) => handleNewPartFieldChange('endVolume', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              className="btn btn-sm btn-outline"
              onClick={handleCancelAddPart}
            >
              <X size={16} /> Annuler
            </button>
            <button 
              className="btn btn-sm btn-primary"
              onClick={handleAddPart}
              disabled={isLoading || !newPart.title}
            >
              {isLoading ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />} 
              Ajouter
            </button>
          </div>
        </div>
      )}
      
      {/* Liste des parties */}
      {editedParts.length > 0 ? (
        <div className="rounded-lg border border-base-300 overflow-hidden">
          {editedParts.map((part, index) => (
            <div
              key={part.id}
              className={`p-3 flex items-center justify-between gap-4 ${
                index < editedParts.length - 1 ? 'border-b border-base-300 border-dashed' : ''
              }`}
            >
             {editingPartId === part.id ? (
              <>
                <div className="flex flex-col gap-1 grow">
                  <div className="flex flex-col">
                    <label htmlFor={`title-${part.id}`} className="text-xs">Titre</label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`title-${part.id}`}
                        className="input input-sm input-bordered w-full max-w-xs"
                        value={part.title}
                        onChange={(e) => handlePartFieldChange(part.id, 'title', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-2">
                    <div className="flex flex-col">
                      <label htmlFor={`startVolume-${part.id}`} className="text-xs">Début</label>
                      <input
                        id={`startVolume-${part.id}`}
                        type="number"
                        className="input input-sm input-bordered w-24"
                        value={part.startVolume}
                        onChange={(e) => handlePartFieldChange(part.id, 'startVolume', parseInt(e.target.value))}
                        placeholder="Début"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor={`endVolume-${part.id}`} className="text-xs">Fin</label>
                      <input
                        id={`endVolume-${part.id}`}
                        type="number"
                        className="input input-sm input-bordered w-24"
                        value={part.endVolume}
                        onChange={(e) => handlePartFieldChange(part.id, 'endVolume', parseInt(e.target.value))}
                        placeholder="Fin"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor={`status-${part.id}`} className="text-xs">Statut</label>
                      <select
                        id={`status-${part.id}`}
                        className="select select-sm select-bordered"
                        value={part.status}
                        onChange={(e) => handlePartFieldChange(part.id, 'status', e.target.value)}
                      >
                        {Object.values(WorkStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleSavePart(part.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button 
                    className="btn btn-sm btn-outline" 
                    onClick={handleCancelEditPart}
                    disabled={isLoading}
                  >
                    <X size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="font-medium">{part.title}</div>
                  <div className="text-xs opacity-60">
                    Tomes {part.startVolume}-{part.endVolume} ({part.volumes} tomes)
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge contentType="status" value={part.status} size="sm" />
                  {isEditMode && (
                    <>
                    <button
                      className="btn btn-success btn-outline btn-sm"
                      onClick={() => setEditingPartId(part.id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline text-error"
                      onClick={() => handleDeletePart(part.id)}
                    >
                      <Trash size={16} />
                    </button>
                    </>
                  )}
                </div>
              </>
            )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 text-gray-500 bg-base-200 rounded-lg border border-dashed border-base-300">
          Aucune partie ajoutée pour ce manga
        </div>
      )}
    </div>
  );
};

export default MangaPartsManager;