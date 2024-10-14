// spectralnext/components/Footer.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

interface FooterProps {
  backgroundImage?: string; // Optional prop for the background image
}

// Utilisation d'un flag global pour s'assurer que le Footer n'est rendu qu'une seule fois
let footerRendered = false;

const Footer: React.FC<FooterProps> = ({ backgroundImage }) => {
  const [randomBackgroundImage, setRandomBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Load a random image only if no backgroundImage (footerImage) is provided
    const loadRandomBackgroundImage = async () => {
      if (!backgroundImage) {
        try {
          const response = await fetch('/api/getRandomImage');
          const data = await response.json();
          setRandomBackgroundImage(data.imagePath);
        } catch (error) {
          console.error("Failed to load random background image:", error);
        }
      }
    };

    loadRandomBackgroundImage();
  }, [backgroundImage]);

  // Use the provided backgroundImage or fallback to the randomBackgroundImage if no backgroundImage is provided
  const finalBackgroundImage = backgroundImage || randomBackgroundImage;

  // Si le footer a déjà été rendu, ne pas le rendre à nouveau
  if (footerRendered) {
    return null;
  }

  // Marquer le footer comme rendu
  footerRendered = true;

  return (
    <footer className="relative block text-white font-iceberg uppercase">
      {/* Background image with opaque filter */}
      <div className="absolute inset-0 z-0">
        {finalBackgroundImage && (
          <Image
            src={finalBackgroundImage}
            alt="Footer background"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Footer content */}
      <div className="relative z-10 py-16 md:py-20 mx-auto w-full max-w-7xl px-5 md:px-10 border-t-2 border-b-2 border-gray-800">
        <div className="flex-col flex items-center">
          {/* Logo */}
          <a href="#" className="mb-8 inline-block max-w-full">
            <Image
              src="/logos/spectral-high-resolution-logo-white-transparent.png"
              alt="Logo Spectral"
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
  );
};

export default Footer;
