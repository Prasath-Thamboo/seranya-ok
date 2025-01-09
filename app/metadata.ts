import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seranya - Découvrez un Univers Fascinant",
  description: "Plongez dans le monde fascinant de Seranya",
  keywords: ["Seranya", "Fantasy", "Immersive Experience", "Aventure", "Découverte", "Univers interactif"],
  robots: "index, follow",
  // Open Graph metadata for social media sharing
  openGraph: {
    title: "SeranyaNext - Découvrez un Univers Fascinant",
    description: "Plongez dans le monde fascinant de Seranya, une expérience immersive inédite.",
    url: "https://www.seranya.fr",
    siteName: "SeranyaNext",
    images: [
      {
        url: "https://seranya.fr/logos/seranyaicon.png",
        width: 1200,
        height: 630,
        alt: "Seranya Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Seranya - Découvrez un Univers Fascinant",
    description: "Votre aventure commence ici avec des expériences immersives fascinantes.",
    images: ["https://seranya.fr/logos/seranyaicon.png"],
  },
  // Information about the theme color for mobile devices and PWA
  themeColor: "#000000",
  // Icons for the site (favicons and Apple icons)
  icons: {
    icon: "/logos/seranyaicon.png",
    apple: "/logos/seranyaicon.png",
  },
  // Alternative URLs for other languages
  alternates: {
    canonical: "http://seranya.fr/",
    languages: {
      fr: "http://seranya.fr/",
    },
  },
};
