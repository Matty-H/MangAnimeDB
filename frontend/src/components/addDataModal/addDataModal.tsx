import React, { useState, useEffect, JSX } from 'react';
import { WorkStatus, AnimeFidelity, RelationType } from '../../types';

interface AddDataModalProps {
  onClose: () => void;
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
    publisher: string;
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
    externalId: string;
  };
}

const AddDataModal: React.FC<AddDataModalProps> = ({ onClose }) => {
  const [entityType, setEntityType] = useState<EntityType>('license');
  const [licenses, setLicenses] = useState<License[]>([]);
  const [formData, setFormData] = useState<FormData>({
    license: { title: '', externalId: '' },
    manga: {
      licenseId: '', title: '', authors: '', volumes: 0, status: WorkStatus.ONGOING,
      startDate: '', endDate: '', publisher: '', externalId: ''
    },
    anime: {
      licenseId: '', title: '', studio: '', episodes: 0, status: WorkStatus.ONGOING,
      startDate: '', endDate: '', fidelity: AnimeFidelity.FAITHFUL,
      relationType: RelationType.ORIGINAL, notes: '', externalId: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        const mangaData = formData.manga;
        dataToSubmit = { ...mangaData, authors: mangaData.authors.split(',').map(a => a.trim()) };
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
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (label: string, input: JSX.Element) => (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      {input}
    </div>
  );

  const inputClass = "input input-bordered w-full";

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Ajouter une nouvelle entrée</h3>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {['license', 'manga', 'anime'].map((type) => (
            <button
              key={type}
              className={`btn ${entityType === type ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setEntityType(type as EntityType)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error mb-4">{error}</div>}
        {success && <div className="alert alert-success mb-4">Entrée ajoutée avec succès !</div>}

        <form onSubmit={handleSubmit}>
          {entityType === 'license' && (
            <>
              {renderField("Titre", <input type="text" value={formData.license.title} onChange={(e) => handleInputChange('license', 'title', e.target.value)} className={inputClass} required />)}
              {renderField("ID Externe", <input type="text" value={formData.license.externalId} onChange={(e) => handleInputChange('license', 'externalId', e.target.value)} className={inputClass} />)}
            </>
          )}

          {entityType === 'manga' && (
            <>
              {renderField("Licence", (
                <select className="select select-bordered w-full" value={formData.manga.licenseId} onChange={(e) => handleInputChange('manga', 'licenseId', e.target.value)} required>
                  <option value="">-- Sélectionner une licence --</option>
                  {licenses.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              ))}
              {renderField("Titre", <input type="text" value={formData.manga.title} onChange={(e) => handleInputChange('manga', 'title', e.target.value)} className={inputClass} required />)}
              {renderField("Auteurs (séparés par virgule)", <input type="text" value={formData.manga.authors} onChange={(e) => handleInputChange('manga', 'authors', e.target.value)} className={inputClass} required />)}
              {renderField("Volumes", <input type="number" min="0" value={formData.manga.volumes} onChange={(e) => handleInputChange('manga', 'volumes', parseInt(e.target.value))} className={inputClass} required />)}
              {renderField("Statut", (
                <select className="select select-bordered w-full" value={formData.manga.status} onChange={(e) => handleInputChange('manga', 'status', e.target.value)}>
                  {Object.values(WorkStatus).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ))}
              {renderField("Début", <input type="date" value={formData.manga.startDate} onChange={(e) => handleInputChange('manga', 'startDate', e.target.value)} className={inputClass} />)}
              {renderField("Fin", <input type="date" value={formData.manga.endDate} onChange={(e) => handleInputChange('manga', 'endDate', e.target.value)} className={inputClass} />)}
              {renderField("Éditeur", <input type="text" value={formData.manga.publisher} onChange={(e) => handleInputChange('manga', 'publisher', e.target.value)} className={inputClass} required />)}
              {renderField("ID Externe", <input type="text" value={formData.manga.externalId} onChange={(e) => handleInputChange('manga', 'externalId', e.target.value)} className={inputClass} />)}
            </>
          )}

          {entityType === 'anime' && (
            <>
              {renderField("Licence", (
                <select className="select select-bordered w-full" value={formData.anime.licenseId} onChange={(e) => handleInputChange('anime', 'licenseId', e.target.value)} required>
                  <option value="">-- Sélectionner une licence --</option>
                  {licenses.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              ))}
              {renderField("Titre", <input type="text" value={formData.anime.title} onChange={(e) => handleInputChange('anime', 'title', e.target.value)} className={inputClass} required />)}
              {renderField("Studio", <input type="text" value={formData.anime.studio} onChange={(e) => handleInputChange('anime', 'studio', e.target.value)} className={inputClass} required />)}
              {renderField("Épisodes", <input type="number" min="0" value={formData.anime.episodes} onChange={(e) => handleInputChange('anime', 'episodes', parseInt(e.target.value))} className={inputClass} required />)}
              {renderField("Statut", (
                <select className="select select-bordered w-full" value={formData.anime.status} onChange={(e) => handleInputChange('anime', 'status', e.target.value)}>
                  {Object.values(WorkStatus).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              ))}
              {renderField("Fidélité", (
                <select className="select select-bordered w-full" value={formData.anime.fidelity} onChange={(e) => handleInputChange('anime', 'fidelity', e.target.value)}>
                  {Object.values(AnimeFidelity).map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              ))}
              {renderField("Type de relation", (
                <select className="select select-bordered w-full" value={formData.anime.relationType} onChange={(e) => handleInputChange('anime', 'relationType', e.target.value)}>
                  {Object.values(RelationType).map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              ))}
              {renderField("Début", <input type="date" value={formData.anime.startDate} onChange={(e) => handleInputChange('anime', 'startDate', e.target.value)} className={inputClass} />)}
              {renderField("Fin", <input type="date" value={formData.anime.endDate} onChange={(e) => handleInputChange('anime', 'endDate', e.target.value)} className={inputClass} />)}
              {renderField("Notes", <textarea className="textarea textarea-bordered w-full" value={formData.anime.notes} onChange={(e) => handleInputChange('anime', 'notes', e.target.value)} />)}
              {renderField("ID Externe", <input type="text" value={formData.anime.externalId} onChange={(e) => handleInputChange('anime', 'externalId', e.target.value)} className={inputClass} />)}
            </>
          )}

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddDataModal;
