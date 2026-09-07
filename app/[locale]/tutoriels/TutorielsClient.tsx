'use client';

import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { TutorialModel } from '@/lib/models/TutorialModels';
import { fetchPublishedTutorials } from '@/lib/queries/TutorialQueries';
import { fetchCurrentUser, getAccessToken } from '@/lib/queries/AuthQueries';
import HeroSection from '@/components/HeroSection';
import SubscriptionLock from '@/components/SubscriptionLock';
import { fetchRandomBackground } from '@/lib/queries/RandomBackgroundQuery';

const getYouTubeEmbedUrl = (url: string): string => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const TutorielsPage: React.FC = () => {
  const t = useTranslations('tutorials');
  const locale = useLocale();
  const [tutorials, setTutorials] = useState<TutorialModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [data, bg] = await Promise.all([
          fetchPublishedTutorials(locale),
          fetchRandomBackground(),
        ]);
        setTutorials(data);
        setBackgroundImage(bg);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [locale]);

  useEffect(() => {
    if (!getAccessToken()) return;
    // Un simple USER (non abonné) n'a accès qu'à l'aperçu — EDITOR/ADMIN et abonnés voient la vidéo.
    fetchCurrentUser()
      .then((user: any) => setHasFullAccess(user?.role === 'ADMIN' || user?.role === 'EDITOR' || !!user?.isSubscribed))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page font-sans text-ink">
      <HeroSection
        backgroundImage={backgroundImage || '/images/backgrounds/bouddhisme.jpg'}
        title={t('heroTitle')}
        strongTitle={t('heroStrongTitle')}
        content={t('heroContent')}
        button1Text={t('heroButton1')}
        button1Url="#tutoriels-section"
        button2Text={t('heroButton2')}
        button2Url={locale === 'en' ? '/en/subscription' : '/subscription'}
      />

      <div id="tutoriels-section" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <p className="mb-3 text-center text-xs font-sans uppercase tracking-[0.22em] text-accent">
          {t('eyebrow')}
        </p>
        <h2 className="mb-12 text-center font-serif text-3xl font-medium text-ink md:text-4xl">
          {t('sectionTitle')}
        </h2>

        {tutorials.length === 0 ? (
          <p className="text-center font-sans text-lg text-ink-muted">
            {t('empty')}
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-raised shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative w-full bg-sunken" style={{ paddingBottom: '56.25%' }}>
                  {hasFullAccess && tutorial.videoUrl ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={getYouTubeEmbedUrl(tutorial.videoUrl)}
                      title={tutorial.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <SubscriptionLock message={t('lockedVideo')} className="rounded-none" />
                  )}
                </div>
                <div className="flex flex-grow flex-col p-5">
                  <h3 className="mb-2 font-serif text-lg font-medium text-ink">{tutorial.title}</h3>
                  {tutorial.description && (
                    <p className="flex-grow text-sm leading-relaxed text-ink-soft">{tutorial.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorielsPage;
