"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (!pathname) return null;

  const shouldShowNavbar = !pathname.startsWith("/auth") && !pathname.startsWith("/admin");
  const shouldShowFooter = !pathname.startsWith("/auth/login") &&
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
