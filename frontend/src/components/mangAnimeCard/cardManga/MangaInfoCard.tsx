//frontend/src/components/cardManga/MangaInfoCard.tsx - Version simplifiée
import React from 'react';
import { MangaWork } from '../../../types';
import GenericInfoCard from '../GenericInfoCard';
import MangaDisplayInfo from './MangaDisplayInfo';
import MangaEditForm from './MangaEditForm';
import MangaPartsManager from './MangaPartsManager';

interface MangaInfoCardProps {
  manga?: MangaWork;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onUpdate?: (updatedManga: MangaWork) => void;
  onAddManga?: () => void;
  onMangaDeleted?: (mangaId: string) => void;
}

const MangaInfoCard: React.FC<MangaInfoCardProps> = ({ 
  manga, 
  licenseId, 
  isEmptyTemplate = false,
  onUpdate,
  onAddManga,
  onMangaDeleted
}) => {
  const getTitle = (manga: MangaWork) => manga?.title || 'Sans titre';
  const getSubtitle = (manga: MangaWork) => manga?.publisher || '';
  
  const createDefaultManga = (licenseId: string) => ({
    licenseId: licenseId,
    title: 'Nouveau manga',
    authors: [],
    volumes: 0,
    status: 'ONGOING',
    startDate: null,
    endDate: null,
    publisher: ''
  });

  const handleMangaPartsUpdate = (updatedManga: MangaWork) => {
    if (onUpdate) onUpdate(updatedManga);
  };

  return (
    <GenericInfoCard
      type="manga"
      item={manga}
      licenseId={licenseId}
      isEmptyTemplate={isEmptyTemplate}
      onUpdate={onUpdate}
      onDeleted={onMangaDeleted}
      getTitle={getTitle}
      getSubtitle={getSubtitle}
      createDefaultItem={createDefaultManga}
      DisplayComponent={({ item, onUpdate }) => (
        <>
          <MangaDisplayInfo manga={item} />
          <MangaPartsManager 
            manga={item}
            licenseId={licenseId}
            onUpdate={handleMangaPartsUpdate}
            setParentError={() => {}}
            setParentApiResponse={() => {}}
          />
        </>
      )}
      EditComponent={({ item, onFieldChange }) => (
        <MangaEditForm
          manga={item}
          onFieldChange={onFieldChange}
        />
      )}
      subtitlePlaceholder="Éditeur"
    />
  );
};

export default MangaInfoCard;