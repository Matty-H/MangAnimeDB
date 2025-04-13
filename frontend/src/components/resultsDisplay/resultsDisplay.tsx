import React, { useState, useEffect } from 'react';
import { searchDetailed } from '../../services/apiService';
import { 
  License, 
  MangaWork, 
  AnimeWork, 
  WorkStatus, 
  AnimeFidelity, 
  RelationType 
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

  // Helper function to format dates
  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to display status in a more readable format
  const formatStatus = (status: WorkStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Helper function to get coverage information
  const formatCoverage = (from?: number, to?: number) => {
    if (from && to) {
      return `Volumes ${from} to ${to}`;
    } else if (from) {
      return `From volume ${from}`;
    } else if (to) {
      return `Up to volume ${to}`;
    }
    return 'Coverage information not available';
  };

  // Manual testing of API connection
  const testApiConnection = async () => {
    try {
      const response = await fetch('/api/search/detailed?query=test');
      const statusText = response.ok ? 'OK' : 'Failed';
      const status = response.status;
      const contentType = response.headers.get('content-type');
      
      alert(`API Connection Test:\nStatus: ${statusText} (${status})\nContent-Type: ${contentType}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Test API response:', data);
      }
    } catch (err) {
      console.error('API test error:', err);
      alert(`API Connection Test Failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div>Loading search results for "{searchTerm}"...</div>;
  }

  if (error) {
    return (
      <div>
        <div>Error: {error}</div>
        <button onClick={testApiConnection}>Test API Connection</button>
        <div>
          <h3>Troubleshooting Tips:</h3>
          <ul>
            <li>Check that your API server is running</li>
            <li>Verify that the '/api/search/detailed' endpoint is properly implemented</li>
            <li>Check browser console for more detailed error messages</li>
          </ul>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return <div>No results found for "{searchTerm}".</div>;
  }

  return (
    <div className="results-display">
      <h1>Search results for: {searchTerm}</h1>
      
      {results.map(license => (
        <div key={license.id} className="license-result">
          <h2>{license.title} {license.externalId && `(${license.externalId})`}</h2>
          
          {/* Manga Works Section */}
          {license.mangas.length > 0 && (
            <div className="manga-section">
              <h3>Manga Works</h3>
              {license.mangas.map(manga => (
                <div key={manga.id} className="manga-work">
                  <h4>{license.title} {manga.externalId && `(${manga.externalId})`}</h4>
                  <div>
                    <p><strong>Authors:</strong> {manga.authors.join(', ')}</p>
                    <p><strong>Volumes:</strong> {manga.volumes}</p>
                    <p><strong>Status:</strong> {formatStatus(manga.status)}</p>
                    <p><strong>Publisher:</strong> {manga.publisher}</p>
                    <p><strong>Publication:</strong> {formatDate(manga.startDate)} - {manga.status === WorkStatus.COMPLETED ? formatDate(manga.endDate) : 'Ongoing'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Anime Adaptations Section */}
          {license.animeAdaptations.length > 0 && (
            <div className="anime-section">
              <h3>Anime Adaptations</h3>
              {license.animeAdaptations.map(anime => (
                <div key={anime.id} className="anime-work">
                  <h4>{anime.title} {anime.externalId && `(${anime.externalId})`}</h4>
                  <div>
                    <p><strong>Studio:</strong> {anime.studio}</p>
                    <p><strong>Episodes:</strong> {anime.episodes}</p>
                    <p><strong>Status:</strong> {formatStatus(anime.status)}</p>
                    <p><strong>Fidelity:</strong> {anime.fidelity.replace('_', ' ')}</p>
                    <p><strong>Relation Type:</strong> {anime.relationType.replace('_', ' ')}</p>
                    <p><strong>Airing:</strong> {formatDate(anime.startDate)} - {anime.status === WorkStatus.COMPLETED ? formatDate(anime.endDate) : 'Ongoing'}</p>
                    
                    {/* Source Manga Information */}
                    {anime.sourcedFrom && anime.sourcedFrom.length > 0 && (
                      <div className="anime-sources">
                        <p><strong>Adapted from:</strong></p>
                        <ul>
                          {anime.sourcedFrom.map(relation => (
                            <li key={relation.id}>
                              {relation.manga_name ? relation.manga_name.publisher : 'Unknown manga'} - 
                              {relation.coverageFromVolume || relation.coverageToVolume 
                                ? formatCoverage(relation.coverageFromVolume, relation.coverageToVolume)
                                : 'No coverage information'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Seasons Information */}
                    {anime.seasons.length > 0 && (
                      <div className="anime-seasons">
                        <p><strong>Seasons:</strong></p>
                        <ul>
                          {anime.seasons.map(season => (
                            <li key={season.id}>
                              Season {season.seasonNumber}: {season.episodes} episodes - 
                              Fidelity: {season.fidelity.replace('_', ' ')}
                              {(season.coverageFromVolume || season.coverageToVolume) && 
                                <span> - {formatCoverage(season.coverageFromVolume, season.coverageToVolume)}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Notes if available */}
                    {anime.notes && (
                      <div className="anime-notes">
                        <p><strong>Notes:</strong> {anime.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Manga-Anime Correspondences Section */}
          {license.mangas.length > 0 && license.mangas.some(manga => manga.adaptations && manga.adaptations.length > 0) && (
            <div className="correspondences-section">
              <h3>Manga-Anime Correspondences</h3>
              {license.mangas.map(manga => (
                manga.adaptations && manga.adaptations.length > 0 && (
                  <div key={manga.id} className="manga-anime-correspondence">
                    <h4>Adaptations of {license.title} Manga</h4>
                    <ul>
                      {manga.adaptations.map(adaptation => (
                        <li key={adaptation.id}>
                          <strong>Manga Volumes {adaptation.coverageFromVolume || '?'}-{adaptation.coverageToVolume || '?'}</strong> → 
                          {adaptation.anime_name 
                            ? <span> {adaptation.anime_name.title} ({adaptation.anime_name.episodes} episodes)</span>
                            : ' Unknown anime adaptation'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResultsDisplay;