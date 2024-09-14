"use client";

import React, { useEffect, useState } from 'react';
import { Pricing } from '@/components/Pricing';

const SubscriptionPage: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  useEffect(() => {
    // Charger une image de fond aléatoire
    const loadRandomBackgroundImage = async () => {
      try {
        const response = await fetch('/api/getRandomImage');
        const data = await response.json();
        setBackgroundImage(data.imagePath);
      } catch (error) {
        console.error("Failed to load random background image:", error);
      }
    };

    loadRandomBackgroundImage();
  }, []);

  return (
    <section
      className="bg-white dark:bg-gray-900 flex justify-center items-center min-h-screen relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="py-8 lg:py-16 px-4 mx-auto w-full relative z-10">
        <Pricing />
      </div>
    </section>
  );
};

export default SubscriptionPage;
