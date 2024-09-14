// spectralnext/components/Loader.tsx
"use client";

import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="animate-pulse">
        <img
          src="/logos/favicon.ico" // Assure-toi que le chemin de l'image est correct
          alt="Loading Logo"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>
      <style jsx>{`

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
