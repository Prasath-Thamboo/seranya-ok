"use client";

import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function SuccessClient() {
  return (
    <main className="min-h-screen bg-black text-white font-kanit flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <FaCheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />

        <h1 className="text-3xl md:text-4xl font-iceberg uppercase tracking-wide text-white mb-4">
          Abonnement confirmé
        </h1>

        <p className="text-gray-400 mb-10 leading-relaxed">
          Merci pour votre confiance. Votre accès premium est en cours d&apos;activation et sera disponible dans quelques instants.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-lg hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
