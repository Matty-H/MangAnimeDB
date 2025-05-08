//frontend/src/components/cardAnime/EmptyAnimeCard.tsx
import React from 'react';
import { Season, AnimeFidelity } from './AnimeSeasonManager';
import { Check, X } from 'lucide-react';

interface SeasonFormProps {
  season?: Season;
  animeAdaptationId: string;
  seasonNumber: number;
  isEditing: boolean;
  isLoading: boolean;
  onSave: (season: Partial<Season>) => void;
  onCancel: () => void;
}

const SeasonForm: React.FC<SeasonFormProps> = ({
  season,
  animeAdaptationId,
  seasonNumber,
  isEditing,
  isLoading,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = React.useState<Partial<Season>>(
    season || {
      animeAdaptationId,
      seasonNumber,
      episodes: 12,
      fidelity: AnimeFidelity.FAITHFUL,
      coverageFromVolume: null,
      coverageToVolume: null,
      notes: ''
    }
  );

  const handleFieldChange = (field: keyof Season, value: any) => {
    // Traitement spécifique pour certains champs
    let processedValue = value;
    
    // Pour les champs numériques, s'assurer qu'ils sont bien des nombres
    if (['episodes', 'seasonNumber', 'coverageFromVolume', 'coverageToVolume'].includes(field)) {
      // Si la valeur est une chaîne non vide, la convertir en nombre
      processedValue = value === '' ? null : 
                      (typeof value === 'string' ? parseInt(value, 10) : value);
    }
    
    // Pour le champ fidelity, s'assurer qu'il est une valeur de l'enum valide
    if (field === 'fidelity') {
      // S'assurer que c'est une valeur d'enum valide (peut-être la valeur arrive comme numéro 0,1,2)
      if (typeof value === 'number') {
        const fidelityValues = ['FAITHFUL', 'PARTIAL', 'ANIME_ORIGINAL'];
        processedValue = fidelityValues[value] || value;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="border border-base-300 rounded-lg p-3 mb-3">
      <div className="text-sm font-medium mb-2">
        {isEditing ? `Modifier la saison ${season?.seasonNumber}` : 'Nouvelle saison'}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">Numéro de saison</span>
            </label>
            <input
              type="number"
              className="input input-sm input-bordered"
              value={formData.seasonNumber || ''}
              onChange={(e) => handleFieldChange('seasonNumber', parseInt(e.target.value))}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">Épisodes</span>
            </label>
            <input
              type="number"
              className="input input-sm input-bordered"
              value={formData.episodes || ''}
              onChange={(e) => handleFieldChange('episodes', parseInt(e.target.value))}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-xs">Fidélité</span>
            </label>
            <select
              className="select select-sm select-bordered"
              value={formData.fidelity}
              onChange={(e) => handleFieldChange('fidelity', e.target.value)}
              required
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
              value={formData.coverageFromVolume || ''}
              onChange={(e) => handleFieldChange(
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
              value={formData.coverageToVolume || ''}
              onChange={(e) => handleFieldChange(
                'coverageToVolume', 
                e.target.value ? parseInt(e.target.value) : null
              )}
            />
          </div>
          
          <div className="col-span-2 mt-2 flex justify-end gap-2">
            <button 
              type="submit"
              className={`btn btn-sm btn-success ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <Check size={16} /> {isEditing ? 'Sauvegarder' : 'Ajouter'}
            </button>
            <button 
              type="button"
              className="btn btn-sm btn-outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              <X size={16} /> Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeasonForm;