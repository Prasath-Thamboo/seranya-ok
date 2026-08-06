"use client";

import Link from "next/link";
import { FaTimesCircle } from "react-icons/fa";

export default function CancelClient() {
  return (
    <main className="min-h-screen bg-black text-white font-kanit flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <FaTimesCircle className="w-16 h-16 text-gray-500 mx-auto mb-6" />

        <h1 className="text-3xl md:text-4xl font-iceberg uppercase tracking-wide text-white mb-4">
          Paiement annulé
        </h1>

        <p className="text-gray-400 mb-10 leading-relaxed">
          Vous n&apos;avez pas été débité. Vous pouvez réessayer à tout moment depuis la page d&apos;abonnement.
        </p>

        <Link
          href="/subscription"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-green-500/50 text-green-400 font-iceberg uppercase tracking-widest text-sm rounded-lg hover:bg-green-500/10 transition-all duration-200"
        >
          Retour aux plans
        </Link>
      </div>
    </main>
  );
}
