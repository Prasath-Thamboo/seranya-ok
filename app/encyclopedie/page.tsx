'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { DefinitionModel } from '@/lib/models/DefinitionModels';
import { fetchPublishedDefinitions } from '@/lib/queries/DefinitionQueries';
import { fetchRandomBackground } from '@/lib/queries/RandomBackgroundQuery';
import HeroSection from '@/components/HeroSection';
import { SearchOutlined } from '@ant-design/icons';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const CATEGORIES = ['Tous', 'Yoga', 'Bouddhisme', 'Méditation', 'Philosophie'];

const EncyclopediePage: React.FC = () => {
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
          fetchPublishedDefinitions(),
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
  }, []);

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
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage || '/images/backgrounds/bouddhisme.jpg'})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative z-10">
        <HeroSection
          backgroundImage={backgroundImage || '/images/backgrounds/bouddhisme.jpg'}
          title="Encyclopédie"
          titleColor="#ffffff"
          strongTitle="Yoga & Bouddhisme"
          strongTitleColor="#4ade80"
          content="Retrouvez les définitions essentielles du yoga et de la philosophie bouddhiste."
          contentColor="#e5e7eb"
          button1Text="Explorer"
          button1Url="#encyclopedie-section"
          button1BgColor="#38b2ac"
          button2Text="S'abonner"
          button2Url="/subscription"
          button2BgColor="#555"
        />

        <div id="encyclopedie-section" className="py-16 px-6 max-w-6xl mx-auto">

          {/* Barre de recherche */}
          <div className="relative max-w-xl mx-auto mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un terme..."
              className="w-full h-12 pl-10 pr-4 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 font-kanit"
            />
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg" />
          </div>

          {/* Filtre par catégorie */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-iceberg uppercase transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filtre alphabétique */}
          <div className="flex flex-wrap justify-center gap-1 mb-10">
            <button
              onClick={() => setActiveLetter(null)}
              className={`w-8 h-8 rounded text-xs font-iceberg font-bold transition-all ${
                !activeLetter ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Tous
            </button>
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setActiveLetter(activeLetter === letter ? null : letter)}
                disabled={!availableLetters.has(letter)}
                className={`w-8 h-8 rounded text-xs font-iceberg font-bold transition-all ${
                  activeLetter === letter
                    ? 'bg-green-500 text-white'
                    : availableLetters.has(letter)
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Résultats */}
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 font-kanit text-lg">Aucune définition trouvée.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((def) => (
                <div
                  key={def.id}
                  className="bg-black/60 border border-gray-700 rounded-xl p-6 hover:border-green-500 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white font-iceberg uppercase">
                      {def.term}
                    </h3>
                    {def.category && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 font-kanit whitespace-nowrap">
                        {def.category}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 font-kanit text-sm leading-relaxed">
                    {def.definition}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncyclopediePage;
