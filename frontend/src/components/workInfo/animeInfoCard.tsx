import React, { useState } from 'react';
import { AnimeWork, WorkStatus, AnimeFidelity, RelationType, AdaptationType } from '../../types';
import { Info, Calendar, Tv, Film, BarChart2, Plus, Pencil, Check, X } from 'lucide-react';
import Badge from '../ui/badge';

interface AnimeInfoCardProps {
  anime?: AnimeWork;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onAnimeUpdated?: (anime: AnimeWork) => void;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({ 
  anime, 
  licenseId, 
  isEmptyTemplate = false,
  onAnimeUpdated 
}) => {
  // État pour l'édition principale
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnime, setEditedAnime] = useState<AnimeWork | undefined>(anime);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États pour l'édition des saisons
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editedSeasons, setEditedSeasons] = useState(anime?.seasons || []);
  const [isAddingSeason, setIsAddingSeason] = useState(false);
  const [newSeason, setNewSeason] = useState({
    animeAdaptationId: anime?.id || '',
    seasonNumber: (anime?.seasons?.length || 0) + 1,
    episodes: 12,
    fidelity: AnimeFidelity.FAITHFUL,
    coverageFromVolume: null,
    coverageToVolume: null,
    notes: ''
  });

  // Si c'est un template vide ou si anime n'est pas défini
  if (isEmptyTemplate || !anime) {
    return (
      <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
        <div className="border-base-300 bg-base-200 border-b border-dashed">
          <div className="flex items-center gap-2 p-4">
            <Film size={18} className="opacity-70" />
            <h3 className="text-lg font-medium">Anime</h3>
          </div>
        </div>
        <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500">
          <p className="mb-3">Aucun anime trouvé pour cette licence</p>
          <button className="btn btn-sm btn-outline">
            <Plus size={16} /> Ajouter un anime
          </button>
        </div>
      </div>
    );
  }

  const seasonCount = anime.seasons?.length || 0;
  const totalEpisodes = anime.episodes;
  const startYear = anime.startDate ? new Date(anime.startDate).getFullYear() : 'N/A';
  const endYear = anime.endDate
    ? new Date(anime.endDate).getFullYear()
    : (anime.status === WorkStatus.ONGOING ? 'présent' : 'N/A');
  const airYears = startYear === endYear ? startYear : `${startYear} - ${endYear}`;

  const handleFieldChange = (field: keyof AnimeWork, value: any) => {
    if (!editedAnime) return;
    setEditedAnime({ ...editedAnime, [field]: value });
  };

  const handleSeasonFieldChange = (seasonId: string, field: string, value: any) => {
    setEditedSeasons(prevSeasons => 
      prevSeasons.map(season => 
        season.id === seasonId 
          ? { ...season, [field]: value } 
          : season
      )
    );
  };

  const handleNewSeasonFieldChange = (field: string, value: any) => {
    setNewSeason(prev => ({ ...prev, [field]: value }));
  };

  // Fonction pour sauvegarder les modifications d'un anime
  const saveAnimeChanges = async () => {
    if (!editedAnime) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/anime/${editedAnime.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedAnime),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      
      const updatedAnime = await response.json();
      setApiResponse(JSON.stringify(updatedAnime, null, 2));
      setIsEditing(false);
      
      // Mettre à jour l'état principal si la fonction de rappel est fournie
      if (onAnimeUpdated) {
        onAnimeUpdated(updatedAnime);
      }
      
      // Mettre à jour l'état local
      setEditedAnime(updatedAnime);
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'anime:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour sauvegarder les modifications d'une saison
  const saveSeasonChanges = async (seasonId: string) => {
    const seasonToUpdate = editedSeasons.find(s => s.id === seasonId);
    if (!seasonToUpdate) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/anime-season/${seasonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seasonToUpdate),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      
      const updatedSeason = await response.json();
      setApiResponse(JSON.stringify(updatedSeason, null, 2));
      
      // Mettre à jour l'état local des saisons
      setEditedSeasons(prevSeasons => 
        prevSeasons.map(season => 
          season.id === seasonId ? updatedSeason : season
        )
      );
      
      setEditingSeasonId(null);
      
      // Mettre à jour l'anime complet si la fonction de rappel est fournie
      if (onAnimeUpdated && anime) {
        const updatedAnime = {
          ...anime,
          seasons: editedSeasons.map(season => 
            season.id === seasonId ? updatedSeason : season
          )
        };
        onAnimeUpdated(updatedAnime);
      }
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la saison:', err);
      setError(err.message || 'Erreur lors de la mise à jour de la saison');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle saison
  const addNewSeason = async () => {
    if (!anime || !anime.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/anime-season', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSeason,
          animeAdaptationId: anime.id
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      
      const createdSeason = await response.json();
      setApiResponse(JSON.stringify(createdSeason, null, 2));
      
      // Mettre à jour l'état local des saisons
      setEditedSeasons(prevSeasons => [...prevSeasons, createdSeason]);
      
      // Réinitialiser le formulaire d'ajout
      setIsAddingSeason(false);
      setNewSeason({
        animeAdaptationId: anime.id,
        seasonNumber: (editedSeasons.length + 1),
        episodes: 12,
        fidelity: AnimeFidelity.FAITHFUL,
        coverageFromVolume: null,
        coverageToVolume: null,
        notes: ''
      });
      
      // Mettre à jour l'anime complet si la fonction de rappel est fournie
      if (onAnimeUpdated && anime) {
        const updatedAnime = {
          ...anime,
          seasons: [...editedSeasons, createdSeason]
        };
        onAnimeUpdated(updatedAnime);
      }
      
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la saison:', err);
      setError(err.message || 'Erreur lors de l\'ajout de la saison');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer une saison
  const deleteSeason = async (seasonId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/anime-season/${seasonId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }
      
      const deletedSeason = await response.json();
      setApiResponse(JSON.stringify(deletedSeason, null, 2));
      
      // Mettre à jour l'état local des saisons
      setEditedSeasons(prevSeasons => 
        prevSeasons.filter(season => season.id !== seasonId)
      );
      
      // Mettre à jour l'anime complet si la fonction de rappel est fournie
      if (onAnimeUpdated && anime) {
        const updatedAnime = {
          ...anime,
          seasons: editedSeasons.filter(season => season.id !== seasonId)
        };
        onAnimeUpdated(updatedAnime);
      }
      
    } catch (err) {
      console.error('Erreur lors de la suppression de la saison:', err);
      setError(err.message || 'Erreur lors de la suppression de la saison');
    } finally {
      setIsLoading(false);
    }
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
                  value={editedAnime?.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                />
              ) : (
                <div className="text-lg font-medium">{anime.title}</div>
              )}
              
              {isEditing ? (
                <input
                  className="input input-sm max-w-xs"
                  value={editedAnime?.studio || ''}
                  onChange={(e) => handleFieldChange('studio', e.target.value)}
                />
              ) : (
                <div className="italic opacity-70 text-sm">{anime.studio}</div>
              )}
            </div>
          </div>
          
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <button 
                  className={`btn btn-sm btn-success ${isLoading ? 'loading' : ''}`}
                  onClick={saveAnimeChanges}
                  disabled={isLoading}
                >
                  <Check size={16} /> Sauvegarder
                </button>
                <button 
                  className="btn btn-sm btn-outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditedAnime(anime); // Restaurer l'original
                    setError(null);
                  }}
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
        {error && (
          <div className="alert alert-error text-sm">
            <span>{error}</span>
          </div>
        )}
        
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Épisodes</span>
              </label>
              <input
                type="number"
                className="input input-sm input-bordered"
                value={editedAnime?.episodes || 0}
                onChange={(e) => handleFieldChange('episodes', parseInt(e.target.value))}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Studio</span>
              </label>
              <input
                type="text"
                className="input input-sm input-bordered"
                value={editedAnime?.studio || ''}
                onChange={(e) => handleFieldChange('studio', e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date de début</span>
              </label>
              <input
                type="date"
                className="input input-sm input-bordered"
                value={editedAnime?.startDate ? new Date(editedAnime.startDate).toISOString().split('T')[0] : ''}
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
                value={editedAnime?.endDate ? new Date(editedAnime.endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value ? new Date(e.target.value) : null)}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Statut</span>
              </label>
              <select
                className="select select-sm select-bordered"
                value={editedAnime?.status || WorkStatus.ONGOING}
                onChange={(e) => handleFieldChange('status', e.target.value)}
              >
                {Object.values(WorkStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Fidélité</span>
              </label>
              <select
                className="select select-sm select-bordered"
                value={editedAnime?.fidelity || AnimeFidelity.FAITHFUL}
                onChange={(e) => handleFieldChange('fidelity', e.target.value)}
              >
                {Object.values(AnimeFidelity).map(fidelity => (
                  <option key={fidelity} value={fidelity}>{fidelity}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control col-span-2">
              <label className="label">
                <span className="label-text">Notes</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                value={editedAnime?.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
              ></textarea>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Tv size={16} className="opacity-40" />
                <span>
                  {seasonCount === 0 ? 'Saison unique' : `${seasonCount} Saison${seasonCount > 1 ? 's' : ''}`} • {totalEpisodes} Épisode{totalEpisodes !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar size={16} className="opacity-40" />
                <span>{airYears}</span>
              </div>
              
              <div className="flex gap-2">
                <Badge contentType="status" value={anime.status} />
                <Badge contentType="fidelity" value={anime.fidelity} />
              </div>
            </div>
            
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">Détails des saisons</div>
                <button 
                  className="btn btn-xs btn-outline" 
                  onClick={() => setIsAddingSeason(true)}
                >
                  <Plus size={14} /> Ajouter
                </button>
              </div>
              
              {/* Formulaire d'ajout de saison */}
              {isAddingSeason && (
                <div className="border border-base-300 rounded-lg p-3 mb-3">
                  <div className="text-sm font-medium mb-2">Nouvelle saison</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs">Numéro de saison</span>
                      </label>
                      <input
                        type="number"
                        className="input input-sm input-bordered"
                        value={newSeason.seasonNumber}
                        onChange={(e) => handleNewSeasonFieldChange('seasonNumber', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs">Épisodes</span>
                      </label>
                      <input
                        type="number"
                        className="input input-sm input-bordered"
                        value={newSeason.episodes}
                        onChange={(e) => handleNewSeasonFieldChange('episodes', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs">Fidélité</span>
                      </label>
                      <select
                        className="select select-sm select-bordered"
                        value={newSeason.fidelity}
                        onChange={(e) => handleNewSeasonFieldChange('fidelity', e.target.value)}
                      >
                        {Object.values(AnimeFidelity).map(fidelity => (
                          <option key={fidelity} value={fidelity}>{fidelity}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs">Tome de début</span>
                      </label>
                      <input
                        type="number"
                        className="input input-sm input-bordered"
                        value={newSeason.coverageFromVolume || ''}
                        onChange={(e) => handleNewSeasonFieldChange(
                          'coverageFromVolume', 
                          e.target.value ? parseInt(e.target.value) : null
                        )}
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs">Tome de fin</span>
                      </label>
                      <input
                        type="number"
                        className="input input-sm input-bordered"
                        value={newSeason.coverageToVolume || ''}
                        onChange={(e) => handleNewSeasonFieldChange(
                          'coverageToVolume', 
                          e.target.value ? parseInt(e.target.value) : null
                        )}
                      />
                    </div>
                    
                    <div className="col-span-2 mt-2 flex justify-end gap-2">
                      <button 
                        className={`btn btn-sm btn-success ${isLoading ? 'loading' : ''}`}
                        onClick={addNewSeason}
                        disabled={isLoading}
                      >
                        <Check size={16} /> Ajouter
                      </button>
                      <button 
                        className="btn btn-sm btn-outline" 
                        onClick={() => setIsAddingSeason(false)}
                        disabled={isLoading}
                      >
                        <X size={16} /> Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Liste des saisons */}
              {editedSeasons.length > 0 ? (
                <div className="rounded-lg border border-base-300 overflow-hidden">
                  {editedSeasons.map((season, index) => (
                    <div 
                      key={season.id} 
                      className={`p-3 ${
                        index < editedSeasons.length - 1 ? 'border-b border-base-300 border-dashed' : ''
                      }`}
                    >
                      {editingSeasonId === season.id ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Numéro de saison</span>
                            </label>
                            <input
                              type="number"
                              className="input input-sm input-bordered"
                              value={editedSeasons.find(s => s.id === season.id)?.seasonNumber || 0}
                              onChange={(e) => handleSeasonFieldChange(season.id, 'seasonNumber', parseInt(e.target.value))}
                            />
                          </div>
                          
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Épisodes</span>
                            </label>
                            <input
                              type="number"
                              className="input input-sm input-bordered"
                              value={editedSeasons.find(s => s.id === season.id)?.episodes || 0}
                              onChange={(e) => handleSeasonFieldChange(season.id, 'episodes', parseInt(e.target.value))}
                            />
                          </div>
                          
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Fidélité</span>
                            </label>
                            <select
                              className="select select-sm select-bordered"
                              value={editedSeasons.find(s => s.id === season.id)?.fidelity || AnimeFidelity.FAITHFUL}
                              onChange={(e) => handleSeasonFieldChange(season.id, 'fidelity', e.target.value)}
                            >
                              {Object.values(AnimeFidelity).map(fidelity => (
                                <option key={fidelity} value={fidelity}>{fidelity}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Tome de début</span>
                            </label>
                            <input
                              type="number"
                              className="input input-sm input-bordered"
                              value={editedSeasons.find(s => s.id === season.id)?.coverageFromVolume || ''}
                              onChange={(e) => handleSeasonFieldChange(
                                season.id, 
                                'coverageFromVolume', 
                                e.target.value ? parseInt(e.target.value) : null
                              )}
                            />
                          </div>
                          
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text text-xs">Tome de fin</span>
                            </label>
                            <input
                              type="number"
                              className="input input-sm input-bordered"
                              value={editedSeasons.find(s => s.id === season.id)?.coverageToVolume || ''}
                              onChange={(e) => handleSeasonFieldChange(
                                season.id, 
                                'coverageToVolume', 
                                e.target.value ? parseInt(e.target.value) : null
                              )}
                            />
                          </div>
                          
                          <div className="col-span-2 mt-2 flex justify-end gap-2">
                            <button 
                              className={`btn btn-sm btn-success ${isLoading ? 'loading' : ''}`}
                              onClick={() => saveSeasonChanges(season.id)}
                              disabled={isLoading}
                            >
                              <Check size={16} /> Sauvegarder
                            </button>
                            <button 
                              className="btn btn-sm btn-outline" 
                              onClick={() => setEditingSeasonId(null)}
                              disabled={isLoading}
                            >
                              <X size={16} /> Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Saison {season.seasonNumber}</div>
                            <div className="text-xs opacity-60">
                              {season.episodes} épisode{season.episodes !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Badge 
                              contentType="fidelity"
                              value={season.fidelity}
                              size="sm"
                            />
                            {season.coverageFromVolume && season.coverageToVolume && (
                              <Badge 
                                contentType="coverage"
                                label={`Tomes ${season.coverageFromVolume}-${season.coverageToVolume}`}
                                size="sm" 
                              />
                            )}
                            <div className="flex gap-1">
                              <button 
                                className="btn btn-xs btn-outline" 
                                onClick={() => setEditingSeasonId(season.id)}
                              >
                                <Pencil size={14} />
                              </button>
                              <button 
                                className="btn btn-xs btn-outline btn-error" 
                                onClick={() => deleteSeason(season.id)}
                                disabled={isLoading}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-base-300 rounded-lg">
                  <p className="text-sm text-gray-500">Aucune saison ajoutée</p>
                </div>
              )}
            </div>

            {anime.notes && (
              <div className="mt-2 bg-base-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info size={16} className="mt-0.5 text-primary" />
                  <p className="text-sm">{anime.notes}</p>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Zone de réponse API pour débogage */}
        {apiResponse && (
          <div className="mt-2 bg-gray-100 p-2 text-xs font-mono rounded-lg">
            <pre className="whitespace-pre-wrap overflow-auto max-h-40">{apiResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeInfoCard;