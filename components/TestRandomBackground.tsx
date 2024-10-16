// spectralnext/components/TestRandomBackground.tsx

'use client';

import React from 'react';
import { fetchRandomBackground } from '@/lib/queries/RandomBackgroundQuery';

const TestRandomBackground: React.FC = () => {
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getImage = async () => {
      try {
        const url = await fetchRandomBackground();
        setImageUrl(url);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
        setLoading(false);
      }
    };

    getImage();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2>Image de fond aléatoire :</h2>
      <img src={imageUrl} alt="Random Background" />
    </div>
  );
};

export default TestRandomBackground;
