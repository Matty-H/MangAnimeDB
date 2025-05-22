import React, { useState, useEffect } from 'react';
import { searchService } from '../../services';
import AdaptationTable from '../adaptationTable/AdaptationTable';
import MangaInfoCard from '../cardManga/MangaInfoCard';
import AnimeInfoCard from '../cardAnime/AnimeInfoCard';
import SearchBar from '../searchBar/searchBar';
import AddDataButton from '../addDataButton/addDataButton';
import { License, MangaWork, AnimeWork, WorkStatus } from '../../types';
import { Search, AlertCircle, Loader2 } from 'lucide-react';

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
          const data = await searchService.searchDetailed(searchTerm);
          setResults(data);
        } else {
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

  return (
    <div className="max-w-5/6 mx-auto px-4 py-6">
      <div className="mb-8">
        <SearchBar />
      </div>

      {loading ? (
        <div className="bg-base-100 card-border border-base-300 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Loader2 size={24} className="animate-spin opacity-70" />
            <span>Recherche en cours pour "{searchTerm}"...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-base-100 card-border border-error border-l-4 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <AlertCircle size={24} className="text-error" />
            <span>{error}</span>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-base-100 card-border border-base-300 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <Search size={24} className="opacity-50" />
            <span>Aucun résultat trouvé pour "{searchTerm}".</span>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {results.map((license) => (
            <div key={license.id} className="space-y-6">
              <AdaptationTable license={license} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Manga Section - utilisant le composant MangaInfoCard avec isEmptyTemplate si nécessaire */}
                {license.mangas && license.mangas.length > 0 ? (
                  <div className="space-y-6">
                    {license.mangas.map((manga) => (
                      <MangaInfoCard key={manga.id} manga={manga} licenseId={license.id} />
                    ))}
                  </div>
                ) : (
                  <MangaInfoCard licenseId={license.id} isEmptyTemplate={true} />
                )}
                
                {/* Anime Section - utilisant le composant AnimeInfoCard avec isEmptyTemplate si nécessaire */}
                {license.animeAdaptations && license.animeAdaptations.length > 0 ? (
                  <div className="space-y-6">
                    {license.animeAdaptations.map((anime) => (
                      <AnimeInfoCard key={anime.id} anime={anime} licenseId={license.id} />
                    ))}
                  </div>
                ) : (
                  <AnimeInfoCard licenseId={license.id} isEmptyTemplate={true} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="fixed bottom-6 right-6">
        <AddDataButton />
      </div>
    </div>
  );
};

export default ResultsDisplay;