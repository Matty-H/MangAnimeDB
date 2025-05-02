import React from 'react';
import SearchBar from '../searchBar/searchBar';

function Home() {
  return (
    <div className="min-h-screen flex justify-center p-8">
      <div className="p-12">
        <header className="text-2xl font-semibold mb-2">
          <h1>MangAnime Sademarou?</h1>
        </header>
        <main>
          <SearchBar onSearch={() => {}} />
        </main>
      </div>
    </div>
  );
}

export default Home;
