"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Suspense } from 'react';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const backendUrl = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL_PROD
  : process.env.NEXT_PUBLIC_API_URL_LOCAL;

// Composant pour gérer la confirmation avec Suspense
function ConfirmationContent() {
  const t = useTranslations('auth.confirmEmail');
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
          setConfirmationMessage(t('successBody'));
          console.log('Confirmation réussie', response.data);
        } catch (error) {
          setErrorMessage(t('errorBody'));
          console.error('Erreur lors de la confirmation', error);
        }
      } else {
        setErrorMessage(t('missingToken'));
      }
    };

    confirmEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-page px-6 text-center font-sans text-ink">
      <div className="relative z-10 max-w-md">
        {confirmationMessage ? (
          <>
            <h1 className="mb-6 font-serif text-3xl font-medium text-ink">{t('successTitle')}</h1>
            <p className="mb-8 text-ink-soft">{confirmationMessage}</p>
          </>
        ) : errorMessage ? (
          <>
            <h1 className="mb-6 font-serif text-3xl font-medium text-danger">{t('errorTitle')}</h1>
            <p className="mb-8 text-ink-soft">{errorMessage}</p>
          </>
        ) : (
          <>
            <h1 className="mb-6 font-serif text-3xl font-medium text-ink">{t('pendingTitle')}</h1>
            <p className="mb-8 text-ink-soft">
              {t('pendingBody')}
            </p>
          </>
        )}

        <Link href="/auth/login" className="text-accent underline transition-colors hover:text-accent-hover">
          {t('backToLogin')}
        </Link>
      </div>
    </div>
  );
}

// Composant parent avec Suspense pour gérer le rendu côté client
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-page" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
