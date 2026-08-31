"use client";

import React from "react";
import LegalLayout from "@/components/LegalLayout";

const PolitiqueConfidentialitePage = () => {
  return (
    <LegalLayout title="Politique de confidentialité">
      <p>
        Nous nous engageons à protéger la vie privée de nos utilisateurs conformément aux exigences du
        Règlement Général sur la Protection des Données (RGPD). Vos données personnelles ne seront
        utilisées que pour les besoins du site et pour améliorer l&apos;expérience utilisateur. Elles ne
        seront jamais vendues à des tiers sans votre consentement explicite.
      </p>

      <h2>Données collectées</h2>
      <p>Dans le cadre de l&apos;utilisation de notre site, nous collectons et utilisons des données personnelles telles que :</p>
      <ul>
        <li>Les données de connexion et de navigation (via Google Analytics)</li>
        <li>Les informations fournies lors de la création de votre compte</li>
        <li>Les informations de paiement pour vos achats</li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Vous avez le droit de demander l&apos;accès, la rectification, la suppression, l&apos;opposition
        au traitement ou la portabilité de vos données personnelles à tout moment, via notre{" "}
        <a href="/rgpd">formulaire dédié</a>, ou en nous contactant à l&apos;adresse{" "}
        <strong>contact@seranya-blog.com</strong>. Nous répondons dans un délai maximum d&apos;un mois.
      </p>
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
        auprès de la{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
      </p>

      <h2>Google Analytics</h2>
      <p>
        Ce site utilise Google Analytics pour analyser l&apos;audience et améliorer le contenu proposé.
        Google Analytics utilise des cookies pour collecter des informations de manière anonyme, telles
        que l&apos;IP de l&apos;utilisateur, la durée de la visite, les pages visitées, etc. Ces données
        sont anonymisées et utilisées à des fins statistiques uniquement.
      </p>

      <h2>Gestion des paiements</h2>
      <p>
        Nous utilisons des solutions de paiement sécurisées pour vos transactions en ligne. Les
        informations de paiement que vous fournissez (comme le numéro de carte) sont traitées de
        manière sécurisée par notre fournisseur de services de paiement et ne sont jamais stockées sur
        nos serveurs.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative à vos données personnelles, vous pouvez nous contacter à{" "}
        <strong>contact@seranya-blog.com</strong>. Voir aussi nos <a href="/mentions">mentions légales</a>.
      </p>
    </LegalLayout>
  );
};

export default PolitiqueConfidentialitePage;
