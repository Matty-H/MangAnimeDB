import React from 'react';
import { WorkStatus, AnimeFidelity, RelationType } from '../../../types';
import { Play, Square, Pause, XCircle, CheckCircle, X, PenTool, Info } from 'lucide-react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export type BadgeSize = 'sm' | 'md' | 'lg';

export type BadgeContentType = 'status' | 'fidelity' | 'relationType' | 'coverage' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label?: React.ReactNode;
  className?: string;
  outlined?: boolean;
  contentType?: BadgeContentType;
  value?: WorkStatus | AnimeFidelity | RelationType | string;
  maxWidth?: number;
}

// Abréviations inutilisées ici, mais conservées si besoin futur
const getShortLabel = (value: string): string => {
  const abbreviations: Record<string, string> = {
    'En cours': 'EC',
    'Terminé': 'T',
    'En pause': 'EP',
    'Inachevé': 'I',
    'Fidèle': 'F',
    'Peu fidèle': 'PF',
    'Original': 'O',
    'Suite': 'S',
    'Préquelle': 'PQ',
    'Remake': 'RM',
    'Spin-off': 'SO',
    'Reboot': 'RB',
  };
  return abbreviations[value] || value.substring(0, 2);
};

// Renvoie une icône selon le type de contenu et la valeur
const getIconForLabel = (contentType: BadgeContentType, value: any): React.ReactNode => {
  if (contentType === 'status') {
    switch (value) {
      case WorkStatus.ONGOING: return <Play size={16} />;
      case WorkStatus.COMPLETED: return <Square size={16} />;
      case WorkStatus.HIATUS: return <Pause size={16} />;
      case WorkStatus.UNFINISHED: return <XCircle size={16} />;
      default: return <Info size={16} />;
    }
  }

  if (contentType === 'fidelity') {
    switch (value) {
      case AnimeFidelity.FAITHFUL: return <CheckCircle size={16} />;
      case AnimeFidelity.PARTIAL: return <X size={16} />;
      case AnimeFidelity.ANIME_ORIGINAL: return <PenTool size={16} />;
      default: return <Info size={16} />;
    }
  }

  return <Info size={16} />;
};

// Renvoie un label formaté selon la valeur et le type
const getFormattedLabel = (
  contentType: BadgeContentType,
  value?: WorkStatus | AnimeFidelity | RelationType | string,
  label?: React.ReactNode
): React.ReactNode => {
  if (contentType === 'custom' || (label && label !== value)) return label;

  if (!value) return label || '';

  switch (contentType) {
    case 'status':
      switch (value) {
        case WorkStatus.ONGOING: return 'En cours';
        case WorkStatus.COMPLETED: return 'Terminé';
        case WorkStatus.HIATUS: return 'En pause';
        case WorkStatus.UNFINISHED: return 'Inachevé';
        default: return String(value);
      }
    case 'fidelity':
      switch (value) {
        case AnimeFidelity.FAITHFUL: return 'Fidèle';
        case AnimeFidelity.PARTIAL: return 'Peu fidèle';
        case AnimeFidelity.ANIME_ORIGINAL: return 'Original';
        default: return String(value).replace('_', ' ');
      }
    case 'relationType':
      switch (value) {
        case RelationType.ORIGINAL: return 'Original';
        case RelationType.SEQUEL: return 'Suite';
        case RelationType.PREQUEL: return 'Préquelle';
        case RelationType.REMAKE: return 'Remake';
        case RelationType.SPIN_OFF: return 'Spin-off';
        case RelationType.REBOOT: return 'Reboot';
        default: return String(value).replace('_', ' ');
      }
    default:
      return label;
  }
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  label,
  className = '',
  outlined = false,
  contentType = 'custom',
  value,
  maxWidth,
}) => {
  const getAutoVariant = (): BadgeVariant => {
    if (!value) return variant;

    switch (contentType) {
      case 'status':
        switch (value) {
          case WorkStatus.ONGOING: return 'accent';
          case WorkStatus.COMPLETED: return 'success';
          case WorkStatus.HIATUS: return 'warning';
          case WorkStatus.UNFINISHED: return 'error';
          default: return 'neutral';
        }
      case 'fidelity':
        switch (value) {
          case AnimeFidelity.FAITHFUL: return 'success';
          case AnimeFidelity.PARTIAL: return 'warning';
          case AnimeFidelity.ANIME_ORIGINAL: return 'info';
          default: return 'neutral';
        }
      case 'relationType':
      case 'coverage':
        return 'secondary';
      default:
        return variant;
    }
  };

  const getVariantClass = (): string => {
    const actualVariant = contentType !== 'custom' ? getAutoVariant() : variant;
    const baseClass = outlined ? 'badge-outline badge-' : 'badge-';
    return `${baseClass}${actualVariant}`;
  };

  const getSizeClass = (): string => {
    switch (size) {
      case 'sm': return 'badge-sm';
      case 'lg': return 'badge-lg';
      default: return '';
    }
  };

  const formattedLabel = getFormattedLabel(contentType, value, label);
  if (!formattedLabel && formattedLabel !== 0) return null;

  return (
    <div
      className={`badge ${getVariantClass()} ${getSizeClass()} ${className} overflow-hidden whitespace-nowrap flex items-center`}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : {}}
    >
      {getIconForLabel(contentType, value)}
      <span className="ml-1">{formattedLabel}</span>
    </div>
  );
};

export default Badge;
