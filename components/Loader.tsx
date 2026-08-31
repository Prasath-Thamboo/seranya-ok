// seranyanext/components/Loader.tsx
"use client";

import React from "react";
import Image from "next/image";

/** Chargement plein écran — respiration douce, fond ivoire. */
const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-page">
      <Image
        src="/logos/seranyaicon.png"
        alt="Chargement"
        width={120}
        height={120}
        className="object-contain [animation:breathe_2.4s_ease-in-out_infinite]"
        priority
      />
    </div>
  );
};

export default Loader;
