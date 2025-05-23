import React, { useState, useRef, useEffect } from 'react';

// Hook pour rendre le texte des badges responsive
const useResponsiveBadgeText = (
  textRef,
  containerRef,
  minFontSize = 10
) => {
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const adjustFontSize = () => {
      if (!textRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const text = textRef.current;
      
      // Largeur disponible (conteneur - padding)
      const containerWidth = container.offsetWidth;
      const availableWidth = containerWidth - 16; // padding des badges
      
      // Reset à la taille de base
      text.style.fontSize = '14px';
      let currentFontSize = 14;
      
      // Réduire progressivement jusqu'à ce que le texte rentre
      while (text.scrollWidth > availableWidth && currentFontSize > minFontSize) {
        currentFontSize -= 0.5;
        text.style.fontSize = `${currentFontSize}px`;
      }
      
      setFontSize(currentFontSize);
    };

    // Ajuster immédiatement
    const timeoutId = setTimeout(adjustFontSize, 10);

    // Observer les changements de taille
    const resizeObserver = new ResizeObserver(adjustFontSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [textRef, containerRef, minFontSize]);

  return fontSize;
};

// Composant Badge responsive
const ResponsiveBadge = ({ children, className = "", maxWidth, ...props }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  
  const fontSize = useResponsiveBadgeText(textRef, containerRef, 10);

  return (
    <span 
      ref={containerRef}
      className={`badge ${className} overflow-hidden`}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : {}}
      {...props}
    >
      <span 
        ref={textRef}
        className="transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis"
        style={{ fontSize: `${fontSize}px` }}
      >
        {children}
      </span>
    </span>
  );
};

const JishoDictionary = () => {
  const [showDefinition, setShowDefinition] = useState({});

  const toggleDefinition = (wordId) => {
    setShowDefinition(prev => ({
      ...prev,
      [wordId]: !prev[wordId]
    }));
  };

  // Entrées de dictionnaire d'exemple, avec une entrée fictive ajoutée
  const entries = [
    {
      id: 'さでまる',
      kanji: '差出真る',
      furigana: 'さでまる',
      pos: 'Verbe godan transitif',
      meanings: ['connaître les correspondances entre manga et anime', 'localiser où commence une scène spécifique dans une adaptation animée'],
      otherForms: ['差出真し 【さでまし】', '差出回る 【さでまる】'],
      etymology: 'Du français "ça démarre où"',
      examples: [
        {
          japanese: '彼はこの漫画のアニメ版をさでまることができる。',
          furigana: 'かれはこのまんがのアニメばんをさでまることができる。',
          english: 'Il peut localiser où commence n\'importe quelle scène de ce manga dans la version animée.'
        },
        {
          japanese: 'オタクはいつも漫画とアニメをさでまっている。',
          furigana: 'おたくはいつもまんがとアニメをさでまっている。',
          english: 'Les otakus connaissent toujours les correspondances entre mangas et animes.'
        }
      ],
      conjugations: {
        informal: {
          present: {
            positive: '差出真る (さでまる)',
            negative: '差出真らない (さでまらない)'
          },
          past: {
            positive: '差出真った (さでまった)',
            negative: '差出真らなかった (さでまらなかった)'
          },
          teForm: '差出真って (さでまって)',
          conditional: '差出真れば (さでまれば)',
          volitional: '差出真ろう (さでまろう)'
        },
        formal: {
          present: {
            positive: '差出真ります (さでまります)',
            negative: '差出真りません (さでまりません)'
          },
          past: {
            positive: '差出真りました (さでまりました)',
            negative: '差出真りませんでした (さでまりませんでした)'
          },
          teForm: '差出真りまして (さでまりまして)',
          conditional: '差出真りますれば (さでまりますれば)',
          volitional: '差出真りましょう (さでまりましょう)'
        }
      },
      usage: 'Utilisé principalement dans la culture otaku pour désigner la capacité à localiser des scènes d\'anime qui correspondent aux cases de manga, ou vice versa.',
      notes: 'Bien qu\'écrit avec les kanji 差出真る, il est souvent écrit uniquement en hiragana.',
      level: 'JLPT N2',
      common: true
    },
  ];

  return (
    <div className="bg-base-100 pt-4 max-w-3xl opacity-70 hover:opacity-100 transition-opacity duration-300">
      <div className="card bg-base-200">
        <div className="card-body">          
          {entries.map((entry) => (
            <div key={entry.id} className="bg-base-100 rounded-lg p-4 shadow h-auto min-h-[80px]">
              {/* Barre compacte avec informations essentielles */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-2xl font-bold flex-shrink-0">
                    <ruby>
                      {entry.kanji} <rt className="text-xs text-base-content opacity-70">{entry.furigana}</rt>
                    </ruby>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                    {entry.pos && (
                      <ResponsiveBadge 
                        className="badge-ghost" 
                        maxWidth={200}
                      >
                        {entry.pos}
                      </ResponsiveBadge>
                    )}
                    {entry.common && (
                      <ResponsiveBadge 
                        className="badge-success" 
                        maxWidth={120}
                      >
                        Mot courant
                      </ResponsiveBadge>
                    )}
                    {entry.level && (
                      <ResponsiveBadge 
                        className="badge-info badge-sm" 
                        maxWidth={80}
                      >
                        {entry.level}
                      </ResponsiveBadge>
                    )}
                  </div>
                </div>
                <div 
                  className="flex btn items-center gap-1 cursor-pointer text-primary hover:text-primary-focus transition-colors flex-shrink-0 ml-2" 
                  onClick={() => toggleDefinition(entry.id)}
                >
                  <span className="text-sm">Définition</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${showDefinition[entry.id] ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Définition complète (conditionnelle) */}
              <div className={`overflow-hidden transition-all duration-300 ${showDefinition[entry.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-2">
                  {/* Significations */}
                  <div className="mt-3">
                    {entry.meanings.map((meaning, idx) => (
                      <div key={idx} className="mb-1">
                        {entry.meanings.length > 1 && <span className="font-semibold">{idx + 1}. </span>}
                        <span>{meaning}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Exemples */}
                  {entry.examples && (
                    <div className="bg-base-200 p-2 mt-2 rounded">
                      {entry.examples.map((ex, idx) => (
                        <div key={idx} className="flex flex-col">
                          <div className="text-sm">
                            {ex.japanese}
                          </div>
                          <div className="text-xs text-base-content opacity-70">
                            {ex.english}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Autres formes */}
                  {entry.otherForms && entry.otherForms.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-semibold">Autres formes : </span>
                      <span className="text-xs">{entry.otherForms.join('、')}</span>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {entry.notes && (
                    <div className="mt-1 text-xs italic text-base-content opacity-80">
                      {entry.notes}
                    </div>
                  )}
                  
                  {/* Étymologie - Seulement pour さでまる */}
                  {entry.etymology && (
                    <div className="mt-2">
                      <span className="text-xs font-semibold">Étymologie : </span>
                      <span className="text-xs">{entry.etymology}</span>
                    </div>
                  )}
                  
                  {/* Notes d'utilisation - Seulement pour さでまる */}
                  {entry.usage && (
                    <div className="mt-1">
                      <span className="text-xs font-semibold">Utilisation : </span>
                      <span className="text-xs">{entry.usage}</span>
                    </div>
                  )}
                  
                  {/* Tableau de conjugaisons - affiché directement */}
                  {entry.conjugations && (
                    <div className="bg-base-200 p-2 mt-4 rounded">
                      <h4 className="font-semibold pl-2 pt-1">Conjugaison</h4>
                      
                      {/* Formes Informelles */}
                      <div className="collapse collapse-arrow">
                        <input type="checkbox" className="min-h-0" /> 
                        <div className="collapse-title font-semibold p-2 min-h-0 flex items-center">
                          Formes Informelles
                        </div>
                        <div className="collapse-content "> 
                          <table className="table table-compact w-full">
                            <tbody>
                              <tr>
                                <td className="font-semibold">Présent Positif</td>
                                <td>さでまる</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Présent Négatif</td>
                                <td>さでまらない</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Passé Positif</td>
                                <td>さでまった</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Passé Négatif</td>
                                <td>さでまらなかった</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Forme en te</td>
                                <td>さでまって</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Conditionnel</td>
                                <td>さでまれば</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Volitif</td>
                                <td>さでまろう</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="divider m-0 p-0"></div>
                      {/* Formes Formelles */}
                      <div className="collapse collapse-arrow">
                        <input type="checkbox" className="min-h-0" /> 
                        <div className="collapse-title font-semibold p-2 min-h-0 flex shadow-[0_2px_4px_rgba(0,0,0,0.1)] items-center">
                          Formes Formelles
                        </div>
                        <div className="collapse-content"> 
                          <table className="table table-compact w-full">
                            <tbody>
                              <tr>
                                <td className="font-semibold">Présent Positif</td>
                                <td>さでまります</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Présent Négatif</td>
                                <td>さでまりません</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Passé Positif</td>
                                <td>さでまりました</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Passé Négatif</td>
                                <td>さでまりませんでした</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Forme en te</td>
                                <td>さでまりまして</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Conditionnel</td>
                                <td>さでまりますれば</td>
                              </tr>
                              <tr>
                                <td className="font-semibold">Volitif</td>
                                <td>さでまりましょう</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-right mt-2">
                    <a href={`https://jisho.org/search/prank`} className="link link-primary text-xs">Détails ▸</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JishoDictionary;