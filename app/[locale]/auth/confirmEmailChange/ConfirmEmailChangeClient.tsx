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

function ConfirmEmailChangeContent() {
  const t = useTranslations('auth.confirmEmailChange');
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams ? searchParams.get('token') : null;

  useEffect(() => {
    const confirmEmailChange = async () => {
      if (!token) {
        setErrorMessage(t('missingToken'));
        return;
      }
      try {
        await axios.get(`${backendUrl}/users/confirm-email-change?token=${token}`);
        setConfirmationMessage(t('successBody'));
      } catch (error) {
        setErrorMessage(t('errorBody'));
      }
    };

    confirmEmailChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center font-sans text-ink">
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
          <p className="mb-8 text-ink-soft">{t('pendingBody')}</p>
        </>
      )}

      <Link href="/admin/me" className="text-accent underline transition-colors hover:text-accent-hover">
        {t('backToProfile')}
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
