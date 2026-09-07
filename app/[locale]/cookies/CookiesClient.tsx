"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import LegalLayout from "@/components/LegalLayout";

const FrBody = () => (
  <>
    <p>
      Cette page détaille l&apos;utilisation des cookies et technologies similaires sur le site{" "}
      <strong>Seranya</strong>, en complément de notre{" "}
      <Link href="/confidentialite">politique de confidentialité</Link>.
    </p>

    <h2>Qu&apos;est-ce qu&apos;un cookie ?</h2>
    <p>
      Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d&apos;un site.
      Il permet de conserver des informations (préférences, mesure d&apos;audience, etc.) le temps
      d&apos;une visite ou entre plusieurs visites.
    </p>

    <h2>Cookies utilisés sur ce site</h2>
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Finalité</th>
            <th>Émetteur</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga</td>
            <td>Distinction des utilisateurs (mesure d&apos;audience)</td>
            <td>Google Analytics</td>
            <td>13 mois</td>
          </tr>
          <tr>
            <td>_gid</td>
            <td>Distinction des utilisateurs (mesure d&apos;audience)</td>
            <td>Google Analytics</td>
            <td>24 heures</td>
          </tr>
          <tr>
            <td>cookieConsent</td>
            <td>
              Mémorisation de votre choix de consentement aux cookies (stocké localement dans votre
              navigateur, pas un cookie HTTP)
            </td>
            <td>Seranya</td>
            <td>Jusqu&apos;à suppression par vos soins</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Les cookies Google Analytics ne sont déposés qu&apos;après votre consentement explicite via la
      bannière affichée lors de votre première visite. Aucun cookie de mesure d&apos;audience
      n&apos;est déposé si vous refusez ou n&apos;avez pas encore répondu.
    </p>

    <h2>Gérer votre consentement</h2>
    <p>
      Vous pouvez à tout moment retirer votre consentement en supprimant les cookies{" "}
      <strong>_ga</strong> et <strong>_gid</strong> ainsi que la donnée <strong>cookieConsent</strong>{" "}
      dans les paramètres de votre navigateur. La bannière de consentement vous sera alors présentée à
      nouveau lors de votre prochaine visite.
    </p>

    <h2>Contact</h2>
    <p>
      Pour toute question relative aux cookies, vous pouvez nous contacter à{" "}
      <strong>contact@seranya-blog.com</strong>. Voir aussi notre{" "}
      <Link href="/confidentialite">politique de confidentialité</Link> et nos{" "}
      <Link href="/mentions">mentions légales</Link>.
    </p>
  </>
);

const EnBody = () => (
  <>
    <p>
      This page details the use of cookies and similar technologies on the <strong>Seranya</strong>{" "}
      website, in addition to our <Link href="/confidentialite">privacy policy</Link>.
    </p>

    <h2>What is a cookie?</h2>
    <p>
      A cookie is a small text file placed on your device when you visit a site. It stores
      information (preferences, traffic measurement, etc.) for the duration of a visit or between
      several visits.
    </p>

    <h2>Cookies used on this site</h2>
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Issuer</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>_ga</td>
            <td>Distinguishing users (traffic measurement)</td>
            <td>Google Analytics</td>
            <td>13 months</td>
          </tr>
          <tr>
            <td>_gid</td>
            <td>Distinguishing users (traffic measurement)</td>
            <td>Google Analytics</td>
            <td>24 hours</td>
          </tr>
          <tr>
            <td>cookieConsent</td>
            <td>
              Storing your cookie consent choice (stored locally in your browser, not an HTTP cookie)
            </td>
            <td>Seranya</td>
            <td>Until you delete it</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Google Analytics cookies are only placed after your explicit consent via the banner shown on
      your first visit. No traffic-measurement cookie is placed if you decline or have not yet
      responded.
    </p>

    <h2>Managing your consent</h2>
    <p>
      You can withdraw your consent at any time by deleting the <strong>_ga</strong> and{" "}
      <strong>_gid</strong> cookies as well as the <strong>cookieConsent</strong> entry in your
      browser settings. The consent banner will then be shown to you again on your next visit.
    </p>

    <h2>Contact</h2>
    <p>
      For any question relating to cookies, you can contact us at{" "}
      <strong>contact@seranya-blog.com</strong>. See also our{" "}
      <Link href="/confidentialite">privacy policy</Link> and our{" "}
      <Link href="/mentions">legal notice</Link>.
    </p>
  </>
);

const PolitiqueCookiesPage = () => {
  const isEn = useLocale() === "en";
  return (
    <LegalLayout title={isEn ? "Cookie policy" : "Politique de cookies"}>
      {isEn ? <EnBody /> : <FrBody />}
    </LegalLayout>
  );
};

export default PolitiqueCookiesPage;
