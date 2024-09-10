import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpectralNext - Découvrez un Univers Fascinant",
  description: "Plongez dans le monde fascinant de Spectral, où chaque choix peut transformer votre destinée.",
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
    title: "SpectralNext - Découvrez un Univers Fascinant",
    description: "Votre aventure commence ici avec des expériences immersives fascinantes.",
    images: ["https://www.spectralunivers.com/logos/spectral-favicon-color%20(1).png"],
  },
  // Information about the theme color for mobile devices and PWA
  themeColor: "#000000",
  // Icons for the site (favicons and Apple icons)
  icons: {
    icon: "/logos/spectral-favicon-color (1).png",
    apple: "/logos/spectral-favicon-color (1).png",
  },
  // Alternative URLs for other languages
  alternates: {
    canonical: "https://www.spectralunivers.com",
    languages: {
      fr: "https://www.spectralunivers.com/fr",
    },
  },
};
