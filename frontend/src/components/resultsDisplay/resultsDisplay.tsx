// frontend/src/components/resultsDisplay/resultsDisplay.tsx
import React, { useState, useEffect } from 'react';
import { searchDetailed } from '../../services/apiService';
import AdaptationTable from '../adaptationTable/adaptationTable';
import MangaInfoCard from '../workInfo/mangaInfoCard';
import AnimeInfoCard from '../workInfo/animeInfoCard';
import SearchBar from '../searchBar/searchBar';
import AddDataButton from '../addDataButton/addDataButton';
import {
  License,
  MangaWork,
  AnimeWork,
  WorkStatus
} from '../../types';
import './resultsDisplay.css';

interface ResultsDisplayProps {
  searchTerm: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ searchTerm }) => {
  const [results, setResults] = useState<License[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        if (searchTerm) {
          console.log(`Fetching results for: ${searchTerm}`);
          const data = await searchDetailed(searchTerm);
          console.log('Search results received:', data);
          setResults(data);
        } else {
          console.log('No search term provided, clearing results');
          setResults([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching results:', err);
        setError(`Failed to fetch results: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  if (loading) {
    return <div>Loading search results for "{searchTerm}"...</div>;
  }

  if (error) {
    return (
      <div>Error: {error}</div>
    );
  }

  return (
    <div className="results-display">
      <SearchBar />
      
      {/* Bouton d'ajout de données */}
      <AddDataButton />
      
      {results.length === 0 ? (
        <div>No results found for "{searchTerm}".</div>
      ) : (
        results.map(license => (
          <div key={license.id} className="license-result">
            {/* Manga-Anime Adaptation Table */}
            <AdaptationTable license={license} />
            <div className='works-section'>
              {/* Manga Works Section */}
              {license.mangas.length > 0 && (
                <div className="manga-section">
                  <h3>Mangas</h3>
                  <div className="manga-grid">
                    {license.mangas.map(manga => (
                      <MangaInfoCard key={manga.id} manga={manga} />
                    ))}
                  </div>
                </div>
              )}
              {/* Anime Adaptations Section */}
              {license.animeAdaptations.length > 0 && (
                <div className="anime-section">
                  <h3>Animes</h3>
                  <div className="anime-grid">
                    {license.animeAdaptations.map(anime => (
                      <AnimeInfoCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResultsDisplay;