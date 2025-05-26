//frontend/src/components/mangAnimeCard/utils/typeUtils.ts
import { Film, BookOpen } from 'lucide-react';

export type ItemType = 'anime' | 'manga';

export const getTypeConfig = (type: ItemType) => ({
  icon: type === 'anime' ? Film : BookOpen,
  displayName: type === 'anime' ? 'Anime' : 'Manga',
  displayNameLower: type,
});