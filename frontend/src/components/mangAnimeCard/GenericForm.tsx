// frontend/src/components/mangAnimeCard/GenericForm.tsx
import React, { useState, useCallback, useMemo, memo } from 'react';
import { Check, X } from 'lucide-react';
import { BaseItem, ItemConfig, FormFieldConfig } from './GenericItemManager';

interface GenericFormProps<T extends BaseItem> {
  config: ItemConfig<T>;
  parentId: string;
  defaultItem?: Partial<T>;
  isEditing: boolean;
  isLoading: boolean;
  onSave: (item: Partial<T>) => void;
  onCancel: () => void;
}

// Composant mémorisé pour les champs individuels
const FormField = memo(({
  fieldConfig,
  value,
  onChange
}: {
  fieldConfig: FormFieldConfig;
  value: any;
  onChange: (value: any) => void;
}) => {
  const { name, label, type, required, options, placeholder, colSpan = 1 } = fieldConfig;
  const colClass = colSpan === 2 ? 'col-span-2' : '';

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let newValue: any = e.target.value;
    
    // Traitement par défaut pour les champs numériques
    if (type === 'number') {
      newValue = newValue === '' ? null : 
        (typeof newValue === 'string' ? parseInt(newValue, 10) : newValue);
    }
    
    // Traitement personnalisé si défini
    if (fieldConfig.processValue) {
      newValue = fieldConfig.processValue(newValue);
    }
    
    onChange(newValue);
  }, [type, fieldConfig.processValue, onChange]);

  return (
    <div className={`form-control ${colClass}`}>
      <label className="label">
        <span className="label-text text-xs">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      
      {type === 'select' ? (
        <select
          className="select select-sm select-bordered"
          value={value || ''}
          onChange={handleChange}
          required={required}
        >
          <option value="">Sélectionner...</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="input input-sm input-bordered"
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

function GenericForm<T extends BaseItem>({
  config,
  parentId,
  defaultItem,
  isEditing,
  isLoading,
  onSave,
  onCancel
}: GenericFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(() => 
    defaultItem || config.createDefaultItem()
  );

  // Mémorisation des handlers pour éviter les re-renders inutiles
  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  }, [formData, onSave]);

  // Mémorisation des champs de formulaire
  const formFields = useMemo(() => 
    config.formFields.map(fieldConfig => (
      <FormField
        key={fieldConfig.name}
        fieldConfig={fieldConfig}
        value={formData[fieldConfig.name as keyof T]}
        onChange={(value) => handleFieldChange(fieldConfig.name, value)}
      />
    )), 
    [config.formFields, formData, handleFieldChange]
  );

  // Vérification de validité du formulaire
  const isFormValid = useMemo(() => {
    return config.formFields
      .filter(field => field.required)
      .every(field => {
        const value = formData[field.name as keyof T];
        return value !== null && value !== undefined && value !== '';
      });
  }, [config.formFields, formData]);

  const formTitle = useMemo(() => 
    isEditing ? `Modifier la ${config.itemName}` : `Nouvelle ${config.itemName}`,
    [isEditing, config.itemName]
  );

  const submitButtonText = useMemo(() => 
    isEditing ? 'Sauvegarder' : 'Ajouter',
    [isEditing]
  );

  return (
    <div className="border border-base-300 rounded-lg p-3 mb-3">
      <div className="text-sm font-medium mb-2">
        {formTitle}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          {formFields}
          
          <div className="col-span-2 mt-2 flex justify-end gap-2">
            <button
              type="submit"
              className={`btn btn-sm btn-success ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !isFormValid}
            >
              {!isLoading && <Check size={16} />}
              {submitButtonText}
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
}

export default memo(GenericForm) as <T extends BaseItem>(
  props: GenericFormProps<T>
) => React.ReactElement;