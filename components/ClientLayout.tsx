"use client"; // Marquez ce fichier comme un composant client

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar"; // Importer le composant Navbar

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Vérifiez si le chemin ne commence pas par "/auth" ou "/dashboard"
  const shouldShowNavbar = !pathname.startsWith("/auth") && !pathname.startsWith("/dashboard");

  return (
    <>
      {/* Affichez la Navbar si shouldShowNavbar est vrai */}
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  );
}
