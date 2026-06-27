'use client';

import React, { useEffect, useState } from 'react';
import { TutorialModel } from '@/lib/models/TutorialModels';
import { fetchPublishedTutorials } from '@/lib/queries/TutorialQueries';
import HeroSection from '@/components/HeroSection';
import { fetchRandomBackground } from '@/lib/queries/RandomBackgroundQuery';

const getYouTubeEmbedUrl = (url: string): string => {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const TutorielsPage: React.FC = () => {
  const [tutorials, setTutorials] = useState<TutorialModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [data, bg] = await Promise.all([
          fetchPublishedTutorials(),
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
  }, []);

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
          title="Tutoriels"
          titleColor="#ffffff"
          strongTitle="Yoga & Bouddhisme"
          strongTitleColor="#4ade80"
          content="Découvrez nos vidéos pour pratiquer le yoga et la méditation bouddhiste."
          contentColor="#e5e7eb"
          button1Text="Voir les tutoriels"
          button1Url="#tutoriels-section"
          button1BgColor="#38b2ac"
          button2Text="S'abonner"
          button2Url="/subscription"
          button2BgColor="#555"
        />

        <div id="tutoriels-section" className="py-16 px-6 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12 font-iceberg uppercase">
            Nos Tutoriels
          </h2>

          {tutorials.length === 0 ? (
            <p className="text-center text-gray-300 font-kanit text-xl">
              Aucun tutoriel disponible pour le moment.
            </p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-black/60 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col"
                >
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={getYouTubeEmbedUrl(tutorial.videoUrl)}
                      title={tutorial.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white font-iceberg uppercase mb-2">
                      {tutorial.title}
                    </h3>
                    {tutorial.description && (
                      <p className="text-gray-300 font-kanit text-sm flex-grow">
                        {tutorial.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorielsPage;
