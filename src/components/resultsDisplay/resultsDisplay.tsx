import { useEffect, useState } from 'react';
import './resultsDisplay.css';
import data from '../../data/datascenario.json';
import { MangaAnimeItem } from '../../types';

interface ResultsDisplayProps {
  searchTerm?: string;
  results?: MangaAnimeItem[];
}

function ResultsDisplay({ searchTerm, results: propResults }: ResultsDisplayProps) {
  const [results, setResults] = useState<MangaAnimeItem[]>([]);

  useEffect(() => {
    if (propResults) {
      // Utiliser les résultats fournis directement
      setResults(propResults);
    } else if (searchTerm) {
      // Filtrer les données selon le terme de recherche
      const filteredResults = data.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) as MangaAnimeItem[];
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [searchTerm, propResults]);

  return (
    <div className="search-results">
      {searchTerm && <h2>Résultats pour : {searchTerm}</h2>}
      {!searchTerm && propResults && <h2>Résultats de la recherche</h2>}
      {results.length === 0 ? (
        <p>Aucun résultat trouvé</p>
      ) : (
        <ul className="results-list">
          {results.map((item, index) => (
            <li key={index} className="result-item">
              <h3>{item.title}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResultsDisplay;