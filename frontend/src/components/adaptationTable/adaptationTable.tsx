import React, { useState, useEffect } from 'react';
import { License } from '../../types';
import { BookOpen, Tv, ArrowRight, Pencil, Check, Plus } from 'lucide-react';

interface AdaptationTableProps {
  license: License;
}

interface AdaptationRow {
  id: string;
  type: 'season' | 'anime'; // Pour distinguer les saisons des adaptations
  seasonName: string;
  episodes: number;
  fromVolume?: number;
  toVolume?: number;
}

const AdaptationTable: React.FC<AdaptationTableProps> = ({ license }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(license.title);
  const [currentTitle, setCurrentTitle] = useState(license.title);
  const [adaptationRows, setAdaptationRows] = useState<AdaptationRow[]>([]);
  const [debug, setDebug] = useState<string>('');

  // Générer les lignes d'adaptation une seule fois lors du chargement
  useEffect(() => {
    const rows: AdaptationRow[] = [];

    // Affichage des IDs pour débogage
    let debugInfo = 'IDs disponibles:\n';

    if (license.animeAdaptations && license.animeAdaptations.length > 0) {
      license.animeAdaptations.forEach(anime => {
        debugInfo += `Anime: ${anime.title}, ID: ${anime.id}\n`;
        
        if (anime.seasons && anime.seasons.length > 0) {
          anime.seasons.forEach(season => {
            debugInfo += `  - Saison ${season.seasonNumber}, ID: ${season.id}\n`;
            
            rows.push({
              id: season.id,
              type: 'season',
              seasonName: `${anime.title} - Saison ${season.seasonNumber}`,
              episodes: season.episodes || 0,
              fromVolume: season.coverageFromVolume,
              toVolume: season.coverageToVolume,
            });
          });
        } else {
          rows.push({
            id: anime.id,
            type: 'anime',
            seasonName: anime.title,
            episodes: anime.episodes || 0,
            fromVolume: anime.sourcedFrom && anime.sourcedFrom.length > 0 
              ? anime.sourcedFrom[0].coverageFromVolume 
              : undefined,
            toVolume: anime.sourcedFrom && anime.sourcedFrom.length > 0 
              ? anime.sourcedFrom[0].coverageToVolume 
              : undefined,
          });
        }
      });
    }

    setAdaptationRows(rows);
    setDebug(debugInfo);
  }, [license]);

  const handleSaveTitle = async () => {
    try {
      const res = await fetch(`/api/license/${license.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle }),
      });

      if (!res.ok) throw new Error('Erreur de mise à jour');

      setCurrentTitle(editedTitle);
      setIsEditing(false);
    } catch (err) {
      console.error('Erreur de mise à jour du titre :', err);
      alert("Échec de la mise à jour du titre.");
    }
  };

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <div className="border-base-300 bg-base-200 border-b border-dashed">
        <div className="flex items-center gap-2 p-4">
          <div className="grow">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="opacity-70" />
              <ArrowRight size={16} className="opacity-50" />
              <Tv size={18} className="opacity-70" />

              {isEditing ? (
                <input
                  className="input input-sm max-w-xs"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <h2 className="text-lg font-medium">{currentTitle}</h2>
              )}
            </div>
          </div>

          <div>
          {isEditing ? (
            <div className="flex gap-2">
              <button className="btn btn-sm btn-success" onClick={handleSaveTitle}>
                <Check size={16} /> Sauvegarder
              </button>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setEditedTitle(currentTitle);
                  setIsEditing(false);
                }}
              >
                Annuler
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

      {/* Zone de débogage temporaire */}
      {debug && (
        <div className="bg-gray-100 p-2 text-xs font-mono">
          <pre>{debug}</pre>
        </div>
      )}

      <div className="card-body p-4">
        <div className="rounded-lg border border-base-300 overflow-hidden">
          <div className="bg-base-200 p-3 flex font-medium text-sm">
            <div className="flex-1">Anime</div>
            <div className="w-24 text-center">Épisodes</div>
            <div className="w-32 text-center">Vol. manga</div>
            <div className="w-16 text-center">Type</div>
            <div className="w-16"></div>
          </div>

          {adaptationRows.length > 0 ? (
            adaptationRows.map((row, index) => {
              const RowContent = () => {
                const [episodes, setEpisodes] = useState(row.episodes);
                const [fromVolume, setFromVolume] = useState<string | number>(row.fromVolume ?? '');
                const [toVolume, setToVolume] = useState<string | number>(row.toVolume ?? '');
                const [isRowEditing, setIsRowEditing] = useState(false);
                const [apiResponse, setApiResponse] = useState<string>('');

                const handleSaveRow = async () => {
                  try {
                    // Ajouter le type d'adaptation pour aider le backend
                    const res = await fetch(`/api/adaptation/${row.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        type: row.type,
                        episodes: Number(episodes), 
                        fromVolume: fromVolume !== '' ? Number(fromVolume) : null, 
                        toVolume: toVolume !== '' ? Number(toVolume) : null 
                      }),
                    });

                    const data = await res.json();
                    setApiResponse(JSON.stringify(data, null, 2));

                    if (!res.ok) throw new Error(`Erreur: ${res.status}`);

                    setIsRowEditing(false);
                  } catch (err) {
                    console.error('Erreur de sauvegarde:', err);
                    setApiResponse(`Erreur: ${err.message}`);
                    alert(`Erreur lors de la sauvegarde: ${err.message}`);
                  }
                };

                return (
                  <>
                    <div className="flex-1 font-bold">{row.seasonName}</div>

                    <div className="w-24 text-center">
                      {isRowEditing ? (
                        <input
                          type="number"
                          className="input input-sm w-12 text-center"
                          value={episodes}
                          onChange={(e) => setEpisodes(Number(e.target.value))}
                        />
                      ) : (
                        row.episodes
                      )}
                    </div>

                    <div className="w-32 text-center flex gap-1 justify-center">
                      {isRowEditing ? (
                        <>
                          <input
                            type="number"
                            className="input input-sm w-14 text-center"
                            value={fromVolume}
                            onChange={(e) => setFromVolume(e.target.value)}
                          />
                          <span className="mx-1">-</span>
                          <input
                            type="number"
                            className="input input-sm w-14 text-center"
                            value={toVolume}
                            onChange={(e) => setToVolume(e.target.value)}
                          />
                        </>
                      ) : (
                        row.fromVolume && row.toVolume
                          ? `${row.fromVolume}-${row.toVolume}`
                          : row.fromVolume
                            ? `${row.fromVolume}+`
                            : row.toVolume
                              ? `Jusqu'au tome ${row.toVolume}`
                              : 'N/A'
                      )}
                    </div>

                    <div className="w-16 text-center text-xs opacity-50">
                      {row.type}
                    </div>

                    <div className="ml-3">
                    {isRowEditing ? (
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-success" onClick={handleSaveRow}>
                          <Check size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            setEpisodes(row.episodes);
                            setFromVolume(row.fromVolume ?? '');
                            setToVolume(row.toVolume ?? '');
                            setIsRowEditing(false);
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button className="btn btn-sm btn-outline" onClick={() => setIsRowEditing(true)}>
                        <Pencil size={16} />
                      </button>
                  )}
                    </div>

                    {/* Zone de réponse API pour débogage */}
                    {apiResponse && (
                      <div className="col-span-full mt-2 bg-gray-100 p-2 text-xs font-mono">
                        <pre>{apiResponse}</pre>
                      </div>
                    )}
                  </>
                );
              };

              return (
                <div 
                  key={row.id} 
                  className={`p-3 flex items-center ${
                    index < adaptationRows.length - 1 ? 'border-b border-base-300 border-dashed' : ''
                  }`}
                >
                  <RowContent />
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center flex flex-col items-center justify-center text-gray-500">
              <p className="mb-3">Aucune adaptation trouvée pour cette licence</p>
              <button className="btn btn-sm btn-outline">
                <Plus size={16} /> Ajouter une adaptation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdaptationTable;