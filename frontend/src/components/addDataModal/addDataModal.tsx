import React, { useState, useEffect } from 'react';
import { X, Bookmark, AlertCircle } from 'lucide-react';
import { searchService } from '../../services';


interface AddDataModalProps {
  onClose?: () => void;
}

interface LicenseFormData {
  title: string;
  externalId: string;
}

const AddDataModal: React.FC<AddDataModalProps> = ({ onClose }) => {
  const [licenseData, setLicenseData] = useState<LicenseFormData>({
    title: '',
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

  const generateExternalId = (title: string) => {
    const ignoredWords = new Set(['the', 'a', 'of', 'and', 'in', 'on', 'to', 're']);
    const prefix = title
      .normalize("NFD").replace(/[\u0300-\u036f]/g, '') // remove accents
      .split(/\s+/)
      .filter(word => !ignoredWords.has(word.toLowerCase()))
      .map(word => word[0].toUpperCase())
      .slice(0, 3) // max 3 letters
      .join('')
      .padEnd(2, 'X'); // ensure minimum 2 letters

    const suffix = Math.floor(100 + Math.random() * 900); // 3 digits

    return `${prefix}${suffix}`;
  };

  const handleLicenseChange = (field: keyof LicenseFormData, value: any) => {
    if (field === 'title') {
      const newExternalId = generateExternalId(value);
      setLicenseData({ title: value, externalId: newExternalId });
    } else {
      setLicenseData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      // ⚠️ Vérifie côté client si le titre existe déjà
      const allLicenses = await searchService.getAllLicenses();
      const titleExists = allLicenses.some(
        (lic: any) => lic.title.toLowerCase().trim() === licenseData.title.toLowerCase().trim()
      );
  
      if (titleExists) {
        throw new Error('Une licence avec ce titre existe déjà.');
      }
  
      const res = await fetch(`${(import.meta as any).env.VITE_API_URL}/api/license`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(licenseData),
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur: ${res.statusText}`);
      }
  
      setSuccess(true);
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };  

  const closeModal = () => {
    const modal = document.getElementById('add_data_modal') as HTMLDialogElement;
    if (modal) modal.close();
    if (onClose) onClose();
  };

  return (
    <dialog id="add_data_modal" className="modal">
      <div className="modal-box w-full max-w-lg max-h-screen overflow-y-auto p-0">
        <div className="border-base-300 bg-base-200 border-b border-dashed">
          <div className="flex items-center justify-between p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bookmark size={18} /> Ajouter une licence
            </h3>
            <button className="btn btn-success btn-sm btn-ghost" onClick={closeModal}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6">
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
                <p className="text-sm text-success">Licence ajoutée avec succès !</p>
              </div>
            </div>
          )}
           
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="text-sm font-medium mb-1">Titre</label>
              <input
                type="text"
                value={licenseData.title}
                onChange={(e) => handleLicenseChange('title', e.target.value)}
                className="input input-bordered w-full rounded-md"
                required
              />
            </div>

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
