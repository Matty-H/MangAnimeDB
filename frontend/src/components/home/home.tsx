import React from 'react';
import SearchBar from '../searchBar/searchBar';

function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center p-8 pb-50">
      <div className="p-12">
        <div className="tooltip">
          <div className="tooltip-content">
            <div className="animate-bounce text-shadow-sky-100 -rotate-5 text-2xl font-black">Sumimasen, anime ha doko ni Sadematta nodesu ka ?</div>
          </div>
          <header className="text-4xl max-w-3xl mx-auto text-center font-black mb-2">
            <h1>MangAnime Sademarū?</h1>
          </header>
        </div>
        <main>
          <SearchBar onSearch={() => {}} />
        </main>
      </div>
    </div>
  );
}

export default Home;
