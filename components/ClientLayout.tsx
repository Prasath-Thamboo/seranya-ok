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
    </>
  );
}
