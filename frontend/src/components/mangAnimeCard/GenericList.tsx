//frontend/src/components/ui/GenericList.tsx
import React from 'react';
import { Pencil, Trash } from 'lucide-react';
import Badge, { BadgeContentType } from '../ui/badge';
import { useEditMode } from '../ui/EditModeContext';
import { BaseItem, ItemConfig } from './GenericItemManager';

interface GenericListProps<T extends BaseItem> {
  items: T[];
  config: ItemConfig<T>;
  onEdit: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  isLoading: boolean;
}

function GenericList<T extends BaseItem>({
  items,
  config,
  onEdit,
  onDelete,
  isLoading
}: GenericListProps<T>) {
  const { isEditMode } = useEditMode();
  
  if (items.length === 0) {
    return null;
  }

  // Fonction pour convertir le type string en BadgeContentType
  const getBadgeContentType = (type: string): BadgeContentType => {
    switch (type) {
      case 'status':
        return 'status';
      case 'fidelity':
        return 'fidelity';
      case 'relationType':
        return 'relationType';
      case 'coverage':
        return 'coverage';
      default:
        return 'custom';
    }
  };

  return (
    <div className="rounded-lg border border-base-300 overflow-hidden">
      {items.map((item, index) => {
        const { title, subtitle, badges } = config.renderListItem(item);
        
        return (
          <div
            key={item.id}
            className={`p-3 flex items-center justify-between gap-4 ${
              index < items.length - 1 ? 'border-b border-base-300 border-dashed' : ''
            }`}
          >
            <div>
              <div className="font-medium">{title}</div>
              <div className="text-xs opacity-60">{subtitle}</div>
            </div>
            
            <div className="flex gap-2 items-center">
              {badges.map((badge, badgeIndex) => (
                <Badge
                  key={badgeIndex}
                  contentType={getBadgeContentType(badge.type)}
                  value={badge.value}
                  label={badge.label}
                  size="sm"
                />
              ))}
              
              {isEditMode && (
                <div className="flex gap-1">
                  <button
                    className="btn btn-success btn-outline btn-xs"
                    onClick={() => onEdit(item.id)}
                    disabled={isLoading}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn btn-xs btn-outline text-error"
                    onClick={() => onDelete(item.id)}
                    disabled={isLoading}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GenericList;