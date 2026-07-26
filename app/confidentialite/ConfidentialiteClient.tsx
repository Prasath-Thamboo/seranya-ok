"use client";

import React, { useEffect, useState } from "react";

const fetchRandomImage = async () => {
  const res = await fetch("/api/getRandomImage");
  const data = await res.json();
  return data.imagePath;
};

const PolitiqueConfidentialitePage = () => {
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
        <h1 className="text-4xl font-bold mb-12 mt-10 lg:mt-16">Politique de Confidentialité</h1>

        <div className="max-w-4xl mx-auto bg-black/50 p-6 md:p-12 rounded-lg shadow-lg">
          <p className="mb-6 leading-relaxed">
            Nous nous engageons à protéger la vie privée de nos utilisateurs conformément aux exigences du Règlement Général sur la Protection des Données (RGPD). Vos données personnelles ne seront utilisées que pour les besoins du site et pour améliorer l&apos;expérience utilisateur. Elles ne seront jamais vendues à des tiers sans votre consentement explicite.
          </p>

          <h2 className="text-2xl font-bold mb-4">Données collectées</h2>
          <p className="mb-6 leading-relaxed">
            Dans le cadre de l&apos;utilisation de notre site, nous collectons et utilisons des données personnelles telles que :
          </p>
          <ul className="list-disc text-left mx-auto mb-6 leading-relaxed max-w-md">
            <li>Les données de connexion et de navigation (via Google Analytics)</li>
            <li>Les informations fournies lors de la création de votre compte</li>
            <li>Les informations de paiement pour vos achats</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Vos droits</h2>
          <p className="mb-6 leading-relaxed">
            Vous avez le droit de demander l&apos;accès, la rectification, la suppression, l&apos;opposition au traitement ou la portabilité de vos données personnelles à tout moment, via notre{' '}
            <a href="/rgpd" className="underline text-green-400 hover:text-green-300">formulaire dédié</a>, ou en nous contactant à l&apos;adresse <strong>contact@seranya-blog.com</strong>. Nous répondons dans un délai maximum d&apos;un mois.
          </p>
          <p className="mb-6 leading-relaxed">
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline text-green-400 hover:text-green-300">CNIL</a>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Google Analytics</h2>
          <p className="mb-6 leading-relaxed">
            Ce site utilise Google Analytics pour analyser l&apos;audience et améliorer le contenu proposé. Google Analytics utilise des cookies pour collecter des informations de manière anonyme, telles que l&apos;IP de l&apos;utilisateur, la durée de la visite, les pages visitées, etc. Ces données sont anonymisées et utilisées à des fins statistiques uniquement.
          </p>

          <h2 className="text-2xl font-bold mb-4">Gestion des paiements</h2>
          <p className="mb-6 leading-relaxed">
            Nous utilisons des solutions de paiement sécurisées pour vos transactions en ligne. Les informations de paiement que vous fournissez (comme le numéro de carte) sont traitées de manière sécurisée par notre fournisseur de services de paiement et ne sont jamais stockées sur nos serveurs.
          </p>

          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="mb-6 leading-relaxed">
            Pour toute question relative à vos données personnelles, vous pouvez nous contacter à <strong>contact@seranya-blog.com</strong>. Voir aussi nos{' '}
            <a href="/mentions" className="underline text-green-400 hover:text-green-300">mentions légales</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialitePage;
