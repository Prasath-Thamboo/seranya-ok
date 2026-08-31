"use client";

import React from "react";
import LegalLayout from "@/components/LegalLayout";

const MentionsLegalesPage = () => {
  return (
    <LegalLayout title="Mentions légales">
      <p>
        Conformément aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004
        pour la Confiance dans l&apos;Économie Numérique, dite L.C.E.N., il est porté à la connaissance
        des utilisateurs et visiteurs du site <strong>Seranya</strong> les présentes mentions légales.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé sur <strong>Amazon Lightsail</strong>, une infrastructure fournie par
        Amazon Web Services (AWS). Le siège social d&apos;Amazon est situé à{" "}
        <strong>410 Terry Avenue North, Seattle, WA 98109-5210, États-Unis</strong>.
      </p>

      <h2>Images du site</h2>
      <p>
        Toutes les images présentes sur ce site ont été générées par une intelligence artificielle.
        Ces images sont libres de droits d&apos;auteur et peuvent être utilisées sans restriction dans
        le cadre du site.
      </p>

      <h2>Vie privée et données personnelles</h2>
      <p>
        Le traitement de vos données personnelles et vos droits en la matière sont détaillés dans notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>. Vous pouvez exercer vos droits via
        notre <a href="/rgpd">formulaire de demande d&apos;accès aux données</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question ou réclamation, vous pouvez nous contacter à{" "}
        <strong>contact@seranya-blog.com</strong>.
      </p>
    </LegalLayout>
  );
};

export default MentionsLegalesPage;
