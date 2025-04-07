import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import Data from './data/datascenario.json';
import { MangaAnimeItem } from './types';

function App() {
  const [searchResults, setSearchResults] = useState<MangaAnimeItem[]>([]);

  // Correction : forcer le typage de l'import JSON
  const typedData: MangaAnimeItem[] = Data as MangaAnimeItem[];

  const handleSearch = (searchTerm: string) => {
    const searchTermLower = searchTerm.toLowerCase();

    const results = typedData.filter((item) => {
      const mainTitle = item.title?.toLowerCase() || '';
      return mainTitle.includes(searchTermLower);
    });

    setSearchResults(results);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MangAnime sassaretou?</h1>
      </header>
      <main>
        <SearchBar onSearch={handleSearch} />
        <ResultsDisplay results={searchResults} />
      </main>
    </div>
  );
}

export default App;
