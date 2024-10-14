// spectralnext/components/ClientLayout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ViewFooter from "./newFooter"; // Remplacez Footer par ViewFooter
import Loader from "@/components/Loader";
import React from "react";
import { useFooter } from "@/context/FooterContext"; // Importez le hook useFooter

interface ClientLayoutProps {
  children: ReactNode;
  disableFooter?: boolean; // Nouvelle prop pour contrôler l'affichage du footer
}

export default function ClientLayout({
  children,
  disableFooter = false, // Par défaut à false
}: ClientLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { footerImage: contextFooterImage } = useFooter(); // Utilisez le contexte

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulez un délai de chargement
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />; // Affichez le loader pendant le chargement
  }

  // Définir les chemins à exclure
  const excludedPaths = ["/auth", "/admin", "/contact", "/subscription", "/login"];

  // Vérifiez si le chemin actuel est exclu
  const isExcluded = excludedPaths.some((path) => pathname?.startsWith(path));

  const shouldShowNavbar = !isExcluded;
  const shouldShowFooter = !disableFooter && !isExcluded;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div>{children}</div>
      {shouldShowFooter && <ViewFooter backgroundImage={contextFooterImage} />}
    </>
  );
}
