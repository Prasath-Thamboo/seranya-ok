"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const fetchRandomImage = async () => {
  const res = await fetch("/api/getRandomImage");
  const data = await res.json();
  return data.imagePath;
};

const MentionsLegalesPage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    const fetchBgImage = async () => {
      const image = await fetchRandomImage();
      setBackgroundImage(image);
    };

    fetchBgImage();
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white font-kanit">

      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              filter: "brightness(70%)",
              backgroundAttachment: "fixed",
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        </div>
      )}

      <div className="relative z-10 py-16 px-4 lg:px-24 text-center">
        <h1 className="text-4xl font-bold mb-12 mt-10 lg:mt-16">Mentions Légales</h1>

        <div className="max-w-4xl mx-auto bg-black/50 p-6 md:p-12 rounded-lg shadow-lg">
          <p className="mb-6 leading-relaxed">
            Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site <strong>Seranya</strong> les présentes mentions légales.
          </p>

          <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
          <p className="mb-6 leading-relaxed">
            Le site est hébergé sur <strong>Amazon Lightsail</strong>, une infrastructure fournie par Amazon Web Services (AWS). Le siège social d&apos;Amazon est situé à <strong>410 Terry Avenue North, Seattle, WA 98109-5210, États-Unis</strong>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Images du site</h2>
          <p className="mb-6 leading-relaxed">
            Toutes les images présentes sur ce site ont été générées par une intelligence artificielle. Ces images sont libres de droits d&apos;auteur et peuvent être utilisées sans restriction dans le cadre du site.
          </p>

          <h2 className="text-2xl font-bold mb-4">Vie privée et données personnelles</h2>
          <p className="mb-6 leading-relaxed">
            Le traitement de vos données personnelles et vos droits en la matière sont détaillés dans notre{' '}
            <a href="/confidentialite" className="underline text-green-400 hover:text-green-300">politique de confidentialité</a>. Vous pouvez exercer vos droits via notre{' '}
            <a href="/rgpd" className="underline text-green-400 hover:text-green-300">formulaire de demande d&apos;accès aux données</a>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="mb-6 leading-relaxed">
            Pour toute question ou réclamation, vous pouvez nous contacter à <strong>contact@seranya.fr</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegalesPage;
