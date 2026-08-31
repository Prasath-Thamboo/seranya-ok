"use client";

import React from "react";
import LegalLayout from "@/components/LegalLayout";

const PolitiqueCookiesPage = () => {
  return (
    <LegalLayout title="Politique de cookies">
      <p>
        Cette page détaille l&apos;utilisation des cookies et technologies similaires sur le site{" "}
        <strong>Seranya</strong>, en complément de notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
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
        <a href="/confidentialite">politique de confidentialité</a> et nos{" "}
        <a href="/mentions">mentions légales</a>.
      </p>
    </LegalLayout>
  );
};

export default PolitiqueCookiesPage;
