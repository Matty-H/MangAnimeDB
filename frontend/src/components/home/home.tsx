import React, { useEffect, useState } from 'react';
import SearchBar from '../searchBar/searchBar';
import JishoDictionary from '../jishoSamedaru/jishoDictionnary';
import RandomAnimePhrase from '../ui/RandomAnimePhrase';
import RandomMangaTitle from '../ui/RandomMangaTitle';

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Déclencher l'animation au montage du composant
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Conteneur global avec la même largeur pour tous les éléments */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="tooltip">
            <div className="tooltip-content transform transition-all ease-out translate-y-0">
              <RandomAnimePhrase />
            </div>
            <header
              className={`text-2xl sm:text-3xl lg:text-4xl text-center font-black mb-3 sm:mb-4 transform transition-all duration-700 ease-out delay-200 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <RandomMangaTitle searchTerm={''} />
            </header>
          </div>

          <main className="space-y-6">
            {/* Conteneur pour SearchBar et JishoDictionary */}
            <div className="w-full">
            {/* SearchBar avec z-index élevé appliqué sur le conteneur d'animation */}
            <div
              className={`relative z-50 transform transition-all duration-700 ease-out delay-400 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <SearchBar onSearch={() => {}} />
            </div>

            {/* JishoDictionary avec z-index plus bas */}
            <div
              className={`relative z-10 transform transition-all duration-700 ease-out delay-600 ${
                isLoaded
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <JishoDictionary />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
}

export default Home;