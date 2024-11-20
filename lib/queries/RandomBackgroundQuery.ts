export const fetchRandomBackgrounds = async (count: number): Promise<string[]> => {
  const images = [
    "/images/backgrounds/bouddhisme.jpg",
    "/images/backgrounds/yoga.jpg",
    "/images/backgrounds/seranyayoga.jpg",
    "/images/backgrounds/seranyayoga1.jpg",
    "/images/backgrounds/yogaismee.jpg",
    "/images/backgrounds/yogaisme.jpg",
  ];

  // Retourne un sous-ensemble aléatoire des images locales
  return images.sort(() => 0.5 - Math.random()).slice(0, count);
};

export const fetchRandomBackground = async (): Promise<string> => {
  const images = [
    "/images/backgrounds/bouddhisme.jpg",
    "/images/backgrounds/yoga.jpg",
    "/images/backgrounds/image3.jpg",
    "/images/backgrounds/yogaismee.jpg",
    "/images/backgrounds/yogaisme.jpg",
  ];

  // Retourne une image au hasard parmi celles disponibles localement
  return images[Math.floor(Math.random() * images.length)];
};
