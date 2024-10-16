// spectralnext/lib/queries/RandomBackgroundQuery.ts

export const fetchRandomBackground = async (): Promise<string> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/random-background`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'image de fond');
      }
      const data = await response.json();
      return data.imageUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur inconnue lors de la récupération de l\'image de fond');
    }
  };
  