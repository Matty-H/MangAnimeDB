import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ResultsDisplay from './components/ResultsDisplay';
import sampleData from './data/sampleData.json';
import { MangaAnimeItem } from './types';


function App() {
  const [searchResults, setSearchResults] = useState<MangaAnimeItem[]>([]);

  const handleSearch = (searchTerm: string) => {
    
    // Filtrer les résultats à partir du terme de recherche
    const results = sampleData.filter((item: MangaAnimeItem) => {
      const mainTitle = item.title.toLowerCase();
      const altTitles = item.alternativeTitles ? 
        item.alternativeTitles.map(title => title.toLowerCase()) : 
        [];
      
      const searchTermLower = searchTerm.toLowerCase();
      
      return mainTitle.includes(searchTermLower) || 
        altTitles.some(title => title.includes(searchTermLower));
    });
    
    setSearchResults(results);
   
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MangAnime Où.lire?</h1>
      </header>
      <main>
        <SearchBar onSearch={handleSearch} />
        <ResultsDisplay results={searchResults} />
      </main>
    </div>
  );
}

export default App;