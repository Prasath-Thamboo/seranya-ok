"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { LuWind, LuBrain, LuActivity, LuSun, LuCheck, LuArrowRight } from "react-icons/lu";
import { getAccessToken } from "@/lib/queries/AuthQueries";

const fetchRandomImage = async () => {
  const res = await fetch("/api/getRandomImage");
  const data = await res.json();
  return data.imagePath;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

// Icônes dans le même ordre que `eveil.benefits` dans les fichiers de messages.
const BENEFIT_ICONS = [
  <LuActivity key="body" className="h-7 w-7 text-accent" />,
  <LuBrain key="mind" className="h-7 w-7 text-accent" />,
  <LuWind key="breath" className="h-7 w-7 text-accent" />,
  <LuSun key="daily" className="h-7 w-7 text-accent" />,
];

type Benefit = { title: string; description: string; points: string[] };

export default function EveilClient() {
  const t = useTranslations("eveil");
  const benefits = t.raw("benefits") as Benefit[];
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, []);

  useEffect(() => {
    fetchRandomImage()
      .then((img) => setBackgroundImage(img))
      .catch(() => setBackgroundImage("/images/backgrounds/placeholder.jpg"));
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-page font-sans text-ink">
      {/* Bandeau d'image en tête, fondu vers la page */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[60vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined, backgroundColor: "#efe7da" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-page" />
      </div>

      <div className="relative z-10">
        {/* Hero */}
        <section className="flex min-h-[56vh] flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="mb-6 inline-block rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-sans uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              {t("eyebrow")}
            </span>
            <h1 className="mb-6 font-serif text-6xl font-medium text-white text-shadow-sm lg:text-7xl">{t("heroTitle")}</h1>
            <div className="mx-auto mb-8 h-px w-20 bg-white/50" />
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90 text-shadow-sm">
              {t("heroContent")}
            </p>
          </motion.div>
        </section>

        {/* Introduction */}
        <motion.section
          className="mx-auto max-w-4xl px-6 py-16"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className="rounded-3xl border border-line bg-raised p-8 shadow-sm md:p-12">
            <h2 className="mb-6 font-serif text-3xl font-medium text-accent">{t("introTitle")}</h2>
            <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>{t("introP1")}</p>
              <p>{t("introP2")}</p>
              <p>{t("introP3")}</p>
            </div>
          </div>
        </motion.section>

        {/* Grille des bienfaits */}
        <motion.section
          className="mx-auto max-w-5xl px-6 py-16"
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeInUp} className="mb-4 text-center font-serif text-3xl font-medium text-ink">
            {t("benefitsTitle")}
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-xl text-center text-ink-soft">
            {t("benefitsSubtitle")}
          </motion.p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="rounded-2xl border border-line bg-raised p-6 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  {BENEFIT_ICONS[i]}
                  <h3 className="font-serif text-lg font-medium text-ink">{benefit.title}</h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-ink-soft">{benefit.description}</p>
                <div className="space-y-2">
                  {benefit.points.map((point) => (
                    <div key={point} className="flex items-center gap-2.5 text-sm text-ink-soft">
                      <LuCheck className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Citation */}
        <motion.section
          className="mx-auto max-w-3xl px-6 py-16 text-center"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <p className="font-serif text-2xl italic leading-relaxed text-ink-soft md:text-3xl">
            {t("quote")}
          </p>
        </motion.section>

        {/* Call to action */}
        <motion.section
          className="px-6 py-20 text-center"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className="mx-auto max-w-xl">
            <h2 className="mb-4 font-serif text-3xl font-medium text-ink">{t("ctaTitle")}</h2>
            <p className="mb-8 leading-relaxed text-ink-soft">{t("ctaText")}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/tutoriels"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
              >
                {t("ctaButton1")} <LuArrowRight className="h-4 w-4" />
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/auth/register"
                  className="rounded-full border border-line-strong px-8 py-3 text-sm font-sans text-ink transition-all duration-200 hover:border-accent hover:text-accent"
                >
                  {t("ctaButton2")}
                </Link>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
