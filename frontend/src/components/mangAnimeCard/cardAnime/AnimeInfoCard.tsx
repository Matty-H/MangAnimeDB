//frontend/src/components/cardAnime/AnimeInfoCard.tsx - Version simplifiée
import React from 'react';
import GenericInfoCard from '../GenericInfoCard';
import AnimeDisplayInfo from './AnimeDisplayInfo';
import AnimeEditForm from './AnimeEditForm';

interface AnimeInfoCardProps {
  anime?: any;
  licenseId: string;
  isEmptyTemplate?: boolean;
  onAnimeUpdated?: (updatedAnime: any) => void;
  onAnimeDeleted?: (animeId: string) => void;
}

const AnimeInfoCard: React.FC<AnimeInfoCardProps> = ({
  anime,
  licenseId,
  isEmptyTemplate = false,
  onAnimeUpdated,
  onAnimeDeleted
}) => {
  const getTitle = (anime: any) => anime?.title || 'Sans titre';
  const getSubtitle = (anime: any) => anime?.studio || '';
  
  const createDefaultAnime = (licenseId: string) => ({
    licenseId: licenseId,
    title: "Nouvel anime",
    studio: "Studio à déterminer",
    adaptationType: "TV_SERIES",
    status: "ONGOING",
    fidelity: "FAITHFUL",
    relationType: "MANGA_ADAPTATION"
  });

  const handleSeasonsUpdated = (updatedSeasons: any) => {
    if (onAnimeUpdated && anime) {
      const updatedAnime = {
        ...anime,
        seasons: updatedSeasons
      };
      onAnimeUpdated(updatedAnime);
    }
  };

  return (
    <GenericInfoCard
      type="anime"
      item={anime}
      licenseId={licenseId}
      isEmptyTemplate={isEmptyTemplate}
      onUpdate={onAnimeUpdated}
      onDeleted={onAnimeDeleted}
      getTitle={getTitle}
      getSubtitle={getSubtitle}
      createDefaultItem={createDefaultAnime}
      DisplayComponent={({ item, onUpdate }) => (
        <AnimeDisplayInfo
          anime={item}
          onSeasonsUpdated={handleSeasonsUpdated}
        />
      )}
      EditComponent={({ item, onFieldChange }) => (
        <AnimeEditForm
          editedAnime={item}
          onFieldChange={onFieldChange}
        />
      )}
      subtitlePlaceholder="Studio"
    />
  );
};

export default AnimeInfoCard;