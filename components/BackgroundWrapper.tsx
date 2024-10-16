// spectralnext/components/BackgroundWrapper.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface BackgroundWrapperProps {
  children: React.ReactNode;
  backgroundImage?: string; // Optional prop for the background image
  overlayOpacity?: number; // Optional prop to adjust overlay opacity
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  backgroundImage,
  overlayOpacity = 0.5,
}) => {
  const [randomBackgroundImage, setRandomBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Load a random image only if no backgroundImage is provided
    const loadRandomBackgroundImage = async () => {
      if (!backgroundImage) {
        try {
          const response = await fetch('/api/getRandomImage');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setRandomBackgroundImage(data.imagePath);
        } catch (error: any) {
          console.error("Failed to load random background image:", error);
          setLoadError(error.message || 'Erreur inconnue');
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadRandomBackgroundImage();
  }, [backgroundImage]);

  // Use the provided backgroundImage or fallback to the randomBackgroundImage if no backgroundImage is provided
  const finalBackgroundImage = backgroundImage || randomBackgroundImage;

  return (
    <div className="relative w-full">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        {finalBackgroundImage ? (
          <>
            <Image
              src={finalBackgroundImage}
              alt="Background"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              priority={false}
              quality={75}
              className="opacity-50"
            />
            <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
          </>
        ) : (
          // Fallback background color if no image is available
          <div className="absolute inset-0 bg-gray-800"></div>
        )}
      </div>

      {/* Contenu de l'enfant */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
