// seranyanext/components/BackgroundWrapper.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery"; // Import de la fonction mise à jour

interface BackgroundWrapperProps {
  children: React.ReactNode;
  backgroundImage?: string; // Optional prop for the background image
  overlayOpacity?: number; // Optional prop to adjust overlay opacity
  onLoad?: () => void; // Optional onLoad callback
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  backgroundImage,
  overlayOpacity = 0.5,
  onLoad,
}) => {
  const [finalBackgroundImage, setFinalBackgroundImage] = useState<string | undefined>(backgroundImage);
  const [isLoading, setIsLoading] = useState<boolean>(!backgroundImage);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!backgroundImage) {
      const loadRandomBackgroundImage = async () => {
        try {
          const imageUrl: string = await fetchRandomBackground();
          console.log('BackgroundWrapper - Image URL:', imageUrl); // Ajoutez cette ligne
          setFinalBackgroundImage(imageUrl);
        } catch (error: any) {
          console.error("Failed to load random background image:", error);
          setLoadError(error.message || 'Erreur inconnue');
        } finally {
          setIsLoading(false);
        }
      };

      loadRandomBackgroundImage();
    }
  }, [backgroundImage]);

  if (isLoading) {
    return (
      <div className="relative w-full">
        {/* Loader ou placeholder */}
        <div className="flex justify-center items-center h-20">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
        </div>
        {children}
      </div>
    );
  }

  if (loadError) {
    console.error("BackgroundWrapper encountered an error:", loadError); // Ajoutez cette ligne
  }

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
              onLoadingComplete={onLoad} // Utiliser onLoadingComplete pour une meilleure compatibilité
              unoptimized={true} // Ajoutez ce prop
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
