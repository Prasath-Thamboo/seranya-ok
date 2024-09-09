"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "antd";

export default function CookieConsent() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClient, setIsClient] = useState(false); // Assurer le rendu uniquement côté client

  useEffect(() => {
    // Utiliser un effet pour indiquer que le composant est monté côté client
    setIsClient(true);

    // Vérifier si un consentement a été donné
    const consent = localStorage.getItem("cookieConsent");

    // Si aucun consentement n'a été donné, afficher la modale
    if (!consent) {
      setIsModalVisible(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsModalVisible(false); // Ferme la modale après acceptation
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setIsModalVisible(false); // Ferme la modale après refus

    // Supprime les cookies tiers (par exemple ceux de Google Analytics)
    document.cookie = "_ga=; Max-Age=-99999999;";
    document.cookie = "_gid=; Max-Age=-99999999;";
  };

  // Si le composant n'est pas encore monté côté client, ne rien rendre
  if (!isClient) {
    return null;
  }

  return (
    <Modal
      title="Consentement aux cookies"
      open={isModalVisible} // Utilisation de "open" pour Ant Design v5+
      footer={[
        <Button key="decline" danger onClick={handleDeclineCookies}>
          Refuser
        </Button>,
        <Button key="accept" type="primary" onClick={handleAcceptCookies}>
          Accepter
        </Button>,
      ]}
      closable={false} // Empêche de fermer la modale sans interaction
      centered // Centrer la modale
    >
      <p>
        Nous utilisons des cookies pour améliorer votre expérience sur notre
        site et pour collecter des données à des fins statistiques. En acceptant,
        vous consentez à une utilisation des cookies, y compris ceux de Google
        Analytics. Vous pouvez consulter notre politique de confidentialité pour en
        savoir plus.
      </p>
    </Modal>
  );
}
