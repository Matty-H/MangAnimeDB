//src/components/resultsDisplay/resultsDisplay.tsx
import React from 'react';
import { useEffect, useState } from 'react';
import './resultsDisplay.css';
import { MangaAnimeItem } from '../../types';
import ScenarioSection from '../scenarioSection/scenarioSection';
import BookCovers from '../bookCovers/bookCovers';
import AdaptationTable from '../adaptationTable/adaptationTable';
import { searchDetailed } from "../../services/apiService";
interface ResultsDisplayProps {
  searchTerm?: string;
  results?: MangaAnimeItem[];
}

function ResultsDisplay({
  searchTerm,
  results: propResults,
}: ResultsDisplayProps) {
  const [results, setResults] = useState<MangaAnimeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si des résultats sont passés directement en props, on les utilise
    if (propResults) {
      setResults(propResults);
      return;
    }

    // Si un terme de recherche est fourni, on interroge l'API
    if (searchTerm) {
      setLoading(true);
      setError(null);

      searchDetailed(searchTerm)
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Erreur lors de la recherche:', err);
          setError('Une erreur est survenue lors de la recherche.');
          setLoading(false);
          setResults([]);
        });
    } else {
      setResults([]);
    }
  }, [searchTerm, propResults]);

  if (loading) {
    return (
      <div className="search-results">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      {!searchTerm && propResults && <h2>Résultats de la recherche</h2>}
      {results.length === 0 ? (
        <p>Aucun résultat trouvé</p>
      ) : (
        results.map((item) => (
          <div key={item.id} className="result-table">
            <BookCovers title={item.title} />
            <ScenarioSection title={item.title} />
            <AdaptationTable adaptations={item.anime_adaptations} />
          </div>
        ))
      )}
    </div>
  );
}

export default ResultsDisplay;
