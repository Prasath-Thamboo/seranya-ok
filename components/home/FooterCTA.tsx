"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useAuthState } from "@/lib/hooks/useAuthState";

export default function FooterCTA() {
  const { isLoggedIn, isSubscribed } = useAuthState();

  return (
    <div className="relative z-10 max-w-2xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-iceberg uppercase text-white mb-6">
        {isLoggedIn ? "Continuez l'exploration" : "Prêt à commencer ?"}
      </h2>
      <p className="text-gray-300 text-lg mb-10">
        {isSubscribed
          ? "Merci pour votre soutien. Profitez de tout le contenu exclusif Seranya."
          : "Rejoignez la communauté Seranya et entamez votre voyage vers la paix intérieure."}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
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
      </div>
    </div>
  );
}
