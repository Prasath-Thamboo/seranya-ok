"use client";

import { useNotification } from '@/components/notifications/NotificationProvider';
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaCheck, FaTimes, FaLeaf, FaStar, FaShieldAlt, FaInfinity } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.1 },
  }),
};

const FREE_FEATURES = [
  { label: "Accès aux articles publics", included: true },
  { label: "Présentation du yoga bouddhiste", included: true },
  { label: "Création de profil", included: true },
  { label: "Édition de posts", included: false },
  { label: "Statut d'éditeur", included: false },
  { label: "Ressources exclusives", included: false },
];

const PREMIUM_FEATURES = [
  { label: "Accès à tous les articles", included: true },
  { label: "Présentation du yoga bouddhiste", included: true },
  { label: "Création de profil", included: true },
  { label: "Édition de posts", included: true },
  { label: "Statut d'éditeur", included: true },
  { label: "Ressources exclusives membres", included: true },
];

const BENEFITS = [
  { icon: <FaLeaf className="w-6 h-6 text-green-400" />, title: "Contenu curé", desc: "Articles, guides et pratiques issus des traditions du yoga et de la méditation bouddhiste." },
  { icon: <HiSparkles className="w-6 h-6 text-green-400" />, title: "Éditeur actif", desc: "Rédigez et publiez vos propres articles pour partager votre expérience avec la communauté." },
  { icon: <FaShieldAlt className="w-6 h-6 text-green-400" />, title: "Sans engagement", desc: "Résiliez à tout moment. Aucune condition cachée, aucune surprise." },
  { icon: <FaInfinity className="w-6 h-6 text-green-400" />, title: "Accès illimité", desc: "Tout le contenu, tout le temps, depuis n'importe quel appareil." },
];

export const Pricing = () => {
  const { addNotification } = useNotification();
  const [userId, setUserId] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        if (user?.id) {
          setUserId(user.id);
          setIsSubscribed(user.isSubscribed ?? false);
        }
      })
      .catch(() => setUserId(null));
  }, []);

  const handleSubscription = async () => {
    if (!userId) {
      addNotification("critical", "Vous devez d'abord créer un compte pour continuer.", {
        primaryButtonLabel: "Créer un compte",
        secondaryButtonLabel: "Annuler",
        onPrimaryButtonClick: () => { window.location.href = "/auth/register"; },
        onSecondaryButtonClick: () => {},
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://back.seranya.fr/payment/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.sessionUrl) {
        window.open(data.sessionUrl, '_blank');
      } else {
        addNotification("critical", "Une erreur s'est produite. Réessayez.");
      }
    } catch {
      addNotification("critical", "Erreur lors de la création de l'abonnement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full font-kanit">

      {/* ── Plans ── */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
        >
          <span className="inline-block px-4 py-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-iceberg uppercase tracking-widest rounded-full mb-4">
            Tarification
          </span>
          <h2 className="text-4xl md:text-5xl font-iceberg uppercase text-white mb-4 tracking-wide">
            Choisissez votre voie
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Commencez gratuitement, évoluez quand vous le souhaitez.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Plan Gratuit */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="flex flex-col p-8 rounded-2xl border border-gray-800 bg-gray-950"
          >
            <div className="mb-8">
              <p className="text-xs font-iceberg uppercase tracking-widest text-gray-400 mb-3">Plan Gratuit</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold font-iceberg text-white">0€</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <p className="text-gray-400 text-sm">Idéal pour découvrir l&apos;univers Seranya à votre rythme.</p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm">
                  {f.included
                    ? <FaCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                    : <FaTimes className="w-4 h-4 text-gray-700 flex-shrink-0" />}
                  <span className={f.included ? "text-gray-300" : "text-gray-600"}>{f.label}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full h-12 rounded-lg border border-gray-700 text-gray-500 font-iceberg uppercase tracking-widest text-sm cursor-not-allowed"
            >
              Plan actuel
            </button>
          </motion.div>

          {/* Plan Premium */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="flex flex-col p-8 rounded-2xl border border-green-500/50 bg-gradient-to-b from-green-950/40 to-gray-950 relative overflow-hidden shadow-xl shadow-green-500/10"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-green-500/20 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-iceberg uppercase tracking-widest text-green-400">Plan Premium</p>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-iceberg uppercase tracking-widest rounded-full">
                  <FaStar className="w-3 h-3" /> Populaire
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold font-iceberg text-white">5€</span>
                <span className="text-gray-400 text-sm">/mois</span>
              </div>
              <p className="text-gray-300 text-sm">Accès complet à tout le contenu et statut d&apos;éditeur actif.</p>
            </div>

            <ul className="space-y-3 mb-10 flex-1 relative">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm">
                  <FaCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">{f.label}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSubscription}
              disabled={isSubscribed || loading}
              className={`relative w-full h-12 rounded-lg font-iceberg uppercase tracking-widest text-sm transition-all duration-200 ${
                isSubscribed
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/40 active:scale-95"
              }`}
            >
              {isSubscribed ? "Déjà abonné ✓" : loading ? "Chargement..." : "Commencer maintenant →"}
            </button>

            {!isSubscribed && (
              <p className="text-center text-gray-500 text-xs mt-3">Sans engagement · Résiliable à tout moment</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Bénéfices ── */}
      <div className="border-t border-gray-900 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-iceberg uppercase text-center text-white mb-12 tracking-wide"
          >
            Pourquoi rejoindre la communauté ?
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="p-6 rounded-xl border border-gray-800 bg-gray-950 hover:border-green-400/40 transition-colors"
              >
                <div className="mb-4">{b.icon}</div>
                <h4 className="font-iceberg uppercase text-white text-sm mb-2">{b.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Final ── */}
      <div className="py-16 px-6 text-center border-t border-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-400 text-base mb-3">Des questions avant de vous lancer ?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-iceberg uppercase tracking-widest text-sm transition-colors"
          >
            Contactez-nous →
          </Link>
        </motion.div>
      </div>

    </div>
  );
};
