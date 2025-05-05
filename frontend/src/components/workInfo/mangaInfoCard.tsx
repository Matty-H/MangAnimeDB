import React, { useState } from 'react';
import { MangaWork, WorkStatus, MangaPart } from '../../types';
import { BookOpen, Calendar, BookmarkPlus, Info, Plus, Pencil, Check, X } from 'lucide-react';
import Badge from '../ui/badge';

interface MangaInfoCardProps {
  manga?: MangaWork;
  licenseId: string;
  isEmptyTemplate?: boolean;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({ 
  manga, 
  licenseId, 
  isEmptyTemplate = false 
}) => {
  // État pour l'édition principale
  const [isEditing, setIsEditing] = useState(false);
  const [editedManga, setEditedManga] = useState<MangaWork | undefined>(manga);
  const [apiResponse, setApiResponse] = useState<string>('');
  
  // États pour l'édition des parties
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editedParts, setEditedParts] = useState(manga?.parts || []);

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
          <button className="btn btn-sm btn-outline">
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
                <button className="btn btn-sm btn-success">
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

            {/* Si des parties du manga existent */}
            {manga.parts && manga.parts.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Parties</div>
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
                            <input
                              className="input input-sm input-bordered w-full"
                              value={part.title}
                              onChange={(e) => handlePartFieldChange(part.id, 'title', e.target.value)}
                            />
                            <div className="flex gap-2">
                              <input
                                type="number"
                                className="input input-sm input-bordered w-24"
                                value={part.startVolume}
                                onChange={(e) => handlePartFieldChange(part.id, 'startVolume', parseInt(e.target.value))}
                                placeholder="Début"
                              />
                              <input
                                type="number"
                                className="input input-sm input-bordered w-24"
                                value={part.endVolume}
                                onChange={(e) => handlePartFieldChange(part.id, 'endVolume', parseInt(e.target.value))}
                                placeholder="Fin"
                              />
                              <input
                                type="number"
                                className="input input-sm input-bordered w-24"
                                value={part.volumes}
                                onChange={(e) => handlePartFieldChange(part.id, 'volumes', parseInt(e.target.value))}
                                placeholder="Tomes"
                              />
                              <select
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
                          <div className="flex gap-2 items-start">
                            <button className="btn btn-sm btn-success">
                              <Check size={16} />
                            </button>
                            <button className="btn btn-sm btn-outline" onClick={() => setEditingPartId(null)}>
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
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MangaInfoCard;
