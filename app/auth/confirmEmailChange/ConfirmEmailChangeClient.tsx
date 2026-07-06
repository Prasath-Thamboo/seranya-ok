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
    <div className="min-h-screen flex flex-col items-center justify-center font-kanit text-center bg-black text-white px-6">
      {confirmationMessage ? (
        <>
          <h1 className="text-4xl font-bold mb-8">Confirmation réussie !</h1>
          <p className="text-lg mb-6 text-gray-300">{confirmationMessage}</p>
        </>
      ) : errorMessage ? (
        <>
          <h1 className="text-4xl font-bold mb-8 text-red-500">Erreur de confirmation</h1>
          <p className="text-lg mb-6 text-red-400">{errorMessage}</p>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8">Confirmation en cours…</h1>
          <p className="text-lg mb-6 text-gray-300">Veuillez patienter.</p>
        </>
      )}

      <Link href="/admin/me" className="text-green-400 hover:underline">
        Retour à mon profil
      </Link>
    </div>
  );
}

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ConfirmEmailChangeContent />
    </Suspense>
  );
}
