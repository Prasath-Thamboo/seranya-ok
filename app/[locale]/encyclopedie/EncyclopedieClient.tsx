'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { DefinitionModel } from '@/lib/models/DefinitionModels';
import { fetchPublishedDefinitions } from '@/lib/queries/DefinitionQueries';
import { fetchRandomBackground } from '@/lib/queries/RandomBackgroundQuery';
import HeroSection from '@/components/HeroSection';
import { LuSearch } from 'react-icons/lu';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Les clés restent en français car elles correspondent aux valeurs stockées
// en base (`definition.category`) ; seul le libellé affiché est traduit.
const CATEGORY_KEYS = ['Tous', 'Yoga', 'Bouddhisme', 'Méditation', 'Philosophie'];

const EncyclopediePage: React.FC = () => {
  const t = useTranslations('encyclopedie');
  const locale = useLocale();
  const [definitions, setDefinitions] = useState<DefinitionModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tous');

  useEffect(() => {
    const load = async () => {
      try {
        const [data, bg] = await Promise.all([
          fetchPublishedDefinitions(locale),
          fetchRandomBackground(),
        ]);
        setDefinitions(data);
        setBackgroundImage(bg);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [locale]);

  const filtered = useMemo(() => {
    return definitions.filter((d) => {
      const matchSearch = d.term.toLowerCase().includes(search.toLowerCase()) ||
        d.definition.toLowerCase().includes(search.toLowerCase());
      const matchLetter = !activeLetter || d.term.toUpperCase().startsWith(activeLetter);
      const matchCategory = activeCategory === 'Tous' || d.category === activeCategory;
      return matchSearch && matchLetter && matchCategory;
    });
  }, [definitions, search, activeLetter, activeCategory]);

  const availableLetters = useMemo(
    () => new Set(definitions.map((d) => d.term[0]?.toUpperCase())),
    [definitions]
  );

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
        button1Url="#encyclopedie-section"
        button2Text={t('heroButton2')}
        button2Url={locale === 'en' ? '/en/subscription' : '/subscription'}
      />

      <div id="encyclopedie-section" className="relative z-10 mx-auto max-w-6xl px-6 py-20">

        {/* Barre de recherche */}
        <div className="relative mx-auto mb-8 max-w-xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchAria')}
            className="h-12 w-full rounded-full border border-line bg-raised pl-11 pr-4 text-ink placeholder-ink-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
          />
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-ink-muted" />
        </div>

        {/* Filtre par catégorie */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {CATEGORY_KEYS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-sans transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-accent text-ink-invert shadow-sm'
                  : 'border border-line bg-raised text-ink-soft hover:border-accent hover:text-accent'
              }`}
            >
              {cat === 'Tous' ? t('all') : t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Filtre alphabétique */}
        <div className="mb-10 flex flex-wrap justify-center gap-1">
          <button
            onClick={() => setActiveLetter(null)}
            className={`h-8 rounded-md px-2 text-xs font-sans font-medium transition-all ${
              !activeLetter ? 'bg-accent text-ink-invert' : 'bg-raised text-ink-soft hover:bg-sunken'
            }`}
          >
            {t('all')}
          </button>
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
              disabled={!availableLetters.has(letter)}
              className={`h-8 w-8 rounded-md text-xs font-sans font-medium transition-all ${
                activeLetter === letter
                  ? 'bg-accent text-ink-invert'
                  : availableLetters.has(letter)
                  ? 'bg-raised text-ink-soft hover:bg-sunken'
                  : 'cursor-not-allowed bg-page text-ink-muted/40'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Résultats */}
        {filtered.length === 0 ? (
          <p className="text-center font-sans text-lg text-ink-muted">{t('empty')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((def) => (
              <div
                key={def.id}
                className="rounded-2xl border border-line bg-raised p-6 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-serif text-lg font-medium text-ink">{def.term}</h3>
                  {def.category && (
                    <span className="ml-2 whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-sans text-accent">
                      {def.category}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">{def.definition}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncyclopediePage;
