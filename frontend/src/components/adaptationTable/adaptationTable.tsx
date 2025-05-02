import React from 'react';
import { License } from '../../types';

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
    <div className="card bg-base-300 shadow-sm w-full my-6">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">
          Correspondance de {license.title}
        </h2>
        <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100 mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>Anime</th>
                <th>Épisodes</th>
                <th>Vol. manga</th>
              </tr>
            </thead>
            <tbody>
              {adaptationRows.map((row, index) => (
                <tr key={index} className="hover">
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
      </div>
    </div>
  );
};

export default AdaptationTable;
