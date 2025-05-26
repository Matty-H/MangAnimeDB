//frontend/src/components/cardManga/MangaPartsManager.tsx
import React from 'react';
import GenericItemManager, { ItemConfig } from '../GenericItemManager';
import { searchService } from '../../../services';
import { MangaWork, WorkStatus, MangaPart } from '../../../types';

interface MangaPartsManagerProps {
  manga: MangaWork;
  licenseId: string;
  onUpdate: (updatedManga: MangaWork) => void;
  setParentError: (error: string | null) => void;
  setParentApiResponse: (message: string) => void;
}

const createMangaPartConfig = (mangaId: string, licenseId: string): ItemConfig<MangaPart> => ({
  itemName: 'partie',
  itemNamePlural: 'parties',
  addButtonText: 'Ajouter une partie/arc',
  
  createItem: (part: Partial<MangaPart>) => {
    const volumes = (part.endVolume || 1) - (part.startVolume || 1) + 1;
    return searchService.createMangaPart({
      ...part,
      mangaId,
      licenseId,
      volumes
    });
  },
  
  updateItem: (id: string, part: Partial<MangaPart>) => 
    searchService.updateMangaPart(id, {
      ...part,
      mangaId,
      licenseId
    }),
  
  deleteItem: (id: string) => 
    searchService.deleteMangaPart(id),
  
  formFields: [
    {
      name: 'title',
      label: 'Titre de la partie',
      type: 'text',
      required: true,
      colSpan: 2,
      placeholder: 'Exemple: Arc Skypiea'
    },
    {
      name: 'partNumber',
      label: 'Numéro',
      type: 'number',
      required: true,
      colSpan: 1
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      required: true,
      colSpan: 1,
      options: Object.values(WorkStatus).map(status => ({
        value: status,
        label: status
      }))
    },
    {
      name: 'startVolume',
      label: 'Tome début',
      type: 'number',
      required: true,
      colSpan: 1
    },
    {
      name: 'endVolume',
      label: 'Tome fin',
      type: 'number',
      required: true,
      colSpan: 1
    }
  ],
  
  createDefaultItem: () => ({
    title: '',
    partNumber: 1,
    startVolume: 1,
    endVolume: 1,
    status: WorkStatus.ONGOING
  }),
  
  renderListItem: (part: MangaPart) => ({
    title: part.title,
    subtitle: `Tomes ${part.startVolume}-${part.endVolume} (${part.volumes} tomes)`,
    badges: [
      { type: 'status', value: part.status }
    ]
  }),
  
  validateItem: (part: Partial<MangaPart>) => {
    if (!part.title?.trim()) {
      return 'Le titre est obligatoire';
    }
    if (!part.partNumber || part.partNumber < 1) {
      return 'Le numéro de partie doit être supérieur à 0';
    }
    if (!part.startVolume || part.startVolume < 1) {
      return 'Le tome de début doit être supérieur à 0';
    }
    if (!part.endVolume || part.endVolume < 1) {
      return 'Le tome de fin doit être supérieur à 0';
    }
    if (part.startVolume && part.endVolume && part.startVolume > part.endVolume) {
      return 'Le tome de début ne peut pas être supérieur au tome de fin';
    }
    return null;
  }
});

const MangaPartsManager: React.FC<MangaPartsManagerProps> = ({
  manga,
  licenseId,
  onUpdate,
  setParentError,
  setParentApiResponse
}) => {
  const config = createMangaPartConfig(manga.id, licenseId);

  const handleItemsUpdated = (updatedParts: MangaPart[]) => {
    onUpdate({
      ...manga,
      parts: updatedParts
    });
  };

  return (
    <GenericItemManager
      parentId={manga.id}
      items={manga.parts || []}
      config={config}
      onItemsUpdated={handleItemsUpdated}
      showDebugger={false}
    />
  );
};

export default MangaPartsManager;