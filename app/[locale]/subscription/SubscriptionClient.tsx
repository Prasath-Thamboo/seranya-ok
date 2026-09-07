"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pricing } from '@/components/Pricing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery";

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

export default function SubscriptionPage() {
  const t = useTranslations('subscription');
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  const stats = [
    { value: '5€', label: t('statMonthly') },
    { value: '∞', label: t('statUnlimited') },
    { value: '0', label: t('statCommitment') },
  ];

  useEffect(() => {
    fetchRandomBackground().then(setBackgroundImage).catch(() => {});
  }, []);

  return (
    <main className="bg-page font-sans text-ink">
      {/* ── HERO ── */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-page">
        {backgroundImage && (
          <Image src={backgroundImage} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover' }} className="scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-page" />

        <motion.div
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-block rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-sans uppercase tracking-[0.2em] text-white backdrop-blur-sm"
          >
            {t('badge')}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mb-6 font-serif text-5xl font-medium leading-tight text-white text-shadow-sm md:text-6xl lg:text-7xl"
          >
            {t('title')} <span className="italic text-white/95">{t('titleItalic')}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-xl text-lg leading-relaxed text-white/90 text-shadow-sm md:text-xl"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-4xl font-medium text-white">{s.value}</p>
                <p className="mt-1 text-xs font-sans uppercase tracking-[0.18em] text-white/80">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10">
            <a
              href="#plans"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-8 py-3 text-sm font-sans text-white transition-all duration-200 hover:bg-white/10"
            >
              {t('viewPlans')}
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
