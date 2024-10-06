// spectralnext/components/ClientLayout.tsx
"use client";  // Spécifie que ce composant est un composant client

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import React from "react";
import { useLoading } from "@/components/LoadingContext"; 

interface ClientLayoutProps {
  children: ReactNode;
  footerImage?: string; // Add the footerImage prop
}

export default function ClientLayout({ children, footerImage }: ClientLayoutProps) {
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
                              {shouldShowFooter && <Footer backgroundImage={footerImage} />} {/* Pass the footerImage here */}
                            </>
                          );
                        }
