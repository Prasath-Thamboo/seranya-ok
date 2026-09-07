"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import LegalLayout from "@/components/LegalLayout";

const FrBody = () => (
  <>
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
      <Link href="/rgpd">formulaire dédié</Link>, ou en nous contactant à l&apos;adresse{" "}
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
      <strong>contact@seranya-blog.com</strong>. Voir aussi nos <Link href="/mentions">mentions légales</Link>.
    </p>
  </>
);

const EnBody = () => (
  <>
    <p>
      We are committed to protecting the privacy of our users in accordance with the requirements of
      the General Data Protection Regulation (GDPR). Your personal data will only be used for the
      needs of the site and to improve the user experience. It will never be sold to third parties
      without your explicit consent.
    </p>

    <h2>Data collected</h2>
    <p>As part of your use of our site, we collect and use personal data such as:</p>
    <ul>
      <li>Connection and browsing data (via Google Analytics)</li>
      <li>The information provided when creating your account</li>
      <li>Payment information for your purchases</li>
    </ul>

    <h2>Your rights</h2>
    <p>
      You have the right to request access, rectification, erasure, objection to processing, or
      portability of your personal data at any time, through our{" "}
      <Link href="/rgpd">dedicated form</Link>, or by contacting us at{" "}
      <strong>contact@seranya-blog.com</strong>. We respond within a maximum of one month.
    </p>
    <p>
      If you believe that your rights are not being respected, you may lodge a complaint with the
      French data protection authority,{" "}
      <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">the CNIL</a>.
    </p>

    <h2>Google Analytics</h2>
    <p>
      This site uses Google Analytics to analyse traffic and improve the content offered. Google
      Analytics uses cookies to collect information anonymously, such as the user&apos;s IP address,
      visit duration, pages visited, etc. This data is anonymised and used for statistical purposes
      only.
    </p>

    <h2>Payment handling</h2>
    <p>
      We use secure payment solutions for your online transactions. The payment information you
      provide (such as your card number) is processed securely by our payment service provider and is
      never stored on our servers.
    </p>

    <h2>Contact</h2>
    <p>
      For any question relating to your personal data, you can contact us at{" "}
      <strong>contact@seranya-blog.com</strong>. See also our <Link href="/mentions">legal notice</Link>.
    </p>
  </>
);

const PolitiqueConfidentialitePage = () => {
  const isEn = useLocale() === "en";
  return (
    <LegalLayout title={isEn ? "Privacy policy" : "Politique de confidentialité"}>
      {isEn ? <EnBody /> : <FrBody />}
    </LegalLayout>
  );
};

export default PolitiqueConfidentialitePage;
