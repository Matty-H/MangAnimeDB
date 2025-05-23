import React, { useRef, useEffect, useState } from 'react';
import { Play, Square, Pause, XCircle, CheckCircle, X, PenTool, Info } from 'lucide-react';

// Types énumérés simulés pour la démo
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
  minFontSize?: number;
}

// Renvoie une icône selon le type de contenu et la valeur
const getIconForLabel = (contentType: BadgeContentType, value: any): React.ReactNode => {
  if (contentType === 'status') {
    switch (value) {
      case WorkStatus.ONGOING: return <Play size={14} />;
      case WorkStatus.COMPLETED: return <Square size={14} />;
      case WorkStatus.HIATUS: return <Pause size={14} />;
      case WorkStatus.UNFINISHED: return <XCircle size={14} />;
      default: return <Info size={14} />;
    }
  }

  if (contentType === 'fidelity') {
    switch (value) {
      case AnimeFidelity.FAITHFUL: return <CheckCircle size={14} />;
      case AnimeFidelity.PARTIAL: return <X size={14} />;
      case AnimeFidelity.ANIME_ORIGINAL: return <PenTool size={14} />;
      default: return <Info size={14} />;
    }
  }

  return <Info size={14} />;
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

// Hook personnalisé pour ajuster la taille du texte
const useResponsiveText = (
  textRef: React.RefObject<HTMLSpanElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  minFontSize: number = 10
) => {
  const [fontSize, setFontSize] = useState<number>(14);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!textRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const text = textRef.current;
      
      const containerWidth = container.offsetWidth;
      const availableWidth = containerWidth - 32 - 16 - 8;
      
      text.style.fontSize = '14px';
      let currentFontSize = 14;
      
      while (text.scrollWidth > availableWidth && currentFontSize > minFontSize) {
        currentFontSize -= 0.5;
        text.style.fontSize = `${currentFontSize}px`;
      }
      
      setFontSize(currentFontSize);
    };

    adjustFontSize();

    const resizeObserver = new ResizeObserver(adjustFontSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [textRef, containerRef, minFontSize]);

  return fontSize;
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
  minFontSize = 10,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  
  const fontSize = useResponsiveText(textRef, containerRef, minFontSize);

  // Fonction pour déterminer automatiquement la variante selon le contenu
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

  // Fonction pour obtenir les classes Tailwind selon la variante
  const getVariantClasses = (): string => {
    const actualVariant = contentType !== 'custom' ? getAutoVariant() : variant;
    
    if (outlined) {
      switch (actualVariant) {
        case 'primary':
          return 'border-2 border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100';
        case 'secondary':
          return 'border-2 border-gray-400 text-gray-700 bg-gray-50 hover:bg-gray-100';
        case 'accent':
          return 'border-2 border-purple-500 text-purple-700 bg-purple-50 hover:bg-purple-100';
        case 'success':
          return 'border-2 border-green-500 text-green-700 bg-green-50 hover:bg-green-100';
        case 'warning':
          return 'border-2 border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100';
        case 'error':
          return 'border-2 border-red-500 text-red-700 bg-red-50 hover:bg-red-100';
        case 'info':
          return 'border-2 border-cyan-500 text-cyan-700 bg-cyan-50 hover:bg-cyan-100';
        default:
          return 'border-2 border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100';
      }
    } else {
      switch (actualVariant) {
        case 'primary':
          return 'bg-blue-500 text-white hover:bg-blue-600';
        case 'secondary':
          return 'bg-gray-500 text-white hover:bg-gray-600';
        case 'accent':
          return 'bg-purple-500 text-white hover:bg-purple-600';
        case 'success':
          return 'bg-green-500 text-white hover:bg-green-600';
        case 'warning':
          return 'bg-yellow-500 text-white hover:bg-yellow-600';
        case 'error':
          return 'bg-red-500 text-white hover:bg-red-600';
        case 'info':
          return 'bg-cyan-500 text-white hover:bg-cyan-600';
        default:
          return 'bg-gray-400 text-white hover:bg-gray-500';
      }
    }
  };

  // Fonction pour obtenir les classes de taille
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs rounded-md';
      case 'lg':
        return 'px-4 py-2 text-base rounded-lg';
      default:
        return 'px-3 py-1.5 text-sm rounded-md';
    }
  };

  const formattedLabel = getFormattedLabel(contentType, value, label);
  if (!formattedLabel && formattedLabel !== 0) return null;

  return (
    <div
      ref={containerRef}
      className={`
        inline-flex items-center gap-1.5 font-medium transition-all duration-200
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : {}}
    >
      {getIconForLabel(contentType, value)}
      <span 
        ref={textRef}
        className="transition-all duration-200 whitespace-nowrap overflow-hidden"
        style={{ fontSize: `${fontSize}px` }}
      >
        {formattedLabel}
      </span>
    </div>
  );
};

// Composant de démonstration
const BadgeDemo = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Badge Component - Démonstration</h1>
        
        {/* Status Badges */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge contentType="status" value={WorkStatus.ONGOING} />
            <Badge contentType="status" value={WorkStatus.COMPLETED} />
            <Badge contentType="status" value={WorkStatus.HIATUS} />
            <Badge contentType="status" value={WorkStatus.UNFINISHED} />
          </div>
        </div>

        {/* Fidelity Badges */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Fidelity Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge contentType="fidelity" value={AnimeFidelity.FAITHFUL} />
            <Badge contentType="fidelity" value={AnimeFidelity.PARTIAL} />
            <Badge contentType="fidelity" value={AnimeFidelity.ANIME_ORIGINAL} />
          </div>
        </div>

        {/* Relation Type Badges */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Relation Type Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge contentType="relationType" value={RelationType.ORIGINAL} />
            <Badge contentType="relationType" value={RelationType.SEQUEL} />
            <Badge contentType="relationType" value={RelationType.PREQUEL} />
            <Badge contentType="relationType" value={RelationType.REMAKE} />
            <Badge contentType="relationType" value={RelationType.SPIN_OFF} />
            <Badge contentType="relationType" value={RelationType.REBOOT} />
          </div>
        </div>

        {/* Outlined Variants */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Outlined Variants</h2>
          <div className="flex flex-wrap gap-3">
            <Badge contentType="status" value={WorkStatus.ONGOING} outlined />
            <Badge contentType="status" value={WorkStatus.COMPLETED} outlined />
            <Badge contentType="fidelity" value={AnimeFidelity.FAITHFUL} outlined />
            <Badge contentType="fidelity" value={AnimeFidelity.PARTIAL} outlined />
          </div>
        </div>

        {/* Different Sizes */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Different Sizes</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge contentType="status" value={WorkStatus.ONGOING} size="sm" />
            <Badge contentType="status" value={WorkStatus.ONGOING} size="md" />
            <Badge contentType="status" value={WorkStatus.ONGOING} size="lg" />
          </div>
        </div>

        {/* Custom Badges */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Badges</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary" label="Custom Primary" />
            <Badge variant="info" label="Custom Info" outlined />
            <Badge variant="warning" label="Custom Warning" size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Export du composant Badge comme défaut
export default Badge;