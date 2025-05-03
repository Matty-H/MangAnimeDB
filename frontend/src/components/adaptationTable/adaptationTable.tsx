import React from 'react';
import { License } from '../../types';
import { BookOpen, Tv, ArrowRight } from 'lucide-react';

interface AdaptationTableProps {
  license: License;
}

interface AdaptationRow {
  seasonName: string;
  episodes: number;
  fromVolume?: number;
  toVolume?: number;
}

const AdaptationTable: React.FC<AdaptationTableProps> = ({ license }) => {
  const generateAdaptationRows = (): AdaptationRow[] => {
    const rows: AdaptationRow[] = [];

    license.animeAdaptations.forEach(anime => {
      if (anime.seasons && anime.seasons.length > 0) {
        anime.seasons.forEach(season => {
          rows.push({
            seasonName: `${anime.title} - Saison ${season.seasonNumber}`,
            episodes: season.episodes || 0,
            fromVolume: season.coverageFromVolume,
            toVolume: season.coverageToVolume,
          });
        });
      } else {
        const row: AdaptationRow = {
          seasonName: anime.title,
          episodes: anime.episodes || 0,
        };

        if (anime.sourcedFrom && anime.sourcedFrom.length > 0) {
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

  if (adaptationRows.length === 0) return null;

  return (
    <div className="card bg-base-100 card-border border-base-300 overflow-hidden">
      <div className="border-base-300 bg-base-200 border-b border-dashed">
        <div className="flex items-center gap-2 p-4">
          <div className="grow">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="opacity-70" />
              <ArrowRight size={16} className="opacity-50" />
              <Tv size={18} className="opacity-70" />
              <h2 className="text-lg font-medium">
                Correspondance de {license.title}
              </h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body p-4">
        <div className="rounded-lg border border-base-300 overflow-hidden">
          <div className="bg-base-200 p-3 flex font-medium text-sm">
            <div className="flex-1">Anime</div>
            <div className="w-24 text-center">Épisodes</div>
            <div className="w-32 text-center">Vol. manga</div>
          </div>
          
          {adaptationRows.map((row, index) => (
            <div 
              key={index} 
              className={`p-3 flex items-center ${
                index < adaptationRows.length - 1 ? 'border-b border-base-300 border-dashed' : ''
              }`}
            >
              <div className="flex-1">{row.seasonName}</div>
              <div className="w-24 text-center">{row.episodes}</div>
              <div className="w-32 text-center">
                {row.fromVolume && row.toVolume
                  ? `${row.fromVolume}-${row.toVolume}`
                  : row.fromVolume
                    ? `${row.fromVolume}+`
                    : row.toVolume
                      ? `Jusqu'au tome ${row.toVolume}`
                      : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdaptationTable;