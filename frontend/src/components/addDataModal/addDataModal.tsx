// frontend/src/components/addDataModal/addDataModal.tsx
import React, { useState, useEffect } from 'react';
import { WorkStatus, AnimeFidelity, RelationType } from '../../types';
import './addDataModal.css';

interface AddDataModalProps {
  onClose: () => void;
}

interface License {
  id: string;
  title: string;
}

type EntityType = 'license' | 'manga' | 'anime';

interface FormData {
  license: {
    title: string;
    externalId: string;
  };
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
  const [loadingLicenses, setLoadingLicenses] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    license: {
      title: '',
      externalId: '',
    },
    manga: {
      licenseId: '',
      title: '',
      authors: '',
      volumes: 0,
      status: WorkStatus.ONGOING,
      startDate: '',
      endDate: '',
      publisher: '',
      externalId: '',
    },
    anime: {
      licenseId: '',
      title: '',
      studio: '',
      episodes: 0,
      status: WorkStatus.ONGOING,
      startDate: '',
      endDate: '',
      fidelity: AnimeFidelity.FAITHFUL,
      relationType: RelationType.ORIGINAL,
      notes: '',
      externalId: '',
    },
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
        console.error('Erreur de récupération des licences:', err);
      }
    };

    fetchLicenses();
  }, []);

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
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
        dataToSubmit = {
          ...mangaData,
          authors: mangaData.authors.split(',').map((a) => a.trim()),
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
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Ajouter une nouvelle entrée</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="entity-selector">
          {['license', 'manga', 'anime'].map((type) => (
            <button
              key={type}
              className={`entity-button ${entityType === type ? 'active' : ''}`}
              onClick={() => setEntityType(type as EntityType)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Entrée ajoutée avec succès!</div>}

        <form onSubmit={handleSubmit}>
          {entityType === 'license' && (
            <div className="form-section">
              <div className="form-field">
                <label>Titre</label>
                <input
                  type="text"
                  value={formData.license.title}
                  onChange={(e) => handleInputChange('license', 'title', e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>ID Externe</label>
                <input
                  type="text"
                  value={formData.license.externalId}
                  onChange={(e) => handleInputChange('license', 'externalId', e.target.value)}
                />
              </div>
            </div>
          )}

          {entityType === 'manga' && (
            <div className="form-section">
              <div className="form-field">
              <label>Licence</label>
                <select
                    value={formData.manga.licenseId}
                    onChange={(e) => handleInputChange('manga', 'licenseId', e.target.value)}
                    required
                >
                    <option value="">-- Sélectionner une licence --</option>
                    {licenses.map((l) => (
                    <option key={l.id} value={l.id}>
                        {l.title}
                    </option>
                    ))}
                </select>
              </div>
              <div className="form-field">
                <label>Titre</label>
                <input
                  type="text"
                  value={formData.manga.title}
                  onChange={(e) => handleInputChange('manga', 'title', e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Auteurs (séparés par virgule)</label>
                <input
                  type="text"
                  value={formData.manga.authors}
                  onChange={(e) => handleInputChange('manga', 'authors', e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Volumes</label>
                <input
                  type="number"
                  min="0"
                  value={formData.manga.volumes}
                  onChange={(e) => handleInputChange('manga', 'volumes', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="form-field">
                <label>Statut</label>
                <select
                  value={formData.manga.status}
                  onChange={(e) => handleInputChange('manga', 'status', e.target.value as WorkStatus)}
                >
                  {Object.values(WorkStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Début</label>
                <input type="date" value={formData.manga.startDate} onChange={(e) => handleInputChange('manga', 'startDate', e.target.value)} />
              </div>
              <div className="form-field">
                <label>Fin</label>
                <input type="date" value={formData.manga.endDate} onChange={(e) => handleInputChange('manga', 'endDate', e.target.value)} />
              </div>
              <div className="form-field">
                <label>Éditeur</label>
                <input type="text" value={formData.manga.publisher} onChange={(e) => handleInputChange('manga', 'publisher', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>ID Externe</label>
                <input type="text" value={formData.manga.externalId} onChange={(e) => handleInputChange('manga', 'externalId', e.target.value)} />
              </div>
            </div>
          )}

          {entityType === 'anime' && (
            <div className="form-section">
              <div className="form-field">
                <label>Licence</label>
                <select
                  value={formData.anime.licenseId}
                  onChange={(e) => handleInputChange('anime', 'licenseId', e.target.value)}
                  required
                >
                  <option value="">-- Sélectionner une licence --</option>
                  {licenses.map((l) => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Titre</label>
                <input type="text" value={formData.anime.title} onChange={(e) => handleInputChange('anime', 'title', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Studio</label>
                <input type="text" value={formData.anime.studio} onChange={(e) => handleInputChange('anime', 'studio', e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Épisodes</label>
                <input type="number" min="0" value={formData.anime.episodes} onChange={(e) => handleInputChange('anime', 'episodes', parseInt(e.target.value))} required />
              </div>
              <div className="form-field">
                <label>Statut</label>
                <select value={formData.anime.status} onChange={(e) => handleInputChange('anime', 'status', e.target.value as WorkStatus)}>
                  {Object.values(WorkStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Fidélité</label>
                <select value={formData.anime.fidelity} onChange={(e) => handleInputChange('anime', 'fidelity', e.target.value as AnimeFidelity)}>
                  {Object.values(AnimeFidelity).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Type de relation</label>
                <select value={formData.anime.relationType} onChange={(e) => handleInputChange('anime', 'relationType', e.target.value as RelationType)}>
                  {Object.values(RelationType).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Début</label>
                <input type="date" value={formData.anime.startDate} onChange={(e) => handleInputChange('anime', 'startDate', e.target.value)} />
              </div>
              <div className="form-field">
                <label>Fin</label>
                <input type="date" value={formData.anime.endDate} onChange={(e) => handleInputChange('anime', 'endDate', e.target.value)} />
              </div>
              <div className="form-field">
                <label>Notes</label>
                <textarea value={formData.anime.notes} onChange={(e) => handleInputChange('anime', 'notes', e.target.value)} />
              </div>
              <div className="form-field">
                <label>ID Externe</label>
                <input type="text" value={formData.anime.externalId} onChange={(e) => handleInputChange('anime', 'externalId', e.target.value)} />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Annuler</button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDataModal;
