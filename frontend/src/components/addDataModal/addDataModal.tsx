import React, { useState, useEffect } from 'react';
import { WorkStatus, AnimeFidelity, RelationType } from '../../types';
import { X, Bookmark, Book, Tv, AlertCircle } from 'lucide-react';

interface AddDataModalProps {
  onClose?: () => void;
}

interface License {
  id: string;
  title: string;
}

type EntityType = 'license' | 'manga' | 'anime';

// Définition des interfaces spécifiques pour chaque type d'entité
interface LicenseFormData {
  title: string;
  externalId: string;
}

interface MangaFormData {
  licenseId: string;
  title: string;
  authors: string;
  volumes: number;
  status: WorkStatus;
  startDate: string;
  endDate: string;
  isOneShot: boolean;
  externalId: string;
}

interface AnimeFormData {
  licenseId: string;
  title: string;
  studio: string;
  episodes: number;
  status: WorkStatus;
  startDate: string;
  endDate: string;
  fidelity: AnimeFidelity;
  relationType: RelationType;
  notes: string;
  isMovie: boolean;
  externalId: string;
}

const AddDataModal: React.FC<AddDataModalProps> = ({ onClose }) => {
  const [entityType, setEntityType] = useState<EntityType>('license');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [licenseData, setLicenseData] = useState<LicenseFormData>({
    title: '',
    externalId: ''
  });
  const [mangaData, setMangaData] = useState<MangaFormData>({
    licenseId: '',
    title: '',
    authors: '',
    volumes: 1,
    status: WorkStatus.ONGOING,
    startDate: '',
    endDate: '',
    isOneShot: false,
    externalId: ''
  });
  const [animeData, setAnimeData] = useState<AnimeFormData>({
    licenseId: '',
    title: '',
    studio: '',
    episodes: 1,
    status: WorkStatus.ONGOING,
    startDate: '',
    endDate: '',
    fidelity: AnimeFidelity.FAITHFUL,
    relationType: RelationType.ORIGINAL,
    notes: '',
    isMovie: false,
    externalId: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const modal = document.getElementById('add_data_modal') as HTMLDialogElement;
    if (modal && typeof modal.showModal !== 'function') {
      console.error("Le navigateur ne supporte pas <dialog> correctement");
    }
  }, []);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await fetch('/api/getAllLicenses');
        if (!res.ok) throw new Error('Erreur lors du chargement des licences');
        const data = await res.json();
        setLicenses(data);
      } catch (err) {
        console.error('Erreur:', err);
      }
    };
    fetchLicenses();
  }, []);

  // Gestionnaires de modifications spécifiques à chaque type d'entité
  const handleLicenseChange = (field: keyof LicenseFormData, value: any) => {
    setLicenseData(prev => ({ ...prev, [field]: value }));
  };

  const handleMangaChange = (field: keyof MangaFormData, value: any) => {
    setMangaData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnimeChange = (field: keyof AnimeFormData, value: any) => {
    setAnimeData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      let dataToSubmit;
      let endpoint = `/api/${entityType}`;
      
      // Préparation des données spécifiques à chaque type d'entité
      switch (entityType) {
        case 'license':
          dataToSubmit = licenseData;
          break;
          
        case 'manga':
          dataToSubmit = {
            ...mangaData,
            authors: mangaData.authors.split(',').map((a) => a.trim())
          };
          break;
          
        case 'anime':
          dataToSubmit = animeData;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur: ${response.statusText}`);
      }
      
      setSuccess(true);
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRadioOptions = (
    label: string, 
    options: string[], 
    value: string, 
    onChange: (val: string) => void
  ) => (
    <div className="mb-4">
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <label 
            key={opt} 
            className={`px-3 py-1.5 rounded-md text-sm cursor-pointer border border-base-300 ${
              value === opt ? 'bg-primary text-primary-content' : 'bg-base-100'
            }`}
          >
            <input 
              type="radio" 
              name={label} 
              value={opt} 
              checked={value === opt} 
              onChange={() => onChange(opt)} 
              className="hidden" 
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );

  const closeModal = () => {
    const modal = document.getElementById('add_data_modal') as HTMLDialogElement;
    if (modal) modal.close();
    if (onClose) onClose();
  };

  const renderTypeIcon = (type: EntityType) => {
    switch(type) {
      case 'license': return <Bookmark size={18} />;
      case 'manga': return <Book size={18} />;
      case 'anime': return <Tv size={18} />;
      default: return null;
    }
  };

  return (
    <dialog id="add_data_modal" className="modal">
      <div className="modal-box w-full max-w-2xl max-h-screen overflow-y-auto p-0">
        <div className="border-base-300 bg-base-200 border-b border-dashed">
          <div className="flex items-center justify-between p-4">
            <h3 className="text-lg font-medium">Ajouter une nouvelle entrée</h3>
            <button className="btn btn-sm btn-ghost" onClick={closeModal}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-center gap-2 mb-6">
            {['license', 'manga', 'anime'].map((type) => (
              <button
                key={type}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  entityType === type 
                    ? 'bg-primary text-primary-content' 
                    : 'bg-base-200 hover:bg-base-300'
                }`}
                onClick={() => setEntityType(type as EntityType)}
              >
                {renderTypeIcon(type as EntityType)}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-error/10 border border-error/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 text-error" />
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 text-success" />
                <p className="text-sm text-success">Entrée ajoutée avec succès !</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Formulaire pour License */}
            {entityType === 'license' && (
              <div className="form-control">
                <label className="text-sm font-medium mb-1">Titre</label>
                <input 
                  type="text" 
                  value={licenseData.title} 
                  onChange={(e) => handleLicenseChange('title', e.target.value)} 
                  className="input input-bordered w-full rounded-md" 
                  required 
                />
                <label className="text-sm font-medium mb-1 mt-4">Identifiant externe</label>
                <input 
                  type="text" 
                  value={licenseData.externalId} 
                  onChange={(e) => handleLicenseChange('externalId', e.target.value)} 
                  className="input input-bordered w-full rounded-md" 
                />
              </div>
            )}

            {/* Formulaire pour Manga */}
            {entityType === 'manga' && (
              <>
                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Licence</label>
                  <input 
                    list="license-options" 
                    value={mangaData.licenseId} 
                    onChange={(e) => handleMangaChange('licenseId', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                  />
                  <datalist id="license-options">
                    {licenses.map((l) => <option key={l.id} value={l.title} />)}
                  </datalist>
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Titre</label>
                  <input 
                    type="text" 
                    value={mangaData.title} 
                    onChange={(e) => handleMangaChange('title', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Auteurs</label>
                  <input 
                    type="text" 
                    value={mangaData.authors} 
                    onChange={(e) => handleMangaChange('authors', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                    placeholder="Séparés par des virgules"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="form-control flex-1">
                    <label className="text-sm font-medium mb-1">Nombre de volumes</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={mangaData.volumes} 
                      onChange={(e) => handleMangaChange('volumes', parseInt(e.target.value))} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={mangaData.isOneShot} 
                      disabled={mangaData.volumes > 1} 
                      onChange={(e) => handleMangaChange('isOneShot', e.target.checked)} 
                      className="checkbox checkbox-sm" 
                    />
                    <span className="text-sm">One shot</span>
                  </label>
                </div>

                {renderRadioOptions("Statut", Object.values(WorkStatus), mangaData.status, 
                  (val) => handleMangaChange('status', val))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année début</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={mangaData.startDate} 
                      onChange={(e) => handleMangaChange('startDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année fin</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={mangaData.endDate} 
                      onChange={(e) => handleMangaChange('endDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Identifiant externe</label>
                  <input 
                    type="text" 
                    value={mangaData.externalId} 
                    onChange={(e) => handleMangaChange('externalId', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                  />
                </div>
              </>
            )}

            {/* Formulaire pour Anime */}
            {entityType === 'anime' && (
              <>
                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Licence</label>
                  <input 
                    list="license-options" 
                    value={animeData.licenseId} 
                    onChange={(e) => handleAnimeChange('licenseId', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                  />
                  <datalist id="license-options">
                    {licenses.map((l) => <option key={l.id} value={l.title} />)}
                  </datalist>
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Titre</label>
                  <input 
                    type="text" 
                    value={animeData.title} 
                    onChange={(e) => handleAnimeChange('title', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Studio</label>
                  <input 
                    type="text" 
                    value={animeData.studio} 
                    onChange={(e) => handleAnimeChange('studio', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="form-control flex-1">
                    <label className="text-sm font-medium mb-1">Nombre d'épisodes</label>
                    <input 
                      type="number" 
                      min={1} 
                      value={animeData.episodes} 
                      onChange={(e) => handleAnimeChange('episodes', parseInt(e.target.value))} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={animeData.isMovie} 
                      disabled={animeData.episodes > 1} 
                      onChange={(e) => handleAnimeChange('isMovie', e.target.checked)} 
                      className="checkbox checkbox-sm" 
                    />
                    <span className="text-sm">Film</span>
                  </label>
                </div>

                {renderRadioOptions("Statut", Object.values(WorkStatus), animeData.status, 
                  (val) => handleAnimeChange('status', val))}

                {renderRadioOptions("Fidélité", Object.values(AnimeFidelity), animeData.fidelity, 
                  (val) => handleAnimeChange('fidelity', val))}

                {renderRadioOptions("Type de relation", [...Object.values(RelationType)], 
                  animeData.relationType, (val) => handleAnimeChange('relationType', val))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année début</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={animeData.startDate} 
                      onChange={(e) => handleAnimeChange('startDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année fin</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={animeData.endDate} 
                      onChange={(e) => handleAnimeChange('endDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Notes</label>
                  <textarea 
                    className="textarea textarea-bordered w-full rounded-md" 
                    value={animeData.notes} 
                    onChange={(e) => handleAnimeChange('notes', e.target.value)} 
                    rows={3}
                  />
                </div>
                
                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Identifiant externe</label>
                  <input 
                    type="text" 
                    value={animeData.externalId} 
                    onChange={(e) => handleAnimeChange('externalId', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-base-300 border-dashed mt-6">
              <button 
                type="button" 
                className="px-4 py-2 rounded-md bg-base-200 hover:bg-base-300" 
                onClick={closeModal}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 rounded-md bg-primary text-primary-content"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default AddDataModal;