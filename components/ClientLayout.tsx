"use client";  // Specifies this is a client-side component

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import React from "react";

interface ClientLayoutProps {
  children: ReactNode;
  footerImage?: string; // Optional prop for the footer image
}

export default function ClientLayout({ children, footerImage }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulates loading time (2s)
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />; // Shows loader while the page is loading
  }

  // Ensure pathname is not null before using it
  const shouldShowNavbar = pathname && !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
  const shouldShowFooter = pathname && !pathname.startsWith("/auth/login") &&
                           !pathname.startsWith("/auth/register") &&
                           !pathname.startsWith("/admin") &&
                           !pathname.startsWith("/univers/units");

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div>{children}</div>
      {/* Only render the footer once, prioritize footerImage */}
      {shouldShowFooter && <Footer backgroundImage={footerImage} />}
    </>
  );
}
