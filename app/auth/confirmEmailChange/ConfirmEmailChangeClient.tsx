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

function ConfirmEmailChangeContent() {
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;

  useEffect(() => {
    const confirmEmailChange = async () => {
      if (!token) {
        setErrorMessage("Token non trouvé. Veuillez vérifier votre lien de confirmation.");
        return;
      }
      try {
        await axios.get(`${backendUrl}/users/confirm-email-change?token=${token}`);
        setConfirmationMessage('Votre nouvelle adresse email a été confirmée avec succès.');
      } catch (error) {
        setErrorMessage("La confirmation a échoué. Le lien est peut-être expiré ou invalide.");
      }
    };

    confirmEmailChange();
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center font-sans text-ink">
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
          <h1 className="mb-6 font-serif text-3xl font-medium text-ink">Confirmation en cours…</h1>
          <p className="mb-8 text-ink-soft">Veuillez patienter.</p>
        </>
      )}

      <Link href="/admin/me" className="text-accent underline transition-colors hover:text-accent-hover">
        Retour à mon profil
      </Link>
    </div>
  );
}

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <ConfirmEmailChangeContent />
    </Suspense>
  );
}
