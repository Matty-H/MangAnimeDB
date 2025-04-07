// ResultsDisplay.tsx
import { MangaAnimeItem } from '../types';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  results: MangaAnimeItem[];
}

function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) {
    return <div className="no-results">Aucun résultat à afficher. Veuillez effectuer une recherche.</div>;
  }

  const isOriginalAnime = (item: MangaAnimeItem) => {
    return item.manga.coverage?.anime_titles !== undefined;
  };

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

  return (
    <div className="results-container">
      {results.map((item, idx) => {
        const originalIsAnime = isOriginalAnime(item);


        const renderManga = () => (
          <div className={`manga-block ${!originalIsAnime ? 'original-work' : 'adaptation'}`}>
            <h2>
              📚 {item.title}
              {renderBadge(item.manga.status)}
            </h2>
            <p><strong>Auteurs :</strong> {item.manga.authors.join(', ')}</p>
            <p><strong>Volumes :</strong> {item.manga.volumes}</p>
            <p><strong>Éditeur :</strong> {item.manga.publisher}</p>
            {item.manga.start_date && (
              <p>
                <strong>Période :</strong> {item.manga.start_date} 
                {item.manga.end_date ? ` — ${item.manga.end_date}` : ' (en cours)'}
              </p>
            )}
            {item.manga.coverage?.anime_titles && (
              <p><strong>Adapté en anime original :</strong> {item.manga.coverage.anime_titles.join(', ')}</p>
            )}
          </div>
        );

        const renderAnime = () => (
          <div className={`anime-blocks ${originalIsAnime ? 'original-work' : 'adaptation'}`}>
            {item.anime_adaptations.map((anime, i) => (
              anime.seasons?.length ? (
                anime.seasons.map((season, j) => (
                  <div key={`${anime.title}-s${j + 1}`} className="anime-block">
                    <h3>
                      🎞️ {anime.title} - Saison {season.season}
                      {renderBadge(season.fidelity)}
                    </h3>
                    <p><strong>Studio :</strong> {anime.studio}</p>
                    <p><strong>Épisodes :</strong> {season.episodes}</p>
                    <p><strong>Dates :</strong> {season.start_date} — {season.end_date || 'En cours'}</p>
                    {season.notes && <p><strong>Notes :</strong> {season.notes}</p>}
                  </div>
                ))
              ) : (
                <div key={`${anime.title}-${i}`} className="anime-block">
                  <h3>
                    🎞️ {anime.title}
                    {renderBadge(anime.status || 'completed')}
                    {renderBadge(anime.fidelity)}
                  </h3>
                  <p><strong>Studio :</strong> {anime.studio}</p>
                  <p><strong>Épisodes :</strong> {anime.episodes}</p>
                  <p><strong>Dates :</strong> {anime.start_date} — {anime.end_date || 'En cours'}</p>
                  {anime.notes && <p><strong>Notes :</strong> {anime.notes}</p>}
                </div>
              )
            ))}
          </div>
        );

        return (
          <div key={`${item.title}-${idx}`} className="result-card">
            {originalIsAnime ? (
              <>
                {renderAnime()}
                {renderManga()}
              </>
            ) : (
              <>
                {renderManga()}
                {renderAnime()}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ResultsDisplay;