import './ResultsDisplay.css';
import { MangaAnimeItem, AnimeAdaptation } from '../types'; // Importez les types depuis votre fichier de types

interface ResultsDisplayProps {
  results: MangaAnimeItem[];
}

function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) {
    return <div className="no-results">Aucun résultat à afficher. Veuillez effectuer une recherche.</div>;
  }

  // Function to generate badge styling based on status
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

  // Organise les adaptations anime en groupes de séries connexes
  const organizeAdaptations = (adaptations: AnimeAdaptation[]): AnimeAdaptation[][] => {
    const seriesGroups: AnimeAdaptation[][] = [];
    const processedIds = new Set<string>();
    
    // Trouve les séries "originales" (pas des sequels/prequels)
    adaptations.forEach(anime => {
      if (!processedIds.has(anime.id) && (!anime.relation_type || anime.relation_type === 'original' || anime.relation_type === 'reboot')) {
        const group = [anime];
        processedIds.add(anime.id);
        
        // Trouve toutes les séries liées (sequels, etc.)
        let hasAddedMore = true;
        while (hasAddedMore) {
          hasAddedMore = false;
          adaptations.forEach(relatedAnime => {
            if (!processedIds.has(relatedAnime.id) && 
                relatedAnime.related_to && 
                group.some(a => a.id === relatedAnime.related_to)) {
              group.push(relatedAnime);
              processedIds.add(relatedAnime.id);
              hasAddedMore = true;
            }
          });
        }
        
        seriesGroups.push(group);
      }
    });
    
    return seriesGroups;
  };

  return (
    <div className="results-container">
      {results.map((item) => {
        const seriesGroups = organizeAdaptations(item.anime_adaptations);
        
        return (
          <div key={item.id} className="result-card">
            <div className="manga-title-container">
              <h2>
                📚 {item.title}
                <span className="volume-count">({item.manga.volumes} tomes)</span>
                {renderBadge(item.manga.status)}
              </h2>
            </div>
            
            <div className="manga-anime-correspondence">
              {seriesGroups.map((group, groupIndex) => {
                // Obtenir le titre du groupe (utilise le titre de la première adaptation)
                const seriesTitle = group[0].title.split(':')[0]; // Prend la partie avant ":" pour avoir le titre de base
                const studio = group[0].studio; // Récupère le studio de la première adaptation du groupe
                
                return (
                  <div key={`group-${groupIndex}`} className="anime-table-container">
                    <div className='anime-title'><h3>{seriesTitle}</h3><span className="studio-label">({studio})</span></div>
                    <div className="table-wrapper">
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
                              // Adaptations avec des saisons explicites
                              return anime.seasons.map((season, seasonIndex) => {
                                const volumeRange = season.coverage?.manga_volumes || [0, 0];
                                const hasNotes = season.notes && season.notes.trim() !== '';
                                
                                return (
                                  <tr key={`anime-${anime.id}-season-${seasonIndex}`}>
                                    <td className={hasNotes ? "has-tooltip" : ""}>
                                      {hasNotes ? <span className="info-icon"></span> : null} Saison {season.season}
                                      {hasNotes && 
                                        <div className="tooltip-content tooltip-left">
                                          {season.notes}
                                        </div>
                                      }
                                    </td>
                                    <td>{season.episodes}</td>
                                    <td>{volumeRange[0]}-{volumeRange[1]}</td>
                                  </tr>
                                );
                              });
                            } else {
                              // Adaptations sans saisons explicites
                              const volumeRange = anime.coverage?.manga_volumes || [0, 0];
                              const seasonLabel = anime.title.includes(seriesTitle) && anime.title !== seriesTitle 
                                ? anime.title.replace(`${seriesTitle}:`, '').trim() 
                                : `Saison ${animeIndex + 1}`;
                              const hasNotes = anime.notes && anime.notes.trim() !== '';
                              
                              return (
                                <tr key={`anime-${anime.id}`}>
                                  <td className={hasNotes ? "has-tooltip" : ""}>
                                    {hasNotes ? <span className="info-icon"></span> : null} {seasonLabel}
                                    {hasNotes && 
                                      <div className="tooltip-content tooltip-left">
                                        {anime.notes}
                                      </div>
                                    }
                                  </td>
                                  <td>{anime.episodes}</td>
                                  <td>{volumeRange[0]}-{volumeRange[1]}</td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResultsDisplay;