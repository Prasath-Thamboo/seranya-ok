"use client";

import React, { useEffect, useState } from 'react';
import { Pricing } from '@/components/Pricing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery";

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const STATS = [
  { value: '5€', label: 'par mois' },
  { value: '∞', label: 'contenu illimité' },
  { value: '0', label: 'engagement' },
];

export default function SubscriptionPage() {
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    fetchRandomBackground()
      .then(setBackgroundImage)
      .catch(() => {});
  }, []);

  return (
    <main className="bg-black text-white font-kanit">

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Fond abonnement"
            fill
            style={{ objectFit: 'cover' }}
            className="scale-105"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-4 py-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-iceberg uppercase tracking-widest rounded-full mb-6"
          >
            Rejoignez la communauté
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-iceberg uppercase tracking-wide text-white mb-6 leading-tight"
          >
            Votre voie,{' '}
            <span className="text-green-400">votre rythme</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
          >
            Accédez à l&apos;intégralité du contenu Seranya, devenez éditeur actif et rejoignez une communauté passionnée.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-10 mt-12"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-iceberg text-green-400 font-bold">{s.value}</p>
                <p className="text-xs text-gray-400 font-iceberg uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 px-8 py-3 border border-green-500/50 text-green-400 font-iceberg uppercase tracking-widest text-sm rounded-full hover:bg-green-500/10 transition-all duration-200"
            >
              Voir les plans ↓
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── PLANS + BÉNÉFICES ── */}
      <section id="plans">
        <Pricing />
      </section>

    </main>
  );
}
