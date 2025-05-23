import React, { useMemo } from 'react';
import Typewriter from 'typewriter-effect';

const RandomMangaTitle = () => {
  // Fonction pour mélanger un tableau (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Mémoriser le tableau mélangé pour éviter qu'il change à chaque render
  const shuffledAnimes = useMemo(() => {
    const animes = [
      'Fullmetal Alchemist',
      'Death Note',
      'Tokyo Ghoul',
      'Black Clover',
      'Code Geass',
      'Berserk',
      'Hunter x Hunter',
      'The Promised Neverland',
      'Black Butler',
      'Jujutsu Kaisen',
      'Attaque des Titans',
    ];
    return shuffleArray(animes);
  }, []);

  return (
    <h1 className="flex items-center justify-center gap-2 flex-wrap">
      <span className="inline-block min-w-0 flex-shrink">
        <Typewriter
          options={{
            strings: shuffledAnimes,
            autoStart: true,
            loop: true,
            deleteSpeed: 50,
          }}
        />
      </span>
      <span className="whitespace-nowrap">Sademaru ?</span>
    </h1>
  );
};

export default RandomMangaTitle;