import type { Metadata, Viewport } from "next";
import { Fraunces, Figtree } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import Providers from "@/components/Providers";
import Analytics from "@/components/Analytics";
import { routing, isLocale } from "@/i18n/routing";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const OG_LOCALE: Record<string, string> = { fr: "fr_FR", en: "en_US" };
const HTML_LANG: Record<string, string> = { fr: "fr-FR", en: "en-US" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const isDefault = locale === routing.defaultLocale;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: "%s | Seranya",
    },
    description: t("description"),
    keywords: t("keywords").split(",").map((k) => k.trim()),
    robots: "index, follow",
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: isDefault ? siteUrl : `${siteUrl}/${locale}`,
      siteName: "Seranya",
      images: [
        {
          url: `${siteUrl}/logos/seranyaicon.png`,
          width: 1200,
          height: 630,
          alt: "Seranya Logo",
        },
      ],
      locale: OG_LOCALE[locale] ?? OG_LOCALE.fr,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("twitterDescription"),
      images: [`${siteUrl}/logos/seranyaicon.png`],
    },
    icons: {
      icon: "/logos/seranyaicon.png",
      apple: "/logos/seranyaicon.png",
    },
    alternates: {
      canonical: isDefault ? "/" : `/${locale}`,
      languages: {
        fr: "/",
        en: "/en",
        "x-default": "/",
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // Active le rendu statique pour ce segment de locale.
  setRequestLocale(locale);

  const messages = await getMessages();

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
        url: locale === routing.defaultLocale ? siteUrl : `${siteUrl}/${locale}`,
        inLanguage: HTML_LANG[locale] ?? HTML_LANG.fr,
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${fontSans.variable} ${fontSerif.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Analytics />
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
