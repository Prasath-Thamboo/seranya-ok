import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Analytics from "@/components/Analytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Corps / UI : sans humaniste douce, haute lisibilité.
const fontSans = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

// Titres / moments de marque : serif élégante et posée (casse normale).
const fontSerif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

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
  themeColor: "#FAF7F2",
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
    <html lang="fr" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Analytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
