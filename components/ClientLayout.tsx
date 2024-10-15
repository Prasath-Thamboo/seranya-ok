// spectralnext/components/ClientLayout.tsx

"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import React from "react";
import { BackTop } from "antd"; // Importation de BackTop
import { FaArrowUp } from "react-icons/fa"; // Importation de l'icône flèche vers le haut

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
        <div className="back-to-top-button">
          <FaArrowUp className="text-teal-500 text-2xl" />
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
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.7),
                      0 0 20px rgba(0, 255, 255, 0.6),
                      0 0 30px rgba(0, 255, 255, 0.5);
          animation: fade-in 1.5s;
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
      `}</style>
    </>
  );
}
