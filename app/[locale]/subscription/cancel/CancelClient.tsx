"use client";

import Link from "next/link";
import { LuXCircle } from "react-icons/lu";

export default function CancelClient() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-6 font-sans text-ink">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sunken text-ink-muted">
          <LuXCircle className="h-8 w-8" />
        </span>

        <h1 className="mb-4 font-serif text-3xl font-medium text-ink md:text-4xl">Paiement annulé</h1>

        <p className="mb-10 leading-relaxed text-ink-soft">
          Vous n&apos;avez pas été débité. Vous pouvez réessayer à tout moment depuis la page
          d&apos;abonnement.
        </p>

        <Link
          href="/subscription"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/50 px-8 py-3 text-sm font-sans text-accent transition-all duration-200 hover:bg-accent-soft"
        >
          Retour aux plans
        </Link>
      </div>
    </main>
  );
}
