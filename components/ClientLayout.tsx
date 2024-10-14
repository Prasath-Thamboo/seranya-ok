// spectralnext/components/ClientLayout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import React from "react";

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

  // Définir les chemins à exclure
  const excludedPaths = ["/auth", "/admin", "/contact", "/subscription", "/login"];

  // Fonction pour vérifier si le chemin actuel commence par un des chemins exclus
  const isExcluded = excludedPaths.some((path) => pathname?.startsWith(path));

  const shouldShowNavbar = !isExcluded;
  const shouldShowFooter = !disableFooter && !isExcluded;

  console.log("ClientLayout: footerImage prop:", footerImage);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div>{children}</div>
      {shouldShowFooter && <Footer backgroundImage={footerImage} />}
    </>
  );
}
