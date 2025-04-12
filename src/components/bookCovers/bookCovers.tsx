import { useEffect, useState } from 'react';

interface Props {
  title: string;
  type?: 'anime' | 'manga';
}

const AnimePoster = ({ title, type = 'manga' }: Props) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const placeholderUrl =
    'https://placehold.co/300x450?text=Image+non+disponible';

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(title)}&limit=1`,
        );
        const data = await res.json();

        if (data.data && data.data.length > 0) {
          const imageUrl =
            data.data[0].images?.jpg?.large_image_url ||
            data.data[0].images?.jpg?.image_url;
          setPosterUrl(imageUrl ?? null);
        } else {
          setIsError(true);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsError(true);
      }
    };

    fetchPoster();
  }, [title, type]);

  return (
    <div className="anime-poster">
      <img
        src={isError || !posterUrl ? placeholderUrl : posterUrl}
        alt={`Affiche de ${title}`}
        className="poster-img"
        onError={(e) => {
          e.currentTarget.src = placeholderUrl;
        }}
      />
    </div>
  );
};

export default AnimePoster;
