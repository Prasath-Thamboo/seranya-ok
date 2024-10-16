// spectralnext/lib/queries/RandomBackgroundQuery.ts

export const fetchRandomBackground = async (): Promise<string> => {
    try {
      // Utilisation de l'URL du backend en dur
      const response = await fetch('https://api.spectralunivers.com/api/random-background');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'image de fond');
      }
      const data = await response.json();
      return data.imageUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur inconnue lors de la récupération de l\'image de fond');
    }
  };
  

export const fetchRandomBackgrounds = async (count: number = 5): Promise<string[]> => {
    try {
      const response = await fetch(`https://api.spectralunivers.com/api/random-backgrounds?count=${count}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des images de fond');
      }
      const data = await response.json();
      return data.imageUrls;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur inconnue lors de la récupération des images de fond');
    }
  };