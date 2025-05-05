import React from 'react';
import SearchBar from '../searchBar/searchBar';

function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center p-8 pb-50">
      <div className="p-12">
        <header className="text-4xl max-w-3xl mx-auto text-center font-semibold mb-2">
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
