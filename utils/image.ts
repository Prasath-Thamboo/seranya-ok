// utils/image.ts

export const getImageUrl = (url: string | null | undefined) => {
    if (!url) return '/images/backgrounds/placeholder.jpg'; // Path to your placeholder image
  
    // Vérifier si et seulement si l'URL commence par 'http' ou 'https'
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
  
    // Sinon, utiliser un placeholder ou construire une URL locale si nécessaire
    return '/images/backgrounds/placeholder.jpg'; // Adjust as needed
  };
  