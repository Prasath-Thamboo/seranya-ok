// seranyanext/components/Footer.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery"; // Import de la fonction mise à jour

interface FooterProps {
  onLoad?: () => void; // Optional onLoad callback
}

const Footer: React.FC<FooterProps> = ({ onLoad }) => {
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadRandomBackgroundImage = async () => {
      try {
        const imageUrl: string = await fetchRandomBackground();
        console.log('Footer - Image URL:', imageUrl); // Ajoutez cette ligne
        setBackgroundImage(imageUrl);
      } catch (error: any) {
        console.error("Failed to load random background image for footer:", error);
        setLoadError(error.message || 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    loadRandomBackgroundImage();
  }, []);

  if (isLoading) {
    return (
      <footer className="relative block text-white font-iceberg uppercase">
        {/* Loader ou placeholder */}
        <div className="flex justify-center items-center h-20">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
        </div>
      </footer>
    );
  }

  if (loadError) {
    console.error("Footer encountered an error:", loadError); // Ajoutez cette ligne
    return (
      <BackgroundWrapper overlayOpacity={0.7}>
        {/* Afficher le footer sans image de fond ou avec une image de fallback */}
        <footer className="relative block text-white font-iceberg uppercase">
          <div className="relative z-10 py-16 md:py-20 mx-auto w-full max-w-7xl px-5 md:px-10 border-t-2 border-b-2 border-gray-800">
            <div className="flex-col flex items-center">
              {/* Logo */}
              <a href="#" className="mb-8 inline-block max-w-full">
                <Image
                  src="/logos/seranyaicon.png"
                  alt="Logo Seranya"
                  width={160}
                  height={40}
                  className="inline-block object-contain"
                />
              </a>

              {/* Menu */}
              <div className="text-center font-semibold">
                <a
                  href="/about"
                  className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
                >
                  À propos
                </a>
                <a
                  href="/mentions"
                  className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
                >
                  Mentions légales
                </a>
                <a
                  href="#"
                  className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
                >
                  © Copyright
                </a>
              </div>

              <div className="mb-8 mt-8 border-b border-gray-500 w-48"></div>

              {/* Social media links */}
              <div className="mb-12 grid grid-cols-3 grid-flow-col w-full max-w-52 gap-3 items-start">
                <a href="https://github.com" className="mx-auto flex-col flex items-center text-white">
                  <FaGithub size={32} />
                </a>
                <a href="https://twitter.com" className="mx-auto flex-col flex items-center text-white">
                  <FaTwitter size={32} />
                </a>
                <a href="https://instagram.com" className="mx-auto flex-col flex items-center text-white">
                  <FaInstagram size={32} />
                </a>
              </div>

              <p className="text-sm sm:text-base">© Copyright 2021. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper backgroundImage={backgroundImage} overlayOpacity={0.7} onLoad={onLoad}>
      {/* Footer content */}
      <footer className="relative block text-white font-iceberg uppercase">
        <div className="relative z-10 py-16 md:py-20 mx-auto w-full max-w-7xl px-5 md:px-10 border-t-2 border-b-2 border-gray-800">
          <div className="flex-col flex items-center">
            {/* Logo */}
            <a href="#" className="mb-8 inline-block max-w-full">
              <Image
                src="/logos/seranyaicon.png"
                alt="Logo Seranya"
                width={160}
                height={40}
                className="inline-block object-contain"
              />
            </a>

            {/* Menu */}
            <div className="text-center font-semibold">
              <a
                href="/about"
                className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
              >
                À propos
              </a>
              <a
                href="/mentions"
                className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
              >
                Mentions légales
              </a>
              <a
                href="#"
                className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
              >
                © Copyright
              </a>
            </div>

            <div className="mb-8 mt-8 border-b border-gray-500 w-48"></div>

            {/* Social media links */}
            <div className="mb-12 grid grid-cols-3 grid-flow-col w-full max-w-52 gap-3 items-start">
              <a href="https://github.com" className="mx-auto flex-col flex items-center text-white">
                <FaGithub size={32} />
              </a>
              <a href="https://twitter.com" className="mx-auto flex-col flex items-center text-white">
                <FaTwitter size={32} />
              </a>
              <a href="https://instagram.com" className="mx-auto flex-col flex items-center text-white">
                <FaInstagram size={32} />
              </a>
            </div>

            <p className="text-sm sm:text-base">© Copyright 2021. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </BackgroundWrapper>
  );
};

export default Footer;
