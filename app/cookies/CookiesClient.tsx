"use client";

import React, { useEffect, useState } from "react";

const fetchRandomImage = async () => {
  const res = await fetch("/api/getRandomImage");
  const data = await res.json();
  return data.imagePath;
};

const PolitiqueCookiesPage = () => {
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
        <h1 className="text-4xl font-bold uppercase mb-12 mt-10 lg:mt-16">Politique de Cookies</h1>

        <div className="max-w-4xl mx-auto bg-black/50 p-6 md:p-12 rounded-lg shadow-lg">
          <p className="mb-6 leading-relaxed">
            Cette page détaille l&apos;utilisation des cookies et technologies similaires sur le site <strong>Seranya</strong>, en complément de notre{' '}
            <a href="/confidentialite" className="underline text-green-400 hover:text-green-300">politique de confidentialité</a>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Qu&apos;est-ce qu&apos;un cookie ?</h2>
          <p className="mb-6 leading-relaxed">
            Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d&apos;un site. Il permet de conserver des informations (préférences, mesure d&apos;audience, etc.) le temps d&apos;une visite ou entre plusieurs visites.
          </p>

          <h2 className="text-2xl font-bold mb-4">Cookies utilisés sur ce site</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 pr-4 font-bold">Nom</th>
                  <th className="py-2 pr-4 font-bold">Finalité</th>
                  <th className="py-2 pr-4 font-bold">Émetteur</th>
                  <th className="py-2 font-bold">Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4">_ga</td>
                  <td className="py-2 pr-4">Distinction des utilisateurs (mesure d&apos;audience)</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2">13 mois</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2 pr-4">_gid</td>
                  <td className="py-2 pr-4">Distinction des utilisateurs (mesure d&apos;audience)</td>
                  <td className="py-2 pr-4">Google Analytics</td>
                  <td className="py-2">24 heures</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">cookieConsent</td>
                  <td className="py-2 pr-4">Mémorisation de votre choix de consentement aux cookies (stocké localement dans votre navigateur, pas un cookie HTTP)</td>
                  <td className="py-2 pr-4">Seranya</td>
                  <td className="py-2">Jusqu&apos;à suppression par vos soins</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mb-6 leading-relaxed">
            Les cookies Google Analytics ne sont déposés qu&apos;après votre consentement explicite via la bannière affichée lors de votre première visite. Aucun cookie de mesure d&apos;audience n&apos;est déposé si vous refusez ou n&apos;avez pas encore répondu.
          </p>

          <h2 className="text-2xl font-bold mb-4">Gérer votre consentement</h2>
          <p className="mb-6 leading-relaxed">
            Vous pouvez à tout moment retirer votre consentement en supprimant les cookies <strong>_ga</strong> et <strong>_gid</strong> ainsi que la donnée <strong>cookieConsent</strong> dans les paramètres de votre navigateur. La bannière de consentement vous sera alors présentée à nouveau lors de votre prochaine visite.
          </p>

          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="mb-6 leading-relaxed">
            Pour toute question relative aux cookies, vous pouvez nous contacter à <strong>contact@seranya-blog.com</strong>. Voir aussi notre{' '}
            <a href="/confidentialite" className="underline text-green-400 hover:text-green-300">politique de confidentialité</a> et nos{' '}
            <a href="/mentions" className="underline text-green-400 hover:text-green-300">mentions légales</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueCookiesPage;
