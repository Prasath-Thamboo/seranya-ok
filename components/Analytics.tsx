"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "true") {
      setConsentGiven(true);
    } else if (consent === "false") {
      setConsentGiven(false);
    } else {
      setConsentGiven(null);
    }
  }, []);

  if (consentGiven !== true) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-LSE6MNVHP2`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LSE6MNVHP2', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
