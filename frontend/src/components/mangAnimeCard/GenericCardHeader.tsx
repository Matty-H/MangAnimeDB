//frontend/src/components/mangAnimeCard/GenericCardHeader.tsx (optimisé)
import React from 'react';
import { Pencil, Check, X, Loader } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';
import { ItemType, getTypeConfig } from './utils/typeUtils';

interface GenericHeaderProps {
  type: ItemType;
  title: string;
  subtitle?: string;
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onTitleChange: (value: string) => void;
  onSubtitleChange?: (value: string) => void;
  subtitlePlaceholder?: string;
}

const GenericCardHeader: React.FC<GenericHeaderProps> = ({
  type,
  title,
  subtitle,
  isEditing,
  isLoading,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onTitleChange,
  onSubtitleChange,
  subtitlePlaceholder
}) => {
  const { isEditMode } = useEditMode();
  const { icon: Icon, displayNameLower } = getTypeConfig(type);

  const EditingContent = () => (
    <>
      <input
        className="input input-sm max-w-xs"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={`Titre du ${displayNameLower}`}
      />
      {onSubtitleChange && (
        <input
          className="input input-sm max-w-xs"
          value={subtitle || ''}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder={subtitlePlaceholder}
        />
      )}
    </>
  );

  const DisplayContent = () => (
    <>
      <h3 className="text-lg font-medium">{title || 'Sans titre'}</h3>
      {subtitle && (
        <div className="italic opacity-70 text-sm">{subtitle}</div>
      )}
    </>
  );

  const EditingActions = () => (
    <div className="flex gap-2">
      <button
        className="btn btn-sm btn-success"
        onClick={onSave}
        disabled={isLoading}
      >
        {isLoading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
        Sauvegarder
      </button>
      <button
        className="btn btn-sm btn-outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        <X size={16} /> Annuler
      </button>
      <button
        className="btn btn-sm btn-error"
        onClick={onDelete}
        disabled={isLoading}
      >
        Supprimer
      </button>
    </div>
  );

  const DisplayActions = () => (
    <button className="btn btn-success btn-sm btn-outline" onClick={onEdit}>
      <Pencil size={16} /> Éditer
    </button>
  );

  return (
    <div className="border-base-300 bg-base-200 border-b border-dashed">
      <div className="flex items-center gap-2 p-4">
        <Icon size={18} className="opacity-70" />
        <div className="grow">
          <div className="flex items-center justify-between">
            {isEditing ? <EditingContent /> : <DisplayContent />}
          </div>
        </div>
        {isEditMode && (
          <div>
            {isEditing ? <EditingActions /> : <DisplayActions />}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericCardHeader;