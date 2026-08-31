"use client";

import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { useAuthState } from "@/lib/hooks/useAuthState";

export default function FooterCTA() {
  const { isLoggedIn, isSubscribed } = useAuthState();

  return (
    <div className="relative z-10 mx-auto max-w-2xl text-center">
      <h2 className="mb-6 font-serif text-4xl font-medium text-ink md:text-5xl">
        {isLoggedIn ? "Continuez l'exploration" : "Prêt à commencer ?"}
      </h2>
      <p className="mb-10 text-lg text-ink-soft">
        {isSubscribed
          ? "Merci pour votre soutien. Profitez de tout le contenu exclusif Seranya."
          : "Rejoignez la communauté Seranya et entamez votre voyage vers la paix intérieure."}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {!isLoggedIn && (
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Créer un compte <LuArrowRight className="h-4 w-4" />
          </Link>
        )}
        {isLoggedIn && !isSubscribed && (
          <Link
            href="/subscription"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            S&apos;abonner <LuArrowRight className="h-4 w-4" />
          </Link>
        )}
        {isSubscribed && (
          <Link
            href="/univers"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            Explorer l&apos;univers <LuArrowRight className="h-4 w-4" />
          </Link>
        )}
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-3.5 text-sm font-sans text-ink transition-all duration-200 hover:border-accent hover:text-accent"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
