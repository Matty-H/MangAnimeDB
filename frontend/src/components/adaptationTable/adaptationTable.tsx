import React from 'react';
import { AnimeWork, AnimeFidelity, WorkStatus, RelationType, AnimeSeason } from '../../types';

interface Props {
  adaptations?: AnimeWork[];
}

// Type for volume coverage - aligning with your database schema
interface VolumeCoverage {
  volumeStart: number;
  volumeEnd: number;
}

const AdaptationTable = ({ adaptations = [] }: Props) => {
  // Badge renderer
  const renderBadge = (value: string) => {
    const normalized = value.toLowerCase().replace(/\s+/g, '_');
    const colorMap: { [key: string]: string } = {
      ongoing: 'badge-green',
      completed: 'badge-gray',
      faithful: 'badge-blue',
      partial: 'badge-yellow',
      divergent: 'badge-red',
      original: 'badge-purple',
      anime_original: 'badge-purple',
      unfinished: 'badge-orange',
      hiatus: 'badge-orange',
    };
    const badgeClass = colorMap[normalized] || 'badge-default';
    return <span className={`badge ${badgeClass}`}>{value}</span>;
  };

  // Organisation en groupes de séries reliées
  const organizeAdaptations = (
    adaptations: AnimeWork[],
  ): AnimeWork[][] => {
    const seriesGroups: AnimeWork[][] = [];
    const processedIds = new Set<string>();

    adaptations.forEach((anime) => {
      if (
        !processedIds.has(anime.id) &&
        (!anime.relationType ||
          anime.relationType === RelationType.ORIGINAL ||
          anime.relationType === RelationType.REBOOT)
      ) {
        const group = [anime];
        processedIds.add(anime.id);

        let hasAddedMore = true;
        while (hasAddedMore) {
          hasAddedMore = false;
          adaptations.forEach((related) => {
            // Updated to handle the correct relation structure
            if (
              !processedIds.has(related.id) &&
              related.relationType !== RelationType.ORIGINAL &&
              related.relationType !== RelationType.REBOOT &&
              group.some((a) => a.id === related.id)
            ) {
              group.push(related);
              processedIds.add(related.id);
              hasAddedMore = true;
            }
          });
        }

        seriesGroups.push(group);
      }
    });

    return seriesGroups;
  };

  const seriesGroups = organizeAdaptations(adaptations);

  return (
    <div className="anime-table-container">
      {seriesGroups.map((group, groupIndex) => {
        const seriesTitle = group[0].title.split(':')[0];
        const studio = group[0].studio;

        return (
          <div key={`group-${groupIndex}`} className="table-wrapper">
            <div className="anime-title">
              <h3>{seriesTitle}</h3>
              {studio && <span className="studio-label">({studio})</span>}
              {group[0].status && renderBadge(
                Object.entries(WorkStatus).find(
                  ([_, value]) => value === group[0].status
                )?.[0] || String(group[0].status)
              )}
            </div>
            <table className="correspondence-table">
              <thead>
                <tr>
                  <th>Saison</th>
                  <th>Nb épisodes</th>
                  <th>Tomes</th>
                </tr>
              </thead>
              <tbody>
                {group.map((anime, animeIndex) => {
                  if (anime.seasons && anime.seasons.length > 0) {
                    return anime.seasons.map((season, seasonIndex) => {
                      const volumeStart = season.coverageFromVolume || 0;
                      const volumeEnd = season.coverageToVolume || 0;
                      const hasNotes = season.notes && season.notes.trim() !== '';

                      return (
                        <tr key={`anime-${anime.id}-season-${seasonIndex}`}>
                          <td className={hasNotes ? 'has-tooltip' : ''}>
                            {hasNotes && <span className="info-icon"></span>}{' '}
                            Saison {season.seasonNumber}
                            {hasNotes && (
                              <div className="tooltip-content tooltip-left">
                                {season.notes}
                              </div>
                            )}
                          </td>
                          <td>{season.episodes}</td>
                          <td>
                            {volumeStart}-{volumeEnd}
                          </td>
                        </tr>
                      );
                    });
                  } else {
                    // For anime without seasons data structure
                    // Find the MangaToAnime relation to get volume coverage
                    const volumeStart = 0;
                    const volumeEnd = 0;
                    
                    const seasonLabel =
                      anime.title.includes(seriesTitle) &&
                      anime.title !== seriesTitle
                        ? anime.title.replace(`${seriesTitle}:`, '').trim()
                        : `Saison ${animeIndex + 1}`;
                    const hasNotes = anime.notes && anime.notes.trim() !== '';

                    return (
                      <tr key={`anime-${anime.id}`}>
                        <td className={hasNotes ? 'has-tooltip' : ''}>
                          {hasNotes && <span className="info-icon"></span>}{' '}
                          {seasonLabel}
                          {hasNotes && (
                            <div className="tooltip-content tooltip-left">
                              {anime.notes}
                            </div>
                          )}
                        </td>
                        <td>{anime.episodes}</td>
                        <td>
                          {volumeStart}-{volumeEnd}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default AdaptationTable;