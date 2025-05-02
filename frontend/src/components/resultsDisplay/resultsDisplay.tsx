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
    return (
      <div className="p-8 text-center animate-pulse text-base-content">
        Loading search results for "{searchTerm}"...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-base-200 rounded-lg text-error-content border-l-4 border-error">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6/9 mx-auto text-base-content justify-center">
      <div className="flex justify-center">
        <SearchBar />
      </div>

      {results.length === 0 ? (
        <div className="p-8 text-center bg-base-200 rounded-lg text-base-content">
          No results found for "{searchTerm}".
        </div>
      ) : (
        results.map((license) => (
          <div className="" key={license.id}>
              <AdaptationTable license={license} />

              <div className="divider"></div>

            {/* Cards for Manga and Anime */}
            <div className="flex flex-col lg:flex-row justify-center">
              {/* Manga Section */}
              {license.mangas.length > 0 && (
                <div className="flex-1 lg:w-1/2">
                  <h3 className="tab text-xl font-semibold">Mangas</h3>
                  {license.mangas.map((manga) => (
                    <MangaInfoCard key={manga.id} manga={manga} />
                  ))}
                </div>
              )}
              <div className="divider divider-horizontal"></div>
              {/* Anime Section */}
              {license.animeAdaptations.length > 0 && (
                <div className="flex-1 lg:w-1/2">
                  <h3 className="tab text-xl font-semibold">Animes</h3>
                  {license.animeAdaptations.map((anime) => (
                    <div className='mb-6'>
                    <AnimeInfoCard key={anime.id} anime={anime} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
      <div className="btn btn-primary btn-circle">
      <AddDataButton />
      </div>
    </div>
    
  );
};

export default ResultsDisplay;
