import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Analytics from "@/components/Analytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seranya - Découvrez un Univers Fascinant",
    template: "%s | Seranya",
  },
  description: "Plongez dans le monde fascinant de Seranya, une expérience immersive inédite.",
  keywords: ["Seranya", "Fantasy", "Immersive Experience", "Aventure", "Découverte", "Univers interactif"],
  robots: "index, follow",
  openGraph: {
    title: "Seranya - Découvrez un Univers Fascinant",
    description: "Plongez dans le monde fascinant de Seranya, une expérience immersive inédite.",
    url: siteUrl,
    siteName: "Seranya",
    images: [
      {
        url: `${siteUrl}/logos/seranyaicon.png`,
        width: 1200,
        height: 630,
        alt: "Seranya Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seranya - Découvrez un Univers Fascinant",
    description: "Votre aventure commence ici avec des expériences immersives fascinantes.",
    images: [`${siteUrl}/logos/seranyaicon.png`],
  },
  icons: {
    icon: "/logos/seranyaicon.png",
    apple: "/logos/seranyaicon.png",
  },
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
    },
  },
  manifest: "/manifest.json",
  other: {
    "geo.region": "FR",
    "geo.placename": "Paris",
    "geo.position": "48.8566;2.3522",
    ICBM: "48.8566, 2.3522",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Seranya",
      url: siteUrl,
      logo: `${siteUrl}/logos/seranyaicon.png`,
    },
    {
      "@type": "WebSite",
      name: "Seranya",
      url: siteUrl,
      inLanguage: "fr-FR",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
