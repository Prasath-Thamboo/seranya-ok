// seranyanext/components/HeroSection.tsx

import React from "react";
import Image from "next/image";

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  titleColor: string;
  strongTitle: string;
  strongTitleColor: string;
  content: string;
  contentColor: string;
  button1Text: string;
  button1Url: string;
  button1BgColor: string;
  button2Text: string;
  button2Url: string;
  button2BgColor: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  title,
  titleColor,
  strongTitle,
  strongTitleColor,
  content,
  contentColor,
  button1Text,
  button1Url,
  button1BgColor,
  button2Text,
  button2Url,
  button2BgColor,
}) => {
  return (
    <section className="relative h-[80vh] min-h-[560px] flex items-center justify-center overflow-hidden">
      <Image
        src={backgroundImage}
        alt=""
        fill
        priority
        style={{ objectFit: "cover" }}
        className="scale-105"
      />

      {/* Dégradé qui fond dans le noir en bas pour une transition douce vers le contenu */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h1
          className="text-3xl font-extrabold sm:text-5xl font-iceberg text-shadow-sm"
          style={{ color: titleColor }}
        >
          {title}
          <strong
            className="block mt-2 font-extrabold font-iceberg text-shadow-sm"
            style={{ color: strongTitleColor }}
          >
            {strongTitle}
          </strong>
        </h1>

        <p
          className="mt-6 max-w-lg mx-auto sm:text-xl/relaxed font-kanit text-shadow-sm"
          style={{ color: contentColor }}
        >
          {content}
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            href={button1Url}
            className="block w-full rounded px-12 py-3 text-sm font-medium text-white shadow-lg focus:outline-none focus:ring sm:w-auto transform transition-all duration-300 hover:scale-105 font-kanit"
            style={{ backgroundColor: button1BgColor }}
          >
            {button1Text}
          </a>

          <a
            href={button2Url}
            className="block w-full rounded px-12 py-3 text-sm font-medium text-white shadow-lg focus:outline-none focus:ring sm:w-auto transform transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black hover:border-black hover:shadow-neon font-kanit"
            style={{ backgroundColor: button2BgColor }}
          >
            {button2Text}
          </a>
        </div>
      </div>

      {/* Indicateur de scroll, cohérent avec le hero de la page d'accueil */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
