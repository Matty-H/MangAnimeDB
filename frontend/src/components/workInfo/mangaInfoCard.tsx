import React, { useState, useEffect } from 'react';
import { MangaWork, WorkStatus, MangaPart } from '../../types';
import { BookOpen, Calendar, BookmarkPlus, Info, Plus, Pencil, Check, X, Loader, Trash } from 'lucide-react';
import Badge from '../ui/badge';

interface MangaInfoCardProps {
  manga?: MangaWork;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onUpdate?: (updatedManga: MangaWork) => void;
  onAddManga?: () => void;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({ 
  manga, 
  licenseId, 
  isEmptyTemplate = false,
  onUpdate,
  onAddManga
}) => {
  // État pour l'édition principale
  const [isEditing, setIsEditing] = useState(false);
  const [editedManga, setEditedManga] = useState<MangaWork | undefined>(manga);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour l'édition des parties
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editedParts, setEditedParts] = useState(manga?.parts || []);
  const [isAddingPart, setIsAddingPart] = useState(false);
  const [newPart, setNewPart] = useState<Partial<MangaPart>>({
    title: '',
    partNumber: 1,
    startVolume: 1,
    endVolume: 1,
    status: WorkStatus.ONGOING
  });
  
  // Réinitialiser les états lorsque le manga change
  useEffect(() => {
    setEditedManga(manga);
    setEditedParts(manga?.parts || []);
    setApiResponse('');
    setError(null);
  }, [manga]);

  // Si c'est un template vide ou si manga n'est pas défini
  if (isEmptyTemplate || !manga) {
    return (
      <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
        <div className="border-base-300 bg-base-200 border-b border-dashed">
          <div className="flex items-center gap-2 p-4">
            <BookOpen size={18} className="opacity-70" />
            <h3 className="text-lg font-medium">Manga</h3>
          </div>
        </div>
        <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
          <p className="mb-3">Aucun manga trouvé pour cette licence</p>
          <button className="btn btn-sm btn-outline" onClick={onAddManga}>
            <Plus size={16} /> Ajouter un manga
          </button>
        </div>
      </div>
    );
  }

  // Format des dates pour l'affichage
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calcul des années de publication
  const startYear = manga.startDate ? new Date(manga.startDate).getFullYear() : 'N/A';
  const endYear = manga.endDate
    ? new Date(manga.endDate).getFullYear()
    : (manga.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const publicationYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  const handleFieldChange = (field: keyof MangaWork, value: any) => {
    if (!editedManga) return;
    setEditedManga({ ...editedManga, [field]: value });
  };

  const handleAuthorsChange = (authorsString: string) => {
    if (!editedManga) return;
    // Séparer les auteurs par virgule et enlever les espaces en trop
    const authors = authorsString.split(',').map(a => a.trim()).filter(a => a !== '');
    setEditedManga({ ...editedManga, authors });
  };

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

  // Fonction pour sauvegarder les modifications du manga
  const handleSaveManga = async () => {
    if (!editedManga) return;
    
    setIsLoading(true);
    setError(null);
    
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
      
      // Utiliser la route API standard pour mettre à jour un manga
      const response = await fetch(`/api/manga/${editedManga.id}`, {
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
      
      const updatedManga = await response.json();
      
      setApiResponse('Manga mis à jour avec succès');
      setIsEditing(false);
      setEditedManga(updatedManga);
      
      // Appeler le callback si fourni
      if (onUpdate) {
        onUpdate(updatedManga);
      }
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
      console.error('Erreur lors de la mise à jour du manga:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour sauvegarder les modifications d'une partie
  const handleSavePart = async (partId: string) => {
    const partToUpdate = editedParts.find(part => part.id === partId);
    if (!partToUpdate) return;
    
    setIsLoading(true);
    setError(null);
    
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
      
      const response = await fetch(`/api/manga-part/${partId}`, {
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
      setEditedParts(prevParts => 
        prevParts.map(part => 
          part.id === partId ? updatedPart : part
        )
      );
      
      setEditingPartId(null);
      setApiResponse('Partie mise à jour avec succès');
      
      // Mise à jour du manga parent si callback fourni
      if (onUpdate && manga) {
        onUpdate({
          ...manga,
          parts: editedParts.map(part => part.id === partId ? updatedPart : part)
        });
      }
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour');
      console.error('Erreur lors de la mise à jour de la partie:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour ajouter une nouvelle partie
  const handleAddPart = async () => {
    setIsLoading(true);
    setError(null);
    
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
      
      const response = await fetch('/api/manga-part', {
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
      setEditedParts(prevParts => [...prevParts, createdPart]);
      
      // Réinitialiser le formulaire d'ajout
      setIsAddingPart(false);
      setNewPart({
        title: '',
        partNumber: 1,
        startVolume: 1,
        endVolume: 1,
        status: WorkStatus.ONGOING
      });
      
      setApiResponse('Nouvelle partie ajoutée avec succès');
      
      // Mise à jour du manga parent si callback fourni
      if (onUpdate && manga) {
        onUpdate({
          ...manga,
          parts: [...editedParts, createdPart]
        });
      }
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'ajout');
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
    setError(null);
    
    try {
      const response = await fetch(`/api/manga-part/${partId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }
      
      // Supprimer la partie de la liste
      setEditedParts(prevParts => prevParts.filter(part => part.id !== partId));
      
      setApiResponse('Partie supprimée avec succès');
      
      // Mise à jour du manga parent si callback fourni
      if (onUpdate && manga) {
        onUpdate({
          ...manga,
          parts: editedParts.filter(part => part.id !== partId)
        });
      }
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la suppression');
      console.error('Erreur lors de la suppression de la partie:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedManga(manga); // Restaurer les valeurs originales
    setError(null);
  };

  // Annuler l'édition d'une partie
  const handleCancelEditPart = () => {
    setEditingPartId(null);
    setEditedParts(manga.parts || []); // Restaurer les valeurs originales
    setError(null);
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
    setError(null);
  };

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <div className="border-base-300 bg-base-200 border-b border-dashed">
        <div className="flex items-center gap-2 p-4">
          <div className="grow">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <input
                  className="input input-sm max-w-xs"
                  value={editedManga?.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                />
              ) : (
                <div className="text-lg font-medium">{manga.title}</div>
              )}
              
              {isEditing ? (
                <input
                  className="input input-sm max-w-xs"
                  value={editedManga?.publisher || ''}
                  onChange={(e) => handleFieldChange('publisher', e.target.value)}
                />
              ) : (
                <div className="italic opacity-70 text-sm">{manga.publisher}</div>
              )}
            </div>
          </div>
          
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button 
                  className="btn btn-sm btn-success" 
                  onClick={handleSaveManga}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />} 
                  Sauvegarder
                </button>
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X size={16} /> Annuler
                </button>
              </div>
            ) : (
              <button className="btn btn-sm btn-outline" onClick={() => setIsEditing(true)}>
                <Pencil size={16} /> Éditer
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="card-body gap-4 p-4">
        {/* Affichage des messages d'erreur ou de succès */}
        {error && (
          <div className="alert alert-error p-2 text-sm">
            <span>{error}</span>
          </div>
        )}
        
        {apiResponse && !error && (
          <div className="alert alert-success p-2 text-sm">
            <span>{apiResponse}</span>
          </div>
        )}
        
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre de tomes</span>
              </label>
              <input
                type="number"
                className="input input-sm input-bordered"
                value={editedManga?.volumes || 0}
                onChange={(e) => handleFieldChange('volumes', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Éditeur</span>
              </label>
              <input
                type="text"
                className="input input-sm input-bordered"
                value={editedManga?.publisher || ''}
                onChange={(e) => handleFieldChange('publisher', e.target.value)}
              />
            </div>
            
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Auteurs (séparés par des virgules)</span>
              </label>
              <input
                type="text"
                className="input input-sm input-bordered"
                value={editedManga?.authors ? editedManga.authors.join(', ') : ''}
                onChange={(e) => handleAuthorsChange(e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date de début</span>
              </label>
              <input
                type="date"
                className="input input-sm input-bordered"
                value={editedManga?.startDate ? new Date(editedManga.startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleFieldChange('startDate', e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date de fin</span>
              </label>
              <input
                type="date"
                className="input input-sm input-bordered"
                value={editedManga?.endDate ? new Date(editedManga.endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Statut</span>
              </label>
              <select
                className="select select-sm select-bordered"
                value={editedManga?.status || WorkStatus.ONGOING}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                {Object.values(WorkStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 text-sm">
              {/* Info sur les auteurs */}
              {manga.authors && manga.authors.length > 0 && (
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="opacity-40" />
                  <span>{manga.authors.join(', ')}</span>
                </div>
              )}
              
              {/* Info sur la période de publication */}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="opacity-40" />
                <span>{publicationYears}</span>
              </div>
              
              {/* Info sur les volumes */}
              <div className="flex items-center gap-2">
                <BookmarkPlus size={16} className="opacity-40" />
                <span>{manga.volumes} tome{manga.volumes !== 1 ? 's' : ''}</span>
              </div>
              
              {/* Badge de statut */}
              <div className="flex gap-2">
                <Badge contentType="status" value={manga.status} />
              </div>
            </div>

            {/* Gestion des parties du manga */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Parties</div>
                <button 
                  className="btn btn-xs btn-outline"
                  onClick={() => setIsAddingPart(true)}
                >
                  <Plus size={14} /> Ajouter
                </button>
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
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setEditingPartId(part.id)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-ghost text-error"
                            onClick={() => handleDeletePart(part.id)}
                          >
                            <Trash size={16} />
                          </button>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MangaInfoCard;