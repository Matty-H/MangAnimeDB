import React, { useState, useEffect } from 'react';

export default function RandomAnimePhrase() {
  const phrases = [
      "Sumimasen, Sademaru l'anime déjà ?",
      "Adapté fidèlement, sauf l’émotion.",
      "Je regarde uniquement pour les fillers.",
      "Ça démarre où, déjà ?",
      "Vive les gros flashbacks…",
      "Tu savais que l'anime était plus fidèle que le manga 🤓",
      "Les épisodes récap' sont les meilleurs !",
      "Attention, adaptation libre. Le manga n’approuve pas.",
      "L'épisode du chat ma fait comprendre que s'était le meilleur anime.",
      "Alors, l'histoire c'est des enfants génétiquement modifiés pour faire du roller.",
      "À la fin, il meurt.",
      "À la fin, il pécho sa sœur.",
      "Tu comprends pas, c'est un démone de 3000 ans…",
      "Spoiler : Y a des boobs.",
      "One Piece ? C'est pas le manga du ninja qui veut retrouver son père ?",
      "Je connais déjà la fin, mon oncle qui travaille chez Nintendo me l'a dit.",
      "Je regarde avant tout pour le scénario.",
      "Le Fan Service est important pour l'intrigue !",
      "Le One Piece est une poelle à frire.",
      "Le One Piece est une robe, vous l'aurez lu ici en premier !",
      "La version Hentai est plus politique.",
      "L'adaptation Hentai est plus soft.",
      "Le hentai est canon à l'histoire.",
      "BIG 3 dans l'odre que tu veux.",
      "From Big 3 to Big Mac.",
      "Nous savons…",
      "Banger/20",
      "Assassination MasterClassroom",
      "L'histoire est mieux depuis que Disney a racheté les droits.",
      "La pub pour McDo est canon au manga.",
      "C'est l'histoire d'un gosse nul qui veut devenir moins nul.",
      "Spoiler : ses parents sont morts.",
      "Bonne nuit à toi, Punpun.", 
      "Blue Lock, Blue Period et Blue Box font partie d'un multivers.",
      "Sombre est ce manga.",
      "Okamari no Suzoki",
      "Le scam du siècle.",
      "La suite c'est Duo Leveling ?",
      "J'espère qu'il y aura un manga sur le père de Boruto.",
      "Le manga alterne entre battre des terroristes et faire des crêpes.",
      "J'adore le MCU : Manga Clamp Universe.",
      "Vend Toyota Sprinter Trueno AE86, bon état.",
      "Les Bigoudènes Aventures de Johanig Jozester",
      "Expérimentales Céréales Lait",
      
    ];
    

  const animations = [
    "animate-pulse",
  ];

  const textShadows = [
    "text-shadow-sky-100",
    "text-shadow-pink-200",
    "text-shadow-purple-200",
    "text-shadow-yellow-200",
    "text-shadow-green-200",
    "text-shadow-red-200",
    "text-shadow-blue-200"
  ];

  const [randomPhrase, setRandomPhrase] = useState("");
  const [randomAnimation, setRandomAnimation] = useState("");
  const [randomTextShadow, setRandomTextShadow] = useState("");

  useEffect(() => {
    // Sélection aléatoire à chaque refresh/montage du composant
    const randomPhraseIndex = Math.floor(Math.random() * phrases.length);
    const randomAnimationIndex = Math.floor(Math.random() * animations.length);
    const randomTextShadowIndex = Math.floor(Math.random() * textShadows.length);

    setRandomPhrase(phrases[randomPhraseIndex]);
    setRandomAnimation(animations[randomAnimationIndex]);
    setRandomTextShadow(textShadows[randomTextShadowIndex]);
  }, []);

  return (
      <div 
        className={`${randomAnimation} ${randomTextShadow} text-xS md:text-2xS lg:text-3xs font-black text-white text-center max-w-2xl leading-relaxed`}
        style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)'
        }}
      >
        {randomPhrase}
    </div>
  );
}