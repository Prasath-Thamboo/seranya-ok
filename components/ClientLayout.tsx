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

  const shouldShowNavbar =
    pathname && !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
  const shouldShowFooter =
    !disableFooter &&
    pathname &&
    !pathname.startsWith("/auth/login") &&
    !pathname.startsWith("/auth/register") &&
    !pathname.startsWith("/admin");

  console.log("ClientLayout: footerImage prop:", footerImage);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div>{children}</div>
      {shouldShowFooter && <Footer backgroundImage={footerImage} />}
    </>
  );
}
