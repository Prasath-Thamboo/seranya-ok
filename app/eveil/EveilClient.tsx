"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

const benefits = [
  {
    icon: <LuActivity className="h-7 w-7 text-accent" />,
    title: "Le corps",
    description:
      "Une pratique régulière assouplit les muscles et les articulations, renforce le dos et la posture, et améliore l'équilibre au fil des séances.",
    points: ["Souplesse et mobilité", "Renforcement musculaire", "Meilleure posture"],
  },
  {
    icon: <LuBrain className="h-7 w-7 text-accent" />,
    title: "L'esprit",
    description:
      "Le yoga apaise le mental : il aide à relâcher les tensions accumulées, à réduire le stress et l'anxiété, et à retrouver une véritable clarté d'esprit.",
    points: ["Réduction du stress", "Meilleure concentration", "Sommeil plus réparateur"],
  },
  {
    icon: <LuWind className="h-7 w-7 text-accent" />,
    title: "Le souffle",
    description:
      "Le travail de la respiration (pranayama) est au cœur du yoga : il apprend à ralentir, à mieux oxygéner le corps et à calmer le système nerveux.",
    points: ["Respiration consciente", "Système nerveux apaisé", "Ancrage dans l'instant présent"],
  },
  {
    icon: <LuSun className="h-7 w-7 text-accent" />,
    title: "Le quotidien",
    description:
      "Sur le tapis comme en dehors, le yoga cultive une meilleure écoute de soi : plus d'énergie, plus de calme face aux imprévus, plus de présence aux autres.",
    points: ["Plus d'énergie au quotidien", "Meilleure gestion des émotions", "Une présence plus sereine"],
  },
];

export default function EveilClient() {
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
              Le pouvoir du yoga
            </span>
            <h1 className="mb-6 font-serif text-6xl font-medium text-white text-shadow-sm lg:text-7xl">Éveil</h1>
            <div className="mx-auto mb-8 h-px w-20 bg-white/50" />
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/90 text-shadow-sm">
              Pourquoi le yoga transforme durablement le corps et l&apos;esprit — et comment il peut
              changer votre quotidien, dès la première respiration.
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
            <h2 className="mb-6 font-serif text-3xl font-medium text-accent">Pourquoi pratiquer le yoga ?</h2>
            <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Le yoga n&apos;est pas qu&apos;une simple discipline physique : c&apos;est un art de
                vivre millénaire qui unit le corps, le souffle et l&apos;esprit. Chaque posture, chaque
                respiration est une invitation à ralentir et à se reconnecter à soi-même.
              </p>
              <p>
                Accessible à tous, quel que soit l&apos;âge ou le niveau, le yoga s&apos;adapte à
                chacun. Il ne s&apos;agit pas de performance, mais d&apos;une pratique progressive dont
                les effets se ressentent dès les premières séances — et s&apos;approfondissent avec le temps.
              </p>
              <p>
                Que vous cherchiez à soulager des tensions physiques, à apaiser un mental agité ou
                simplement à vous offrir un moment rien qu&apos;à vous, le yoga a quelque chose à vous apporter.
              </p>
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
            Les bienfaits du yoga
          </motion.h2>
          <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-xl text-center text-ink-soft">
            Une pratique complète, aux effets ressentis à tous les niveaux.
          </motion.p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="rounded-2xl border border-line bg-raised p-6 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  {benefit.icon}
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
            &laquo; Le yoga ne consiste pas à toucher ses orteils,
            <br className="hidden md:block" /> il consiste à ce que l&apos;on apprend en chemin. &raquo;
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
            <h2 className="mb-4 font-serif text-3xl font-medium text-ink">Prêt à commencer ?</h2>
            <p className="mb-8 leading-relaxed text-ink-soft">
              Découvrez nos tutoriels vidéo pour débuter votre pratique du yoga, quel que soit votre niveau.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/tutoriels"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
              >
                Voir les tutoriels <LuArrowRight className="h-4 w-4" />
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/auth/register"
                  className="rounded-full border border-line-strong px-8 py-3 text-sm font-sans text-ink transition-all duration-200 hover:border-accent hover:text-accent"
                >
                  Créer un compte
                </Link>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
