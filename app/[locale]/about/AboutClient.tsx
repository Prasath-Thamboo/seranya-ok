"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuLeaf, LuHeart, LuBookOpen, LuUsers } from "react-icons/lu";
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

const values = [
  {
    icon: <LuLeaf className="h-7 w-7 text-accent" />,
    title: "Sérénité",
    description:
      "Chaque pratique est une invitation à ralentir, à respirer et à renouer avec le moment présent.",
  },
  {
    icon: <LuHeart className="h-7 w-7 text-accent" />,
    title: "Bienveillance",
    description:
      "Une communauté fondée sur la compassion, le respect et l'accueil de chacun, quel que soit son niveau.",
  },
  {
    icon: <LuBookOpen className="h-7 w-7 text-accent" />,
    title: "Connaissance",
    description:
      "Articles, guides et tutoriels issus des traditions du yoga et de la méditation bouddhiste.",
  },
  {
    icon: <LuUsers className="h-7 w-7 text-accent" />,
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
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya"
              width={168}
              height={56}
              className="mx-auto mb-8 drop-shadow"
            />
            <h1 className="mb-6 font-serif text-5xl font-medium text-ink lg:text-6xl">
              À propos
            </h1>
            <div className="mx-auto mb-8 h-px w-20 bg-ink/30" />
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-ink">
              Seranya est un espace de paix numérique dédié au yoga, à la méditation et à la
              philosophie bouddhiste — pour ceux qui cherchent à cultiver leur équilibre intérieur.
            </p>
          </motion.div>
        </section>

        {/* Notre histoire */}
        <motion.section
          className="mx-auto max-w-4xl px-6 py-20"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
        >
          <div className="rounded-3xl border border-line bg-raised p-8 shadow-sm md:p-12">
            <h2 className="mb-6 font-serif text-3xl font-medium text-accent">Notre histoire</h2>
            <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Seranya est née d&apos;une passion pour les pratiques contemplatives et d&apos;un désir
                de les rendre accessibles à tous. Ce projet réunit des ressources soigneusement
                sélectionnées autour du yoga et de la méditation, dans un esprit de partage authentique.
              </p>
              <p>
                Que vous soyez débutant ou pratiquant confirmé, vous trouverez ici des articles, des
                guides et des tutoriels pour nourrir votre pratique au quotidien — à votre rythme, en
                toute simplicité.
              </p>
              <p>
                Le nom <strong className="text-ink">Seranya</strong> évoque la sérénité et
                l&apos;éveil : un rappel constant que le voyage intérieur commence par un seul souffle conscient.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Nos valeurs */}
        <motion.section
          className="mx-auto max-w-5xl px-6 py-16"
          initial="hidden"
          whileInView="visible"
          variants={stagger}
          viewport={{ once: true }}
        >
          <motion.h2 variants={fadeInUp} className="mb-12 text-center font-serif text-3xl font-medium text-ink">
            Nos valeurs
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="rounded-2xl border border-line bg-raised p-6 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  {value.icon}
                  <h3 className="font-serif text-lg font-medium text-ink">{value.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">{value.description}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="mb-4 font-serif text-3xl font-medium text-ink">Rejoignez-nous</h2>
            <p className="mb-8 leading-relaxed text-ink-soft">
              Explorez nos articles, partagez vos expériences et avancez sur votre chemin avec nous.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {!isLoggedIn && (
                <Link
                  href="/auth/register"
                  className="rounded-full bg-accent px-8 py-3 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
                >
                  Créer un compte
                </Link>
              )}
              <Link
                href="/contact"
                className="rounded-full border border-line-strong px-8 py-3 text-sm font-sans text-ink transition-all duration-200 hover:border-accent hover:text-accent"
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
