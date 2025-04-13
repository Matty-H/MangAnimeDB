import React from 'react';
import { useEffect, useState } from 'react';

interface Props {
  title: string;
  type?: 'anime' | 'manga';
}

const ScenarioSection = ({ title, type = 'manga' }: Props) => {
  const [synopsis, setSynopsis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSynopsis = async () => {
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(title)}&limit=1`,
        );
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          setSynopsis(data.data[0].synopsis || 'Pas de synopsis disponible.');
        } else {
          setSynopsis('Aucun résultat trouvé.');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError('Erreur lors du chargement du synopsis.');
      }
    };

    fetchSynopsis();
  }, [title, type]);

  if (error)
    return (
      <div className="scenario-section">
        <p>{error}</p>
      </div>
    );
  if (!synopsis) return null;

  return (
    <div className="scenario-section">
      <h4>Scénario</h4>
      <p>{synopsis}</p>
    </div>
  );
};

export default ScenarioSection;
