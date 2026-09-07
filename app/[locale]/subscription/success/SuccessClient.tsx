"use client";

import Link from "next/link";
import { LuCheckCircle } from "react-icons/lu";

export default function SuccessClient() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-6 font-sans text-ink">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <LuCheckCircle className="h-8 w-8" />
        </span>

        <h1 className="mb-4 font-serif text-3xl font-medium text-ink md:text-4xl">Abonnement confirmé</h1>

        <p className="mb-10 leading-relaxed text-ink-soft">
          Merci pour votre confiance. Votre accès premium est en cours d&apos;activation et sera
          disponible dans quelques instants.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-sans text-ink-invert transition-all duration-200 hover:bg-accent-hover"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
