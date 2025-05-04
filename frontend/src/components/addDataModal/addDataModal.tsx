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

interface FormData {
  license: { title: string; externalId: string };
  manga: {
    licenseId: string;
    title: string;
    authors: string;
    volumes: number;
    status: WorkStatus;
    startDate: string;
    endDate: string;
    isOneShot: boolean;
    externalId: string;
  };
  anime: {
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
  };
}

const AddDataModal: React.FC<AddDataModalProps> = ({ onClose }) => {
  const [entityType, setEntityType] = useState<EntityType>('license');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [formData, setFormData] = useState<FormData>({
    license: { title: '', externalId: '' },
    manga: {
      licenseId: '', title: '', authors: '', volumes: 1, status: WorkStatus.ONGOING,
      startDate: '', endDate: '', isOneShot: false, externalId: ''
    },
    anime: {
      licenseId: '', title: '', studio: '', episodes: 1, status: WorkStatus.ONGOING,
      startDate: '', endDate: '', fidelity: AnimeFidelity.FAITHFUL,
      relationType: RelationType.ORIGINAL, notes: '', isMovie: false, externalId: ''
    }
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

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      let dataToSubmit;
      if (entityType === 'manga') {
        const { authors, ...rest } = formData.manga;
        dataToSubmit = {
          ...rest,
          authors: authors.split(',').map((a) => a.trim())
        };
      } else if (entityType === 'anime') {
        dataToSubmit = formData.anime;
      } else {
        dataToSubmit = formData.license;
      }
      const response = await fetch(`/api/${entityType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      if (!response.ok) throw new Error(`Erreur: ${response.statusText}`);
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
      <div className="modal-box max-w-2xl p-0 overflow-hidden">
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
            {entityType === 'license' && (
              <div className="form-control">
                <label className="text-sm font-medium mb-1">Titre</label>
                <input 
                  type="text" 
                  value={formData.license.title} 
                  onChange={(e) => handleInputChange('license', 'title', e.target.value)} 
                  className="input input-bordered w-full rounded-md" 
                  required 
                />
              </div>
            )}

            {entityType === 'manga' && (
              <>
                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Licence</label>
                  <input 
                    list="license-options" 
                    value={formData.manga.licenseId} 
                    onChange={(e) => handleInputChange('manga', 'licenseId', e.target.value)} 
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
                    value={formData.manga.title} 
                    onChange={(e) => handleInputChange('manga', 'title', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Auteurs</label>
                  <input 
                    type="text" 
                    value={formData.manga.authors} 
                    onChange={(e) => handleInputChange('manga', 'authors', e.target.value)} 
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
                      value={formData.manga.volumes} 
                      onChange={(e) => handleInputChange('manga', 'volumes', parseInt(e.target.value))} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.manga.isOneShot} 
                      disabled={formData.manga.volumes > 1} 
                      onChange={(e) => handleInputChange('manga', 'isOneShot', e.target.checked)} 
                      className="checkbox checkbox-sm" 
                    />
                    <span className="text-sm">One shot</span>
                  </label>
                </div>

                {renderRadioOptions("Statut", Object.values(WorkStatus), formData.manga.status, 
                  (val) => handleInputChange('manga', 'status', val))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année début</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={formData.manga.startDate} 
                      onChange={(e) => handleInputChange('manga', 'startDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année fin</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={formData.manga.endDate} 
                      onChange={(e) => handleInputChange('manga', 'endDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                </div>
              </>
            )}

            {entityType === 'anime' && (
              <>
                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Licence</label>
                  <input 
                    list="license-options" 
                    value={formData.anime.licenseId} 
                    onChange={(e) => handleInputChange('anime', 'licenseId', e.target.value)} 
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
                    value={formData.anime.title} 
                    onChange={(e) => handleInputChange('anime', 'title', e.target.value)} 
                    className="input input-bordered w-full rounded-md" 
                    required 
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Studio</label>
                  <input 
                    type="text" 
                    value={formData.anime.studio} 
                    onChange={(e) => handleInputChange('anime', 'studio', e.target.value)} 
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
                      value={formData.anime.episodes} 
                      onChange={(e) => handleInputChange('anime', 'episodes', parseInt(e.target.value))} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.anime.isMovie} 
                      disabled={formData.anime.episodes > 1} 
                      onChange={(e) => handleInputChange('anime', 'isMovie', e.target.checked)} 
                      className="checkbox checkbox-sm" 
                    />
                    <span className="text-sm">Film</span>
                  </label>
                </div>

                {renderRadioOptions("Statut", Object.values(WorkStatus), formData.anime.status, 
                  (val) => handleInputChange('anime', 'status', val))}

                {renderRadioOptions("Fidélité", Object.values(AnimeFidelity), formData.anime.fidelity, 
                  (val) => handleInputChange('anime', 'fidelity', val))}

                {renderRadioOptions("Type de relation", [...Object.values(RelationType)], 
                  formData.anime.relationType, (val) => handleInputChange('anime', 'relationType', val))}

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année début</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={formData.anime.startDate} 
                      onChange={(e) => handleInputChange('anime', 'startDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                  <div className="form-control">
                    <label className="text-sm font-medium mb-1">Année fin</label>
                    <input 
                      type="number" 
                      min={1900} 
                      max={2100} 
                      value={formData.anime.endDate} 
                      onChange={(e) => handleInputChange('anime', 'endDate', e.target.value)} 
                      className="input input-bordered w-full rounded-md" 
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium mb-1">Notes</label>
                  <textarea 
                    className="textarea textarea-bordered w-full rounded-md" 
                    value={formData.anime.notes} 
                    onChange={(e) => handleInputChange('anime', 'notes', e.target.value)} 
                    rows={3}
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