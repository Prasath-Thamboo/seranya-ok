// spectralnext/components/ClientLayout.tsx

"use client";

import { ReactNode, useEffect, useState, useContext } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import React from "react";
import { BackTop } from "antd"; // Importation de BackTop
import { FaArrowUp } from "react-icons/fa"; // Importation de l'icône flèche vers le haut
import { ColorContext } from "@/context/ColorContext"; // Importer le ColorContext

interface ClientLayoutProps {
  children: ReactNode;
  footerImage?: string; // Accept footerImage prop
  disableFooter?: boolean; // New prop to control whether the footer should be shown
}

export default function ClientLayout({
  children,
  footerImage,
  disableFooter = false, // Default to false
}: ClientLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { color } = useContext(ColorContext); // Consommer le contexte

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulate a loading delay
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />; // Show the loader while the page is loading
  }

  // Define paths where the footer should not be shown
  const excludedFooterPaths = [
    "/auth/login",
    "/auth/register",
    "/admin",
    "/univers/units", // Path for the unit detail pages
  ];

  // Determine if the current path should exclude the footer
  const shouldShowNavbar = pathname && !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
  const shouldShowFooter = !disableFooter && pathname && !excludedFooterPaths.some((path) => pathname.startsWith(path));

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div>{children}</div>
      {shouldShowFooter && <Footer backgroundImage={footerImage} />}

      {/* Back to Top Button */}
      <BackTop visibilityHeight={200}>
        <div
          className="back-to-top-button"
          style={{
            "--neon-color": color || "#008080",
          } as React.CSSProperties}
        >
          <FaArrowUp className="text-2xl" />
        </div>
      </BackTop>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Animation de fade-in */
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Stylisation du bouton Back to Top */
        .back-to-top-button {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 48px; /* Ajustez la taille selon vos besoins */
          width: 48px;  /* Ajustez la taille selon vos besoins */
          background-color: #000; /* Couleur de fond noire */
          border-radius: 50%;
          box-shadow: 0 0 10px var(--neon-color, #008080),
                      0 0 20px var(--neon-color, #008080),
                      0 0 30px var(--neon-color, #008080);
          animation: pulse-neon 2s infinite;
          transition: opacity 0.3s;
          cursor: pointer;
        }

        /* Positionnement du bouton Back to Top */
        .ant-back-top {
          right: 40px; /* Distance du bord droit */
          bottom: 40px; /* Distance du bord inférieur */
        }

        /* Hover effect pour le bouton */
        .back-to-top-button:hover {
          opacity: 0.8;
        }

        /* Effet pulsant néon pour le bouton Back to Top */
        @keyframes pulse-neon {
          0% {
            box-shadow: 0 0 10px var(--neon-color, #008080),
                        0 0 20px var(--neon-color, #008080),
                        0 0 30px var(--neon-color, #008080);
          }
          50% {
            box-shadow: 0 0 20px var(--neon-color, #008080),
                        0 0 30px var(--neon-color, #008080),
                        0 0 40px var(--neon-color, #008080);
          }
          100% {
            box-shadow: 0 0 10px var(--neon-color, #008080),
                        0 0 20px var(--neon-color, #008080),
                        0 0 30px var(--neon-color, #008080);
          }
        }

        /* Stylisation du contenu du BackTop */
        .back-to-top-button > svg {
          color: var(--neon-color, #008080); /* Couleur de l'icône basée sur la couleur néon */
          transition: color 0.3s;
        }

        /* Animation optionnelle pour l'icône */
        @keyframes neon-pulse {
          0% {
            color: var(--neon-color, #008080);
          }
          50% {
            color: lighten(var(--neon-color, #008080), 20%);
          }
          100% {
            color: var(--neon-color, #008080);
          }
        }

        /* Appliquer l'animation à l'icône */
        .back-to-top-button > svg {
          animation: neon-pulse 2s infinite;
        }
      `}</style>
    </>
  );
}
