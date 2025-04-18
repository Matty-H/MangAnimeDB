//frontend/src/components/home/home.tsx
import React from 'react';
import SearchBar from '../searchBar/searchBar';
import './Home.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-name">MangAnime Sademarou?</h1>
      </header>
      <main>
        <SearchBar onSearch={() => {}} />
      </main>
    </div>
  );
}

export default Home;
