import React, { useState } from 'react';

const JishoDictionary = () => {
  const [expandedEntries, setExpandedEntries] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleInflection = (wordId) => {
    setExpandedEntries(prev => ({
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
      pos: 'Verbe godan en \'ru\', Verbe transitif',
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
    <div className="$bg-base-100 pt-4 max-w-3xl opacity-30 hover:opacity-100 transition-opacity duration-300">
          <div className="card bg-base-200">
            <div className="card-body">          
              {entries.map((entry) => (
                <div key={entry.id} className="mb-6 bg-base-100 rounded-lg p-4 shadow">
                  {/* Mot et lecture */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-4xl font-bold">
                        <ruby>
                          {entry.kanji} <rt className="text-xs text-base-content opacity-70">{entry.furigana}</rt>
                        </ruby>
                      </div>
                      {entry.pos && <div className="badge badge-ghost">{entry.pos}</div>}
                    </div>
                    <div>
                      {entry.common && <span className="badge badge-success">Mot courant</span>}
                      {entry.id.match(/る$|す$/) && (
                        <button 
                          className="btn btn-xs btn-ghost ml-2" 
                          onClick={() => toggleInflection(entry.id)}
                        >
                          Afficher les conjugaisons
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Tableau de conjugaisons (affiché conditionnellement) */}
                  {expandedEntries[entry.id] && (
                    <div className="bg-base-200 p-2 mb-2 rounded">
                      <h4 className="font-semibold mb-1">Conjugaisons</h4>
                      {entry.id === 'さでまる' ? (
                        <div>
                          <div className="collapse collapse-arrow">
                            <input type="checkbox" className="min-h-0" /> 
                            <div className="collapse-title font-semibold p-1 pl-5 min-h-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)] flex items-center">
                                Formes Informelles
                            </div>
                            <div className="collapse-content p-1"> 
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

                          <div className="collapse collapse-arrow mt-2">
                            <input type="checkbox" className="min-h-0" /> 
                            <div className="collapse-title font-semibold p-1 pl-5 min-h-0 flex shadow-[0_2px_4px_rgba(0,0,0,0.1)] items-center">
                              Formes Formelles
                            </div>
                            <div className="collapse-content p-1"> 
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
                      ) : (
                        <table className="table table-compact w-full">
                          <tbody>
                            <tr>
                              <td>Forme simple positive</td>
                              <td>{entry.id}</td>
                            </tr>
                            <tr>
                              <td>Forme simple négative</td>
                              <td>
                                {entry.id.endsWith('る') 
                                  ? entry.id.slice(0, -1) + 'ない' 
                                  : entry.id.slice(0, -1) + 'さない'}
                              </td>
                            </tr>
                            <tr>
                              <td>Forme en te</td>
                              <td>
                                {entry.id.endsWith('る') 
                                  ? entry.id.slice(0, -1) + 'て' 
                                  : entry.id.slice(0, -1) + 'して'}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                  
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
                  
                  {/* Niveau JLPT - Seulement pour さでまる */}
                  {entry.level && (
                    <div className="mt-1">
                      <span className="badge badge-info badge-sm">{entry.level}</span>
                    </div>
                  )}
                  
                  <div className="text-right mt-2">
                    <a href={`https://jisho.org/search/prank`} className="link link-primary text-xs">Détails ▸</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  );
};

export default JishoDictionary;