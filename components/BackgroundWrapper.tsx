// spectralnext/components/BackgroundWrapper.tsx

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
  const [randomBackgroundImage, setRandomBackgroundImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadRandomBackgroundImage = async () => {
      if (!backgroundImage) {
        try {
          const imageUrl: string = await fetchRandomBackground();
          setRandomBackgroundImage(imageUrl);
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
  const finalBackgroundImage: string | undefined = backgroundImage || randomBackgroundImage;

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
              onLoad={onLoad} // Appel du callback onLoad
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
