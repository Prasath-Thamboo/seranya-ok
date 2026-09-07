// seranyanext/components/ClientLayout.tsx

"use client";

import { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BackTop } from "antd"; // Importation de BackTop
import { FaArrowUp } from "react-icons/fa"; // Importation de l'icône flèche vers le haut

interface ClientLayoutProps {
  children: ReactNode;
  disableFooter?: boolean; // New prop to control whether the footer should be shown
}

export default function ClientLayout({
  children,
  disableFooter = false, // Default to false
}: ClientLayoutProps) {
  const pathname = usePathname();

  // Define paths where the footer should not be shown
  const excludedFooterPaths = [
    "/auth/login",
    "/auth/register",
    "/admin",
  ];

  // Determine if the current path should exclude the footer
  const shouldShowNavbar = pathname && !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
  const shouldShowFooter = !disableFooter && pathname && !excludedFooterPaths.some((path) => pathname.startsWith(path));

  // Handler pour le chargement des images (si nécessaire)
  const handleImageLoad = () => {
    // Implémentez la logique de gestion du chargement des images ici
  };

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div>{children}</div>
      {shouldShowFooter && <Footer onLoad={handleImageLoad} />}

      {/* Bouton retour en haut de page */}
      <BackTop visibilityHeight={200}>
        <div className="back-to-top-button">
          <FaArrowUp className="text-lg" />
        </div>
      </BackTop>

      {/* Styles — élévation douce, aucune pulsation/halo coloré */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .back-to-top-button {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 48px;
          width: 48px;
          background-color: var(--surface-raised, #fffdf9);
          border: 1px solid var(--border-subtle, #e4dacb);
          border-radius: 50%;
          box-shadow: 0 8px 30px rgba(43, 36, 29, 0.12);
          transition: box-shadow 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
          cursor: pointer;
        }

        .ant-back-top {
          right: 40px;
          bottom: 40px;
        }

        .back-to-top-button:hover {
          opacity: 1;
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(43, 36, 29, 0.16);
        }

        .back-to-top-button > svg {
          color: var(--accent, #7a8b6f);
          transition: color 0.3s ease;
        }
      `}</style>
    </>
  );
}
