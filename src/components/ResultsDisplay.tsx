import { MangaAnimeItem } from '../types';

interface ResultsDisplayProps {
  results: MangaAnimeItem[];
}

function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results || results.length === 0) {
    return <div className="no-results">Aucun résultat à afficher. Veuillez effectuer une recherche.</div>;
  }

  return (
    <div className="results-container">
      {results.map((item) => (
        <div key={item.id} className="result-card">
          <h2>{item.title}</h2>
          {item.alternativeTitles && item.alternativeTitles.length > 0 && (
            <div className="alt-titles">
              Titres alternatifs: {item.alternativeTitles.join(', ')}
            </div>
          )}
          
          <div className="correspondences">
            <h3>Correspondances Manga ↔ Anime</h3>
            <table>
              <thead>
                <tr>
                  <th>Volumes Manga</th>
                  <th>Épisodes Anime</th>
                  <th>Saison</th>
                  <th>Arc</th>
                </tr>
              </thead>
              <tbody>
                {item.correspondences.map((corr, index) => (
                  <tr key={index}>
                    <td>{corr.mangaVolumes}</td>
                    <td>{corr.animeEpisodes}</td>
                    <td>{corr.animeSeason}</td>
                    <td>{corr.arc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResultsDisplay;