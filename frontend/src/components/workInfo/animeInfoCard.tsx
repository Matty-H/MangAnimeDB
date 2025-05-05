import React, { useState } from 'react';
import { AnimeWork, WorkStatus, AnimeFidelity, RelationType, AdaptationType } from '../../types';
import { Info, Calendar, Tv, Film, BarChart2, Plus, Pencil, Check, X } from 'lucide-react';
import Badge from './ui/badge';

interface AnimeInfoCardProps {
  anime?: AnimeWork;
  licenseId: string;
  isEmptyTemplate?: boolean;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({ 
  anime, 
  licenseId, 
  isEmptyTemplate = false 
}) => {
  // État pour l'édition principale
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnime, setEditedAnime] = useState<AnimeWork | undefined>(anime);
  const [apiResponse, setApiResponse] = useState<string>('');
  
  // États pour l'édition des saisons
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editedSeasons, setEditedSeasons] = useState(anime?.seasons || []);

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

  const handleSaveAnime = async () => {
    if (!editedAnime) return;
    
    try {
      const res = await fetch(`/api/anime/${anime.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedAnime),
      });

      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));

      if (!res.ok) throw new Error(`Erreur: ${res.status}`);

      setIsEditing(false);
    } catch (err) {
      console.error('Erreur de mise à jour:', err);
      setApiResponse(`Erreur: ${err.message}`);
      alert(`Erreur lors de la sauvegarde: ${err.message}`);
    }
  };

  const handleSaveSeason = async (seasonId: string) => {
    const seasonToUpdate = editedSeasons.find(s => s.id === seasonId);
    if (!seasonToUpdate) return;
    
    try {
      const res = await fetch(`/api/anime/season/${seasonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seasonToUpdate),
      });

      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));

      if (!res.ok) throw new Error(`Erreur: ${res.status}`);

      setEditingSeasonId(null);
    } catch (err) {
      console.error('Erreur de mise à jour de la saison:', err);
      setApiResponse(`Erreur: ${err.message}`);
      alert(`Erreur lors de la sauvegarde de la saison: ${err.message}`);
    }
  };

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
                <button className="btn btn-sm btn-success" onClick={handleSaveAnime}>
                  <Check size={16} /> Sauvegarder
                </button>
                <button className="btn btn-sm btn-outline" onClick={() => setIsEditing(false)}>
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
                onChange={(e) => handleFieldChange('startDate', new Date(e.target.value))}
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
                  {seasonCount} Saison{seasonCount !== 1 ? 's' : ''} • {totalEpisodes} Épisode{totalEpisodes !== 1 ? 's' : ''}
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
            
            {anime.seasons && anime.seasons.length > 0 && (
              <div className="mt-2">
                <div className="text-sm font-medium mb-2">Détails des saisons</div>
                <div className="rounded-lg border border-base-300 overflow-hidden">
                  {anime.seasons.map((season, index) => (
                    <div 
                      key={season.id} 
                      className={`p-3 ${
                        index < anime.seasons.length - 1 ? 'border-b border-base-300 border-dashed' : ''
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
                              className="btn btn-sm btn-success" 
                              onClick={() => handleSaveSeason(season.id)}
                            >
                              <Check size={16} /> Sauvegarder
                            </button>
                            <button 
                              className="btn btn-sm btn-outline" 
                              onClick={() => setEditingSeasonId(null)}
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
                            <button 
                              className="btn btn-sm btn-outline" 
                              onClick={() => setEditingSeasonId(season.id)}
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          <div className="mt-2 bg-gray-100 p-2 text-xs font-mono">
            <pre>{apiResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeInfoCard;