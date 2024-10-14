// spectralnext/app/layout.tsx

"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { ConfigProvider } from "antd";
import frFR from "antd/lib/locale/fr_FR";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";
import { useEffect, useState } from "react";
import { metadata } from "@/app/metadata";
import React from "react";
import { LoadingProvider } from "@/components/LoadingContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <html lang="fr">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        <link rel="manifest" href="/manifest.json" />

        {/* Meta tags pour SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={String(metadata.description) ?? "Description par défaut"}
        />
        <meta
          name="keywords"
          content="Spectral, aventure, univers, expérience immersive, découverte"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph pour les réseaux sociaux */}
        <meta
          property="og:title"
          content={String(metadata.title) ?? "Spectral"}
        />
        <meta
          property="og:description"
          content={String(metadata.description) ?? "Plongez dans le monde fascinant de Spectral."}
        />
        <meta property="og:image" content="https://www.spectralunivers.com/logos/spectral-favicon-color%20(1).png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.spectralunivers.com/" />

        <meta name="geo.region" content="FR" /> 
        <meta name="geo.placename" content="Paris" />
        <meta name="geo.position" content="48.8566;2.3522" /> 
        <meta name="ICBM" content="48.8566, 2.3522" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={String(metadata.title) ?? "Spectral"}
        />
        <meta
          name="twitter:description"
          content={String(metadata.description) ?? "Votre aventure commence ici avec des expériences immersives."}
        />
        <meta name="twitter:image" content="https://www.spectralunivers.com/logos/spectral-favicon-color%20(1).png" />
      </head>
      <ConfigProvider locale={frFR}>
        <body className={inter.className}>
          {/* Charger Google Analytics uniquement si le consentement est donné */}
          {consentGiven === true && (
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
          )}

          <LoadingProvider>
            <NotificationProvider>
              <CookieConsent />
              {children}
            </NotificationProvider>
          </LoadingProvider>
        </body>
      </ConfigProvider>
    </html>
  );
}
