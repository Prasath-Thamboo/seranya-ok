import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spectral - Découvrez un Univers Fascinant",
  description: "Plongez dans le monde fascinant de Spectral",
  keywords: ["Spectral", "Fantasy", "Immersive Experience", "Aventure", "Découverte", "Univers interactif"],
  robots: "index, follow",
  // Open Graph metadata for social media sharing
  openGraph: {
    title: "SpectralNext - Découvrez un Univers Fascinant",
    description: "Plongez dans le monde fascinant de Spectral, une expérience immersive inédite.",
    url: "https://www.spectralunivers.com",
    siteName: "SpectralNext",
    images: [
      {
        url: "https://www.spectralunivers.com/logos/spectral-favicon-color%20(1).png",
        width: 1200,
        height: 630,
        alt: "Spectral Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Spectral - Découvrez un Univers Fascinant",
    description: "Votre aventure commence ici avec des expériences immersives fascinantes.",
    images: ["https://www.spectralunivers.com/logos/spectral-favicon-color%20(1).png"],
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
