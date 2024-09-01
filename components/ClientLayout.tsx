"use client"; // Marquez ce fichier comme un composant client

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Importer le composant Footer

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Si pathname est null, return null pour éviter les erreurs
  if (!pathname) return null;

  // Vérifiez si le chemin ne commence pas par "/auth" ou "/dashboard"
  const shouldShowNavbar = !pathname.startsWith("/auth") && !pathname.startsWith("/admin");

  // Vérifiez si le footer doit être affiché (pas sur les pages de connexion, d'inscription et du dashboard)
  const shouldShowFooter = !pathname.startsWith("/auth/login") &&
                           !pathname.startsWith("/auth/register") &&
                           !pathname.startsWith("/admin");

  return (
    <>
      {/* Affichez la Navbar si shouldShowNavbar est vrai */}
      {shouldShowNavbar && <Navbar />}
      
      {/* Ajout de la marge si la Navbar est présente */}
      <div className={shouldShowNavbar ? "" : ""}>
        {children}
      </div>
      
      {/* Affichez le Footer si shouldShowFooter est vrai */}
      {shouldShowFooter && <Footer />}
    </>
  );
}
