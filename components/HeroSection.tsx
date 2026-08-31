// seranyanext/components/HeroSection.tsx

import React from "react";
import Image from "next/image";

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  titleColor?: string;
  strongTitle: string;
  strongTitleColor?: string;
  content: string;
  contentColor?: string;
  button1Text: string;
  button1Url: string;
  button1BgColor?: string;
  button2Text: string;
  button2Url: string;
  button2BgColor?: string;
}

/**
 * Hero unifié — imagerie traitée en lumière douce, fondu élégant vers la
 * couleur de page en bas, titrage serif en casse normale, CTA pilule.
 * Les props de couleur héritées sont désormais optionnelles et ignorées :
 * le hero suit la charte.
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  title,
  strongTitle,
  content,
  button1Text,
  button1Url,
  button2Text,
  button2Url,
}) => {
  return (
    <section className="relative flex h-[82vh] min-h-[560px] items-center justify-center overflow-hidden bg-page">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
        className="scale-105"
      />

      {/* Voile clair léger pour la lisibilité + fondu vers la page en bas */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-page" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h1 className="font-serif text-4xl font-medium leading-tight text-white sm:text-6xl text-shadow-sm">
          {title}
          <span className="mt-2 block text-white/95">{strongTitle}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-white/90 sm:text-lg text-shadow-sm">
          {content}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={button1Url}
            className="rounded-full bg-accent px-8 py-3 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
          >
            {button1Text}
          </a>
          <a
            href={button2Url}
            className="rounded-full border border-white/60 px-8 py-3 text-sm font-sans text-white transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-white/10"
          >
            {button2Text}
          </a>
        </div>
      </div>

      {/* Indicateur de scroll — mouvement lent façon respiration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 pt-1.5">
          <div className="h-2.5 w-1.5 rounded-full bg-white/70 [animation:breathe_2.6s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
