//frontend/src/components/adaptationTable/adaptationTable.tsx
import React from 'react';
import { AnimeAdaptation } from '../../types';

interface Props {
  adaptations?: AnimeAdaptation[];
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
      diverges_from_manga: 'badge-orange',
      anime_original: 'badge-purple',
      unfinished: 'badge-orange',
      hiatus: 'badge-orange',
    };
    const badgeClass = colorMap[normalized] || 'badge-default';
    return <span className={`badge ${badgeClass}`}>{value}</span>;
  };

  // Organisation en groupes de séries reliées
  const organizeAdaptations = (
    adaptations: AnimeAdaptation[],
  ): AnimeAdaptation[][] => {
    const seriesGroups: AnimeAdaptation[][] = [];
    const processedIds = new Set<string>();

    adaptations.forEach((anime) => {
      if (
        !processedIds.has(anime.id) &&
        (!anime.relation_type ||
          anime.relation_type === 'original' ||
          anime.relation_type === 'reboot')
      ) {
        const group = [anime];
        processedIds.add(anime.id);

        let hasAddedMore = true;
        while (hasAddedMore) {
          hasAddedMore = false;
          adaptations.forEach((related) => {
            if (
              !processedIds.has(related.id) &&
              related.related_to &&
              group.some((a) => a.id === related.related_to)
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
              {group[0].status && renderBadge(group[0].status)}
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
                  if (anime.seasons) {
                    return anime.seasons.map((season, seasonIndex) => {
                      // Utilise la propriété coverage de Season
                      const volumeRange = season.coverage?.manga_volumes || [0, 0];
                      const hasNotes =
                        season.notes && season.notes.trim() !== '';

                      return (
                        <tr key={`anime-${anime.id}-season-${seasonIndex}`}>
                          <td className={hasNotes ? 'has-tooltip' : ''}>
                            {hasNotes && <span className="info-icon"></span>}{' '}
                            Saison {season.season}
                            {hasNotes && (
                              <div className="tooltip-content tooltip-left">
                                {season.notes}
                              </div>
                            )}
                          </td>
                          <td>{season.episodes}</td>
                          <td>
                            {volumeRange[0]}-{volumeRange[1]}
                          </td>
                        </tr>
                      );
                    });
                  } else {
                    // Pour les anime sans saisons, utilise le tableau coverage
                    // Recherche des plages de volume dans le tableau coverage ou utilise la valeur par défaut
                    let volumeStart = 0;
                    let volumeEnd = 0;
                    
                    // Si coverage existe et contient des éléments
                    if (anime.coverage && anime.coverage.length > 0) {
                      // Obtient la première et dernière valeur dans le tableau coverage
                      const firstCoverage = anime.coverage[0];
                      const lastCoverage = anime.coverage[anime.coverage.length - 1];
                      
                      // Utilise manga_volumes s'il existe, sinon utilise volumeStart/volumeEnd
                      if (firstCoverage.manga_volumes) {
                        volumeStart = firstCoverage.manga_volumes[0];
                      } else {
                        volumeStart = firstCoverage.volumeStart;
                      }
                      
                      if (lastCoverage.manga_volumes) {
                        volumeEnd = lastCoverage.manga_volumes[1];
                      } else {
                        volumeEnd = lastCoverage.volumeEnd;
                      }
                    }
                    
                    const volumeRange = [volumeStart, volumeEnd];
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
                          {volumeRange[0]}-{volumeRange[1]}
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