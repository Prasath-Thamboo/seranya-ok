'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { HiOutlineBookOpen, HiOutlineUsers, HiOutlineSparkles } from "react-icons/hi2";
import Loader from "@/components/Loader";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { fetchClasses } from "@/lib/queries/ClassQueries";
import { fetchRandomBackground, fetchRandomBackgrounds } from "@/lib/queries/RandomBackgroundQuery";
import { getAccessToken, fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import { ClassModel } from "@/lib/models/ClassModels";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [sectionImages, setSectionImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [unitCount, setUnitCount] = useState(0);
  const [championCount, setChampionCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  const [statsRef, statsInView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    const load = async () => {
      try {
        const token = getAccessToken();
        setIsLoggedIn(!!token);

        const [fetchedUnits, fetchedClasses, bgImage, secImages, currentUser] = await Promise.allSettled([
          fetchUnits(),
          fetchClasses(),
          fetchRandomBackground(),
          fetchRandomBackgrounds(4),
          token ? fetchCurrentUser() : Promise.reject("no token"),
        ]);

        if (fetchedUnits.status === "fulfilled") {
          const u = fetchedUnits.value as UnitModel[];
          setUnits(u.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3));
          setUnitCount(u.filter(x => x.type === "UNIT").length);
          setChampionCount(u.filter(x => x.type === "CHAMPION").length);
        }
        if (fetchedClasses.status === "fulfilled") {
          const c = fetchedClasses.value as ClassModel[];
          setClasses(c);
          setClassCount(c.length);
        }
        if (bgImage.status === "fulfilled") setBackgroundImage(bgImage.value as string);
        else setBackgroundImage("/images/backgrounds/placeholder.jpg");
        if (secImages.status === "fulfilled") setSectionImages((secImages.value as string[]).slice(0, 4));
        if (currentUser.status === "fulfilled") setIsSubscribed(!!(currentUser.value as any)?.isSubscribed);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <main className="bg-black text-white font-kanit">

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Seranya"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-8">
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya"
              width={160}
              height={58}
              className="mx-auto drop-shadow-2xl"
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-iceberg uppercase text-5xl md:text-7xl font-bold tracking-widest mb-4 text-white drop-shadow-lg"
          >
            Seranya
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto">
            Un univers bouddhiste et yogique. Atteignez la paix intérieure et fusionnez avec votre être profond.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/univers"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-95"
            >
              Explorer <FaArrowRight className="w-4 h-4" />
            </Link>
            {!isLoggedIn && (
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:border-green-400 hover:text-green-400 transition-all duration-200 backdrop-blur-sm"
              >
                Rejoindre
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <motion.section
        ref={statsRef}
        className="relative z-10 py-20 px-6 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        {sectionImages[0] && (
          <Image src={sectionImages[0]} alt="" fill style={{ objectFit: "cover" }} className="opacity-15" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.p variants={fadeUp} className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
            L&apos;univers en chiffres
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-16">
            Ce que nous avons construit
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <HiOutlineSparkles className="w-7 h-7" />, label: "Entités", value: unitCount },
              { icon: <HiOutlineUsers className="w-7 h-7" />, label: "Champions", value: championCount },
              { icon: <HiOutlineBookOpen className="w-7 h-7" />, label: "Familles", value: classCount },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-gray-800 bg-gray-950 hover:border-green-400/40 transition-colors"
              >
                <div className="text-green-400">{stat.icon}</div>
                <span className="text-5xl font-bold font-iceberg text-white">
                  {statsInView ? <CountUp end={stat.value} duration={2} /> : 0}
                </span>
                <span className="text-gray-400 font-kanit uppercase text-xs tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── RECENT UNITS ── */}
      {units.length > 0 && (
        <motion.section
          className="relative py-20 px-6 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {sectionImages[1] && (
            <Image src={sectionImages[1]} alt="" fill style={{ objectFit: "cover" }} className="opacity-10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.p variants={fadeUp} className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
              Découverte
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-4">
              Dernières entités
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
              Plongez dans notre encyclopédie et découvrez les entités de l&apos;univers Seranya.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {units.map((unit, i) => (
                <motion.div key={unit.id} variants={fadeUp}>
                  <Link href={`/univers/units/${unit.id}`} className="group block relative rounded-2xl overflow-hidden aspect-[3/4] border border-gray-800 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${unit.headerImage || "/images/backgrounds/placeholder.jpg"})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {i === 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-iceberg uppercase tracking-widest rounded-full">
                        Nouveau
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                      {unit.profileImage && (
                        <Image
                          src={unit.profileImage}
                          alt={unit.title}
                          width={64}
                          height={64}
                          className="rounded-full ring-2 ring-green-400/50 mb-3 object-cover"
                        />
                      )}
                      <h3 className="font-iceberg uppercase text-white font-bold text-lg">{unit.title}</h3>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{unit.subtitle}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="text-center mt-12">
              <Link
                href="/univers"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-700 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:border-green-400 hover:text-green-400 transition-all duration-200"
              >
                Voir tout l&apos;univers <FaArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* ── FEATURES ── */}
      <motion.section
        className="relative py-20 px-6 overflow-hidden border-t border-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        {sectionImages[2] && (
          <Image src={sectionImages[2]} alt="" fill style={{ objectFit: "cover" }} className="opacity-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/65 to-black pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.p variants={fadeUp} className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
            Pourquoi Seranya
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-16">
            Notre engagement
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sérénité",
                desc: "Un espace pensé pour la paix intérieure et le ressourcement, loin du bruit du monde.",
                icon: "✦",
              },
              {
                title: "Connaissance",
                desc: "Une encyclopédie vivante de l'univers bouddhiste et yogique, enrichie en permanence.",
                icon: "◈",
              },
              {
                title: "Communauté",
                desc: "Des membres partageant les mêmes valeurs, unis par la quête du bonheur authentique.",
                icon: "❋",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="p-6 rounded-2xl border border-gray-800 bg-gray-950 hover:border-green-400/40 transition-colors"
              >
                <div className="text-green-400 text-2xl mb-4">{f.icon}</div>
                <h3 className="font-iceberg uppercase text-white text-lg mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── PRICING ── */}
      {!isSubscribed && <motion.section
        className="py-20 px-6 border-t border-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <div className="max-w-3xl mx-auto">
          <motion.p variants={fadeUp} className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
            Accès
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-16">
            Une tarification simple
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden flex flex-col md:flex-row"
          >
            <div className="flex-1 p-8 md:p-10">
              <h3 className="font-iceberg uppercase text-xl text-white mb-4">Abonnement mensuel</h3>
              <p className="text-gray-400 text-sm mb-8">
                Accédez à l&apos;intégralité du contenu exclusif : articles, ressources membres, et plus encore.
              </p>
              <div className="space-y-3">
                {[
                  "Accès à tous les articles",
                  "Ressources exclusives des membres",
                  "T-shirt officiel (bientôt)",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <FaCheck className="text-green-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-gray-900 md:min-w-[220px]">
              <span className="text-gray-400 text-sm font-kanit mb-2">Par mois</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold font-iceberg text-white">5€</span>
                <span className="text-gray-400 text-sm">/mois</span>
              </div>
              <Link
                href="/subscription"
                className="w-full text-center px-6 py-3 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-95"
              >
                Commencer
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>}

      {/* ── CTA FINAL ── */}
      <motion.section
        className="relative py-32 px-6 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        {sectionImages[3] && (
          <Image src={sectionImages[3]} alt="" fill style={{ objectFit: "cover" }} className="opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-iceberg uppercase text-white mb-6">
            {isLoggedIn ? "Continuez l'exploration" : "Prêt à commencer ?"}
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-300 text-lg mb-10">
            {isSubscribed
              ? "Merci pour votre soutien. Profitez de tout le contenu exclusif Seranya."
              : "Rejoignez la communauté Seranya et entamez votre voyage vers la paix intérieure."}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
            {!isLoggedIn && (
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200"
              >
                Créer un compte <FaArrowRight className="w-4 h-4" />
              </Link>
            )}
            {isLoggedIn && !isSubscribed && (
              <Link
                href="/subscription"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200"
              >
                S&apos;abonner <FaArrowRight className="w-4 h-4" />
              </Link>
            )}
            {isSubscribed && (
              <Link
                href="/univers"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200"
              >
                Explorer l&apos;univers <FaArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:border-green-400 hover:text-green-400 transition-all duration-200"
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </motion.section>

    </main>
  );
}
