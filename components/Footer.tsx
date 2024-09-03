import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour charger une image aléatoire du serveur
    const loadRandomBackgroundImage = async () => {
      try {
        const response = await fetch('/api/getRandomImage');
        const data = await response.json();
        setBackgroundImage(data.imagePath);
      } catch (error) {
        console.error("Failed to load random background image:", error);
      }
    };

    loadRandomBackgroundImage();
  }, []);

  return (
    <footer className="relative block text-white font-kanit">
      {/* Image de fond avec filtre opaque */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Image de fond du footer"
            layout="fill"
            objectFit="cover"
            className="opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 py-16 md:py-20 mx-auto w-full max-w-7xl px-5 md:px-10 border-t-2 border-b-2 border-gray-800">
        <div className="flex-col flex items-center">
          <a href="#" className="mb-8 inline-block max-w-full">
            <Image
              src="https://assets.website-files.com/6458c625291a94a195e6cf3a/6458c625291a94d6f4e6cf96_Group%2047874-3.png"
              alt="Logo"
              width={160} // Remplace cette valeur par la largeur réelle de l'image
              height={40} // Remplace cette valeur par la hauteur réelle de l'image
              className="inline-block"
            />
          </a>
          <div className="text-center font-semibold">
            <a
              href="#"
              className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
            >
              À propos
            </a>
            <a
              href="#"
              className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
            >
              Fonctionnalités
            </a>
            <a
              href="#"
              className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
            >
              Projets
            </a>
            <a
              href="#"
              className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
            >
              Support
            </a>
            <a
              href="#"
              className="inline-block px-6 py-2 font-normal transition hover:text-blue-400"
            >
              Aide
            </a>
          </div>
          <div className="mb-8 mt-8 border-b border-gray-500 w-48"></div>
          <div className="mb-12 grid grid-cols-3 grid-flow-col w-full max-w-52 gap-3 items-start">
            <a href="#" className="mx-auto flex-col flex items-center text-white">
              <FaGithub size={32} />
            </a>
            <a href="#" className="mx-auto flex-col flex items-center text-white">
              <FaTwitter size={32} />
            </a>
            <a href="#" className="mx-auto flex-col flex items-center text-white">
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
