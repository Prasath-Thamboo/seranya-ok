"use client";

import React from "react";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Gabarit commun aux pages légales (mentions, confidentialité, cookies, RGPD).
 * Prose sobre sur fond ivoire, carte claire, titres serif, liens en accent.
 */
export default function LegalLayout({ title, children }: LegalLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-page font-sans text-ink">
      <div className="mx-auto max-w-3xl px-6 py-24 pt-32">
        <h1 className="mb-3 text-center font-serif text-4xl font-medium text-ink">{title}</h1>
        <div className="mx-auto mb-12 h-px w-16 bg-accent/70" />

        <div
          className="rounded-3xl border border-line bg-raised p-6 text-ink-soft shadow-sm md:p-12
            [&_a]:text-accent [&_a]:underline hover:[&_a]:text-accent-hover
            [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-ink
            [&_li]:mb-1 [&_p]:mb-5 [&_p]:leading-relaxed [&_strong]:text-ink
            [&_table]:w-full [&_table]:text-left [&_th]:border-b [&_th]:border-line [&_th]:py-2 [&_th]:pr-4 [&_th]:font-medium [&_th]:text-ink
            [&_td]:border-b [&_td]:border-line/70 [&_td]:py-2 [&_td]:pr-4 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
