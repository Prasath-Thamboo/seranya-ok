"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaLungs,
  FaBrain,
  FaHeartbeat,
  FaSun,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import { getAccessToken } from "@/lib/queries/AuthQueries";

const fetchRandomImage = async () => {
  const res = await fetch("/api/getRandomImage");
  const data = await res.json();
  return data.imagePath;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const benefits = [
  {
    icon: <FaHeartbeat className="w-7 h-7 text-green-400" />,
    title: "Le corps",
    description:
      "Une pratique régulière assouplit les muscles et les articulations, renforce le dos et la posture, et améliore l'équilibre au fil des séances.",
    points: ["Souplesse et mobilité", "Renforcement musculaire", "Meilleure posture"],
  },
  {
    icon: <FaBrain className="w-7 h-7 text-green-400" />,
    title: "L'esprit",
    description:
      "Le yoga apaise le mental : il aide à relâcher les tensions accumulées, à réduire le stress et l'anxiété, et à retrouver une véritable clarté d'esprit.",
    points: ["Réduction du stress", "Meilleure concentration", "Sommeil plus réparateur"],
  },
  {
    icon: <FaLungs className="w-7 h-7 text-green-400" />,
    title: "Le souffle",
    description:
      "Le travail de la respiration (pranayama) est au cœur du yoga : il apprend à ralentir, à mieux oxygéner le corps et à calmer le système nerveux.",
    points: ["Respiration consciente", "Système nerveux apaisé", "Ancrage dans l'instant présent"],
  },
  {
    icon: <FaSun className="w-7 h-7 text-green-400" />,
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
    <div className="relative w-full min-h-screen text-white font-kanit">
      {/* Background fixe */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundColor: backgroundImage ? undefined : "#0a0a0a",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-black/75 z-10" />
      </div>

      <div className="relative z-10">

        {/* Hero */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center pt-24 pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block px-4 py-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-iceberg uppercase tracking-widest rounded-full mb-6">
              Le pouvoir du yoga
            </span>
            <h1 className="text-6xl lg:text-7xl font-iceberg uppercase tracking-widest mb-6 text-white">
              Éveil
            </h1>
            <div className="w-20 h-px bg-green-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Pourquoi le yoga transforme durablement le corps et l&apos;esprit —
              et comment il peut changer votre quotidien, dès la première respiration.
            </p>
          </motion.div>
        </section>

        {/* Introduction */}
        <motion.section
          className="py-16 px-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-iceberg uppercase tracking-wide mb-6 text-green-400">
              Pourquoi pratiquer le yoga ?
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              <p>
                Le yoga n&apos;est pas qu&apos;une simple discipline physique : c&apos;est
                un art de vivre millénaire qui unit le corps, le souffle et l&apos;esprit.
                Chaque posture, chaque respiration est une invitation à ralentir et à
                se reconnecter à soi-même.
              </p>
              <p>
                Accessible à tous, quel que soit l&apos;âge ou le niveau, le yoga s&apos;adapte
                à chacun. Il ne s&apos;agit pas de performance, mais d&apos;une pratique
                progressive dont les effets se ressentent dès les premières séances —
                et s&apos;approfondissent avec le temps.
              </p>
              <p>
                Que vous cherchiez à soulager des tensions physiques, à apaiser un mental
                agité ou simplement à vous offrir un moment rien qu&apos;à vous, le yoga
                a quelque chose à vous apporter.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Grille des bienfaits */}
        <motion.section
          className="py-16 px-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-iceberg uppercase tracking-wide text-center mb-4 text-white"
          >
            Les bienfaits du yoga
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-gray-400 text-center mb-12 max-w-xl mx-auto"
          >
            Une pratique complète, aux effets ressentis à tous les niveaux.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-400/40 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  {benefit.icon}
                  <h3 className="text-lg font-iceberg uppercase tracking-wide text-white">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm mb-4">
                  {benefit.description}
                </p>
                <div className="space-y-2">
                  {benefit.points.map((point) => (
                    <div key={point} className="flex items-center gap-2.5 text-sm text-gray-300">
                      <FaCheck className="text-green-400 flex-shrink-0 w-3.5 h-3.5" />
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
          className="py-16 px-6 max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <p className="text-2xl md:text-3xl font-iceberg text-gray-200 italic leading-relaxed">
            &laquo; Le yoga ne consiste pas à toucher ses orteils,<br className="hidden md:block" />
            il consiste à ce que l&apos;on apprend en chemin. &raquo;
          </p>
        </motion.section>

        {/* Call to action */}
        <motion.section
          className="py-20 px-6 text-center"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-iceberg uppercase tracking-wide mb-4 text-white">
              Prêt à commencer ?
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Découvrez nos tutoriels vidéo pour débuter votre pratique
              du yoga, quel que soit votre niveau.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tutoriels"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-iceberg uppercase tracking-widest text-sm rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
              >
                Voir les tutoriels <FaArrowRight className="w-4 h-4" />
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/auth/register"
                  className="px-8 py-3 border border-white/30 hover:border-green-400 text-white font-iceberg uppercase tracking-widest text-sm rounded-md transition-all duration-200 hover:text-green-400"
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
