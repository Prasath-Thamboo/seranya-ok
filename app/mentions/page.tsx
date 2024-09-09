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
        <h1 className="text-4xl font-bold mb-12 mt-10 lg:mt-16">Mentions Légales et Politique de Confidentialité</h1>

        <div className="max-w-4xl mx-auto bg-black/50 p-6 md:p-12 rounded-lg shadow-lg">
          <p className="mb-6 leading-relaxed">
            Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l&apos;Économie Numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site <strong>Nom du site</strong> les présentes mentions légales.
          </p>

          <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
          <p className="mb-6 leading-relaxed">
            Le site <strong>Nom du site</strong> est édité par <strong>Nom de la société</strong>, ayant son siège social à <strong>Adresse de l&apos;entreprise</strong>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Données personnelles</h2>
          <p className="mb-6 leading-relaxed">
            Dans le cadre de l&apos;utilisation de notre site, nous collectons et utilisons des données personnelles telles que :
          </p>
          <ul className="list-disc text-left mx-auto mb-6 leading-relaxed max-w-md">
            <li>Les données de connexion et de navigation (via Google Analytics)</li>
            <li>Les informations fournies lors de la création de votre compte</li>
            <li>Les informations de paiement pour vos achats</li>
          </ul>
          <p className="mb-6 leading-relaxed">
            Ces données sont collectées dans le respect du Règlement Général sur la Protection des Données (RGPD) et vous pouvez exercer votre droit d&apos;accès, de rectification ou de suppression en nous contactant à l&apos;adresse <strong>spectral5.0.95@gmail.com</strong>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Politique de Confidentialité</h2>
          <p className="mb-6 leading-relaxed">
            Nous nous engageons à protéger la vie privée de nos utilisateurs conformément aux exigences du RGPD. Vos données personnelles ne seront utilisées que pour les besoins du site et pour améliorer l&apos;expérience utilisateur. Elles ne seront jamais vendues à des tiers sans votre consentement explicite.
          </p>
          <p className="mb-6 leading-relaxed">
            Vous avez le droit de demander l&apos;accès, la rectification ou la suppression de vos données personnelles à tout moment. Pour exercer ces droits, vous pouvez nous contacter à <strong>spectral5.0.95@gmail.com</strong>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Google Analytics</h2>
          <p className="mb-6 leading-relaxed">
            Ce site utilise Google Analytics pour analyser l&apos;audience et améliorer le contenu proposé. Google Analytics utilise des cookies pour collecter des informations de manière anonyme, telles que l&apos;IP de l&apos;utilisateur, la durée de la visite, les pages visitées, etc. Ces données sont anonymisées et utilisées à des fins statistiques uniquement.
          </p>

          <h2 className="text-2xl font-bold mb-4">Gestion des paiements</h2>
          <p className="mb-6 leading-relaxed">
            Nous utilisons des solutions de paiement sécurisées pour vos transactions en ligne. Les informations de paiement que vous fournissez (comme le numéro de carte) sont traitées de manière sécurisée par notre fournisseur de services de paiement et ne sont jamais stockées sur nos serveurs.
          </p>

          <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
          <p className="mb-6 leading-relaxed">
            Le site est hébergé sur <strong>Amazon Lightsail</strong>, une infrastructure fournie par Amazon Web Services (AWS). Le siège social d&apos;Amazon est situé à <strong>410 Terry Avenue North, Seattle, WA 98109-5210, États-Unis</strong>.
          </p>

          <h2 className="text-2xl font-bold mb-4">Images du site</h2>
          <p className="mb-6 leading-relaxed">
            Toutes les images présentes sur ce site ont été générées par une intelligence artificielle. Ces images sont libres de droits d&apos;auteur et peuvent être utilisées sans restriction dans le cadre du site.
          </p>

          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="mb-6 leading-relaxed">
            Pour toute question ou réclamation, vous pouvez nous contacter à <strong>spectral5.0.95@gmail.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegalesPage;
