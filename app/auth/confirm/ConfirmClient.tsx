"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Suspense } from 'react';
import React from 'react';

const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_LOCAL;

// Composant pour gérer la confirmation avec Suspense
function ConfirmationContent() {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Utilisation de useSearchParams côté client uniquement
  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;

  useEffect(() => {
    const confirmEmail = async () => {
      if (token) {
        try {
          const response = await axios.get(`${backendUrl}/auth/confirm?token=${token}`);
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

    confirmEmail();
  }, [token]);

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-page px-6 text-center font-sans text-ink">
      <div className="relative z-10 max-w-md">
        {confirmationMessage ? (
          <>
            <h1 className="mb-6 font-serif text-3xl font-medium text-ink">Confirmation réussie</h1>
            <p className="mb-8 text-ink-soft">{confirmationMessage}</p>
          </>
        ) : errorMessage ? (
          <>
            <h1 className="mb-6 font-serif text-3xl font-medium text-danger">Erreur de confirmation</h1>
            <p className="mb-8 text-ink-soft">{errorMessage}</p>
          </>
        ) : (
          <>
            <h1 className="mb-6 font-serif text-3xl font-medium text-ink">Inscription presque terminée</h1>
            <p className="mb-8 text-ink-soft">
              Nous traitons votre demande de confirmation. Veuillez patienter…
            </p>
          </>
        )}

        <Link href="/auth/login" className="text-accent underline transition-colors hover:text-accent-hover">
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
