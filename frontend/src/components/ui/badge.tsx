import React from 'react';
import { Play, Square, Pause, XCircle, CheckCircle, X, PenTool, Info, BookOpen } from 'lucide-react';

// Types énumérés
export enum WorkStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  HIATUS = 'HIATUS',
  UNFINISHED = 'UNFINISHED'
}

export enum AnimeFidelity {
  FAITHFUL = 'FAITHFUL',
  PARTIAL = 'PARTIAL',
  ANIME_ORIGINAL = 'ANIME_ORIGINAL'
}

export enum RelationType {
  ORIGINAL = 'ORIGINAL',
  SEQUEL = 'SEQUEL',
  PREQUEL = 'PREQUEL',
  REMAKE = 'REMAKE',
  SPIN_OFF = 'SPIN_OFF',
  REBOOT = 'REBOOT'
}

// Ajout du type Coverage
export enum Coverage {
  COMPLETE = 'COMPLETE',
  PARTIAL = 'PARTIAL',
  NONE = 'NONE'
}

export type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeContentType = 'status' | 'fidelity' | 'relationType' | 'coverage' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label?: React.ReactNode;
  className?: string;
  outlined?: boolean;
  contentType?: BadgeContentType;
  value?: WorkStatus | AnimeFidelity | RelationType | Coverage | string;
  maxWidth?: string;
}

// Configuration centralisée pour le mapping des contenus
const CONTENT_CONFIG = {
  status: {
    [WorkStatus.ONGOING]: { icon: Play, label: 'En cours', variant: 'accent' as BadgeVariant },
    [WorkStatus.COMPLETED]: { icon: Square, label: 'Terminé', variant: 'success' as BadgeVariant },
    [WorkStatus.HIATUS]: { icon: Pause, label: 'En pause', variant: 'warning' as BadgeVariant },
    [WorkStatus.UNFINISHED]: { icon: XCircle, label: 'Inachevé', variant: 'error' as BadgeVariant }
  },
  fidelity: {
    [AnimeFidelity.FAITHFUL]: { icon: CheckCircle, label: 'Fidèle', variant: 'success' as BadgeVariant },
    [AnimeFidelity.PARTIAL]: { icon: X, label: 'Peu fidèle', variant: 'warning' as BadgeVariant },
    [AnimeFidelity.ANIME_ORIGINAL]: { icon: PenTool, label: 'Original', variant: 'info' as BadgeVariant }
  },
  relationType: {
    [RelationType.ORIGINAL]: { icon: Info, label: 'Original', variant: 'secondary' as BadgeVariant },
    [RelationType.SEQUEL]: { icon: Info, label: 'Suite', variant: 'secondary' as BadgeVariant },
    [RelationType.PREQUEL]: { icon: Info, label: 'Préquelle', variant: 'secondary' as BadgeVariant },
    [RelationType.REMAKE]: { icon: Info, label: 'Remake', variant: 'secondary' as BadgeVariant },
    [RelationType.SPIN_OFF]: { icon: Info, label: 'Spin-off', variant: 'secondary' as BadgeVariant },
    [RelationType.REBOOT]: { icon: Info, label: 'Reboot', variant: 'secondary' as BadgeVariant }
  },
  // Ajout de la configuration pour coverage
  coverage: {
    [Coverage.COMPLETE]: { icon: BookOpen, label: 'Couverture complète', variant: 'success' as BadgeVariant },
    [Coverage.PARTIAL]: { icon: BookOpen, label: 'Couverture partielle', variant: 'warning' as BadgeVariant },
    [Coverage.NONE]: { icon: BookOpen, label: 'Aucune couverture', variant: 'error' as BadgeVariant }
  }
};

// Classes CSS centralisées
const VARIANT_CLASSES = {
  outlined: {
    primary: 'border-2 border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100',
    secondary: 'border-2 border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100',
    accent: 'border-2 border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-100',
    success: 'border-2 border-green-500 text-green-700 bg-green-50 hover:bg-green-100',
    warning: 'border-2 border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100',
    error: 'border-2 border-red-500 text-red-700 bg-red-50 hover:bg-red-100',
    info: 'border-2 border-cyan-500 text-cyan-700 bg-cyan-50 hover:bg-cyan-100',
    neutral: 'border-2 border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100'
  },
  solid: {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    accent: 'bg-purple-500 text-white hover:bg-purple-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    error: 'bg-red-500 text-white hover:bg-red-600',
    info: 'bg-cyan-500 text-white hover:bg-cyan-600',
    neutral: 'bg-gray-400 text-white hover:bg-gray-500'
  }
};

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs rounded-md',
  md: 'px-3 py-1.5 text-sm rounded-md',
  lg: 'px-4 py-2 text-base rounded-lg'
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  label,
  className = '',
  outlined = false,
  contentType = 'custom',
  value,
  maxWidth
}) => {
  // Fonction utilitaire pour obtenir la configuration du contenu
  const getContentConfig = () => {
    if (contentType === 'custom' || !value) {
      return { icon: Info, label: label || '', variant };
    }

    const config = CONTENT_CONFIG[contentType]?.[value as string];
    return config || { icon: Info, label: String(value), variant };
  };

  const { icon: IconComponent, label: computedLabel, variant: autoVariant } = getContentConfig();
  const finalVariant = contentType !== 'custom' ? autoVariant : variant;
  const finalLabel = contentType === 'custom' ? label : computedLabel;

  // Si pas de label à afficher, ne pas rendre le badge
  if (!finalLabel && finalLabel !== 0) return null;

  // Construction des classes CSS
  const variantClasses = VARIANT_CLASSES[outlined ? 'outlined' : 'solid'][finalVariant];
  const sizeClasses = SIZE_CLASSES[size];
  
  const combinedClasses = [
    'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
    'max-w-full', // Pour gérer l'overflow automatiquement
    variantClasses,
    sizeClasses,
    className
  ].join(' ');

  return (
    <div 
      className={combinedClasses}
      style={maxWidth ? { maxWidth } : {}}
    >
      <IconComponent size={14} className="flex-shrink-0" />
      <span className="truncate">
        {finalLabel}
      </span>
    </div>
  );
};

export default Badge;