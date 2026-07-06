"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLeaf, FaHeart, FaBookOpen, FaUsers } from "react-icons/fa";
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

const values = [
  {
    icon: <FaLeaf className="w-7 h-7 text-green-400" />,
    title: "Sérénité",
    description:
      "Chaque pratique est une invitation à ralentir, à respirer et à renouer avec le moment présent.",
  },
  {
    icon: <FaHeart className="w-7 h-7 text-green-400" />,
    title: "Bienveillance",
    description:
      "Une communauté fondée sur la compassion, le respect et l'accueil de chacun, quel que soit son niveau.",
  },
  {
    icon: <FaBookOpen className="w-7 h-7 text-green-400" />,
    title: "Connaissance",
    description:
      "Articles, guides et tutoriels issus des traditions du yoga et de la méditation bouddhiste.",
  },
  {
    icon: <FaUsers className="w-7 h-7 text-green-400" />,
    title: "Communauté",
    description:
      "Un espace partagé pour progresser ensemble, s'inspirer mutuellement et grandir sur le chemin intérieur.",
  },
];

export default function AboutPage() {
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
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
            backgroundColor: backgroundImage ? undefined : "#0a0a0a",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-black/75 z-10" />
      </div>

      {/* Contenu */}
      <div className="relative z-10">

        {/* Hero */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center pt-24 pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya Logo"
              width={180}
              height={60}
              className="mx-auto mb-8 opacity-90"
            />
            <h1 className="text-5xl lg:text-6xl font-iceberg uppercase tracking-widest mb-6 text-white">
              À propos
            </h1>
            <div className="w-20 h-px bg-green-400 mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Seranya est un espace de paix numérique dédié au yoga, à la
              méditation et à la philosophie bouddhiste — pour ceux qui
              cherchent à cultiver leur équilibre intérieur.
            </p>
          </motion.div>
        </section>

        {/* Notre histoire */}
        <motion.section
          className="py-20 px-6 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-iceberg uppercase tracking-wide mb-6 text-green-400">
              Notre histoire
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-lg">
              <p>
                Seranya est née d&apos;une passion pour les pratiques contemplatives
                et d&apos;un désir de les rendre accessibles à tous. Ce projet
                réunit des ressources soigneusement sélectionnées autour du
                yoga et de la méditation, dans un esprit de partage authentique.
              </p>
              <p>
                Que vous soyez débutant ou pratiquant confirmé, vous trouverez
                ici des articles, des guides et des tutoriels pour nourrir votre
                pratique au quotidien — à votre rythme, en toute simplicité.
              </p>
              <p>
                Le nom <strong className="text-white">Seranya</strong> évoque la
                sérénité et l&apos;éveil : un rappel constant que le voyage intérieur
                commence par un seul souffle conscient.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Nos valeurs */}
        <motion.section
          className="py-16 px-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-iceberg uppercase tracking-wide text-center mb-12 text-white"
          >
            Nos valeurs
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-400/40 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  {value.icon}
                  <h3 className="text-lg font-iceberg uppercase tracking-wide text-white">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
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
              Rejoignez-nous
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Explorez nos articles, partagez vos expériences et avancez sur
              votre chemin avec nous.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isLoggedIn && (
                <Link
                  href="/auth/register"
                  className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-iceberg uppercase tracking-widest text-sm rounded-md transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
                >
                  Créer un compte
                </Link>
              )}
              <Link
                href="/contact"
                className="px-8 py-3 border border-white/30 hover:border-green-400 text-white font-iceberg uppercase tracking-widest text-sm rounded-md transition-all duration-200 hover:text-green-400"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
