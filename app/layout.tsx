import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { ConfigProvider } from "antd";
import frFR from "antd/lib/locale/fr_FR";
import SessionProviderWrapper from "@/SessionProviderWrapper";// Utilisez votre composant client

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpectralNext - Découvrez un Univers Fascinant",
  description: "Plongez dans le monde fascinant de Spectral, où chaque choix peut transformer votre destinée.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logos/spectral-favicon-color (1).png" type="image/png" />

        {/* Meta tags pour SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="SpectralNext - Votre aventure commence ici avec des expériences immersives et un univers fascinant." />
        <meta name="keywords" content="Spectral, aventure, univers, expérience immersive, découverte" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph pour les réseaux sociaux */}
        <meta property="og:title" content="SpectralNext" />
        <meta property="og:description" content="Plongez dans le monde fascinant de Spectral, où chaque choix peut transformer votre destinée." />
        <meta property="og:image" content="/logos/spectral-favicon-color (1).png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.spectralunivers.com/" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SpectralNext - Découvrez un Univers Fascinant" />
        <meta name="twitter:description" content="Votre aventure commence ici avec des expériences immersives et un univers fascinant." />
        <meta name="twitter:image" content="/logos/spectral-favicon-color (1).png" />
      </head>
      <ConfigProvider locale={frFR}>
        <body className={inter.className}>
          <SessionProviderWrapper>
            <NotificationProvider>
              <ClientLayout>{children}</ClientLayout>
            </NotificationProvider>
          </SessionProviderWrapper>
        </body>
      </ConfigProvider>
    </html>
  );
}
