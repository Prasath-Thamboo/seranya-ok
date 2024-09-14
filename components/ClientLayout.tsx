// spectralnext/components/ClientLayout.tsx
"use client";  // Spécifie que ce composant est un composant client

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simule un délai de chargement (2s)
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />; // Affiche le loader tant que la page charge
  }

  // Assurez-vous que pathname n'est pas nul avant de l'utiliser
  const shouldShowNavbar = pathname && !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
  const shouldShowFooter = pathname && !pathname.startsWith("/auth/login") &&
                           !pathname.startsWith("/auth/register") &&
                           !pathname.startsWith("/admin");

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div className={shouldShowNavbar ? "" : ""}>
        {children}
      </div>
      {shouldShowFooter && <Footer />}
    </>
  );
}
