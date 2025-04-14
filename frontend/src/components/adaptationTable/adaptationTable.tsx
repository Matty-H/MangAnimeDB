import React from 'react';
import { 
  License, 
  MangaWork, 
  AnimeWork,
  AnimeSeason,
  MangaToAnime
} from '../../types';
import './adaptationTable.css';

interface AdaptationTableProps {
  license: License;
}

// Define interfaces for season-to-manga correspondence
interface AdaptationRow {
  seasonName: string;
  episodes: number;
  fromVolume?: number;
  toVolume?: number;
}

const AdaptationTable: React.FC<AdaptationTableProps> = ({ license }) => {
  // Process data to create rows for the table
  const generateAdaptationRows = (): AdaptationRow[] => {
    const rows: AdaptationRow[] = [];
    
    // Process all anime adaptations
    license.animeAdaptations.forEach(anime => {
      // If anime has seasons, process each season
      if (anime.seasons && anime.seasons.length > 0) {
        anime.seasons.forEach(season => {
          const row: AdaptationRow = {
            seasonName: `${anime.title} - Saison ${season.seasonNumber}`,
            episodes: season.episodes || 0,
            fromVolume: season.coverageFromVolume,
            toVolume: season.coverageToVolume
          };
          
          rows.push(row);
        });
      } else {
        // Handle the anime as a single season
        const row: AdaptationRow = {
          seasonName: anime.title,
          episodes: anime.episodes || 0,
          fromVolume: undefined,
          toVolume: undefined
        };
        
        // Find source information if available
        if (anime.sourcedFrom && anime.sourcedFrom.length > 0) {
          // Combine all volume ranges from all sources
          let minVol: number | undefined = undefined;
          let maxVol: number | undefined = undefined;
          
          anime.sourcedFrom.forEach(source => {
            if (source.coverageFromVolume !== undefined) {
              minVol = minVol === undefined ? source.coverageFromVolume : Math.min(minVol, source.coverageFromVolume);
            }
            
            if (source.coverageToVolume !== undefined) {
              maxVol = maxVol === undefined ? source.coverageToVolume : Math.max(maxVol, source.coverageToVolume);
            }
          });
          
          row.fromVolume = minVol;
          row.toVolume = maxVol;
        }
        
        rows.push(row);
      }
    });
    
    return rows;
  };
  
  const adaptationRows = generateAdaptationRows();
  
  // If no adaptation data, return null
  if (adaptationRows.length === 0) {
    return null;
  }
  
  return (
    <div className="adaptation-table-container">
      <h3>Correspondance Manga-Anime</h3>
      <table className="adaptation-table">
        <thead>
          <tr>
            <th>Saison</th>
            <th>Nb épisodes</th>
            <th>Tomes</th>
          </tr>
        </thead>
        <tbody>
          {adaptationRows.map((row, index) => (
            <tr key={index}>
              <td>{row.seasonName}</td>
              <td>{row.episodes}</td>
              <td>
                {row.fromVolume && row.toVolume 
                  ? `${row.fromVolume}-${row.toVolume}`
                  : row.fromVolume 
                    ? `${row.fromVolume}+` 
                    : row.toVolume 
                      ? `Jusqu'au tome ${row.toVolume}` 
                      : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdaptationTable;