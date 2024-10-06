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
}

export default function ClientLayout({ children, footerImage }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Simulate loading time (2s)
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader />; // Display the loader while loading
  }

  const shouldShowNavbar = pathname && !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
  const shouldShowFooter = pathname && !pathname.startsWith("/auth/login") &&
                           !pathname.startsWith("/auth/register") &&
                           !pathname.startsWith("/admin");

  // Prevent Footer rendering twice: render it only when no `footerImage` is passed to pages.
  const renderFooter = footerImage || shouldShowFooter;

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <div>{children}</div>
      {renderFooter && <Footer backgroundImage={footerImage} />}
    </>
  );
}
