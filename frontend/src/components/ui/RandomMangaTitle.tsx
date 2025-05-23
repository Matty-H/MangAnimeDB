import React, { useMemo } from 'react';
import Typewriter from 'typewriter-effect';

const RandomMangaTitle = ({ searchTerm }) => {
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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
    <h1 className="flex items-center justify-center gap-2 flex-wrap mb-6 text-4xl font-black">
      <span className="inline-block min-w-0 flex-shrink">
        <Typewriter
          onInit={(typewriter) => {
            if (searchTerm) {
              typewriter.typeString(searchTerm).start();
            } else {
              const loopTitles = () => {
                shuffledAnimes.forEach((title) => {
                  typewriter
                    .typeString(title)
                    .pauseFor(2000)
                    .deleteAll()
                    .pauseFor(500);
                });
                typewriter.callFunction(() => loopTitles());
              };

              loopTitles();
              typewriter.start();
            }
          }}
          options={{
            delay: 75,
            deleteSpeed: 50,
            loop: false,
            cursor: '|',
          }}
        />
      </span>
      <span className="whitespace-nowrap">
        {searchTerm ? 'Sakomansulà !' : 'Sademaru ?'}
      </span>
    </h1>
  );
};

export default RandomMangaTitle;
