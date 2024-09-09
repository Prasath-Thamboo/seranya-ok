"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Suspense } from 'react';

const fetchRandomImage = async () => {
  const res = await fetch("/api/getRandomImage");
  const data = await res.json();
  return data.imagePath;
};

// Composant pour gérer la confirmation avec Suspense
function ConfirmationContent() {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Utilisation de useSearchParams côté client uniquement
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;

  useEffect(() => {
    const confirmEmail = async () => {
      if (token) {
        try {
          const response = await axios.get(`/auth/confirm?token=${token}`);
          setConfirmationMessage('Votre compte a été confirmé avec succès.');
          console.log('Confirmation réussie', response.data);
        } catch (error) {
          setErrorMessage("La confirmation de votre email a échoué. Le lien est peut-être expiré ou invalide.");
          console.error('Erreur lors de la confirmation', error);
        }
      } else {
        setErrorMessage("Token non trouvé. Veuillez vérifier votre lien de confirmation.");
      }
    };

    const loadBackgroundImage = async () => {
      try {
        const image = await fetchRandomImage();
        setBackgroundImage(image);
      } catch (error) {
        console.error("Erreur lors du chargement de l'image de fond", error);
      }
    };

    confirmEmail();
    loadBackgroundImage();
  }, [token]);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center font-kanit text-center bg-gray-100">
      
      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              filter: "brightness(70%)",
              backgroundAttachment: "fixed",
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        </div>
      )}

      <div className="relative z-10">
        {confirmationMessage ? (
          <>
            <h1 className="text-4xl font-bold mb-8 text-white">Confirmation réussie !</h1>
            <p className="text-lg mb-6 text-gray-200">{confirmationMessage}</p>
          </>
        ) : errorMessage ? (
          <>
            <h1 className="text-4xl font-bold mb-8 text-red-600">Erreur de confirmation</h1>
            <p className="text-lg mb-6 text-red-400">{errorMessage}</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-8 text-white">Inscription presque terminée !</h1>
            <p className="text-lg mb-6 text-gray-200">
              Nous traitons votre demande de confirmation. Veuillez patienter...
            </p>
          </>
        )}

        <Link href="/auth/login" className="text-blue-400 hover:underline">
          Retour à la page de connexion
        </Link>
      </div>
    </div>
  );
}

// Composant parent avec Suspense pour gérer le rendu côté client
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
