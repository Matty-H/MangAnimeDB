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
        'L’Attaque des Titans',
        'One Piece',
        'Naruto',
        'Boruto',
        'Bleach',
        'Demon Slayer',
        'My Hero Academia',
        'Dr. Stone',
        'Chainsaw Man',
        'Vinland Saga',
        'Mob Psycho 100',
        'Spy x Family',
        'One Punch Man',
        'Blue Lock',
        'Sword Art Online',
        'Fairy Tail',
        'Edens Zero',
        'Fire Force',
        'No Game No Life',
        'Erased',
        'Your Lie in April',
        'A Silent Voice',
        'Violet Evergarden',
        'Made in Abyss',
        'Psycho-Pass',
        'Parasite',
        'Elfen Lied',
        'Noragami',
        'GTO',
        'Assassination Classroom',
        'Akame ga Kill!',
        'Kill la Kill',
        'Samurai Champloo',
        'Cowboy Bebop',
        'Steins;Gate',
        'Neon Genesis Evangelion',
        'Hellsing',
        'Claymore',
        'Devilman Crybaby',
        'Beastars',
        'Bakuman',
        'Monster',
        'D.Gray-man',
        'Bungô Stray Dogs',
        'March Comes in Like a Lion',
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
