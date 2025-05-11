import { License } from '../../types';
import React, { useState, useEffect } from 'react';
import AdaptationHeader from './AdaptationHeader';
import AdaptationList from './AdaptationList';
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import { useEditMode } from '../ui/EditModeContext';

export interface AdaptationRow {
  id: string;
  type: 'season' | 'anime'; // Pour distinguer les saisons des adaptations
  seasonName: string;
  episodes: number;
  fromVolume?: number;
  toVolume?: number;
}

export interface AdaptationTableProps {
  license: License;
}

export interface AdaptationRowProps {
  row: AdaptationRow;
  index: number;
  isLastRow: boolean;
}

export interface AdaptationHeaderProps {
  title: string;
  license: License;
  onTitleChange: (newTitle: string) => void;
}

export interface AdaptationListProps {
  adaptationRows: AdaptationRow[];
}

const AdaptationTable: React.FC<AdaptationTableProps> = ({ license }) => {
  const { isEditMode } = useEditMode();
  const [currentTitle, setCurrentTitle] = useState(license.title);
  const [adaptationRows, setAdaptationRows] = useState<AdaptationRow[]>([]);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Générer les lignes d'adaptation une seule fois lors du chargement
  useEffect(() => {
    const rows: AdaptationRow[] = [];
    let debugText = 'IDs disponibles:\n';

    if (license.animeAdaptations && license.animeAdaptations.length > 0) {
      license.animeAdaptations.forEach(anime => {
        debugText += `Anime: ${anime.title}, ID: ${anime.id}\n`;
        
        if (anime.seasons && anime.seasons.length > 0) {
          anime.seasons.forEach(season => {
            debugText += `  - Saison ${season.seasonNumber}, ID: ${season.id}\n`;
            
            rows.push({
              id: season.id,
              type: 'season',
              seasonName: `${anime.title} - Saison ${season.seasonNumber}`,
              episodes: season.episodes || 0,
              fromVolume: season.coverageFromVolume,
              toVolume: season.coverageToVolume,
            });
          });
        } else {
          rows.push({
            id: anime.id,
            type: 'anime',
            seasonName: anime.title,
            episodes: anime.episodes || 0,
            fromVolume: anime.sourcedFrom && anime.sourcedFrom.length > 0 
              ? anime.sourcedFrom[0].coverageFromVolume 
              : undefined,
            toVolume: anime.sourcedFrom && anime.sourcedFrom.length > 0 
              ? anime.sourcedFrom[0].coverageToVolume 
              : undefined,
          });
        }
      });
    }

    setAdaptationRows(rows);
    setDebugInfo(debugText);
  }, [license]);

  const handleTitleChange = (newTitle: string) => {
    setCurrentTitle(newTitle);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <div className="card bg-base-100 font-bold card-border border-base-300 overflow-hidden">
      <AdaptationHeader 
        title={currentTitle}
        license={license}
        onTitleChange={handleTitleChange}
      />
      
      {/* Zone de débogage - visible en mode édition */}
      {isEditMode && (
        <div className="px-4 pt-2">
          <button 
            className="btn btn-error btn-xs btn-outline" 
            onClick={toggleDebugMode}
          >
            {debugMode ? <><ChevronsLeftRightEllipsis size={16} /> Masquer le débogage </> : <><ChevronsLeftRightEllipsis size={16} />Afficher le débogage</>}
          </button>
          
          {debugMode && debugInfo && (
            <div className="bg-gray-100 p-2 text-xs font-mono mt-2 rounded">
              <pre>{debugInfo}</pre>
            </div>
          )}
        </div>
      )}

      <div className="card-body p-4">
        <AdaptationList adaptationRows={adaptationRows} />
      </div>
    </div>
  );
};

export default AdaptationTable;