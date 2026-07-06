import type { Metadata } from "next";
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import { getImageUrl } from "@/utils/image";
import UnitDetailClient from "./UnitDetailClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getUnit(id: string) {
  try {
    return await fetchUnitById(parseInt(id, 10));
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const unit = await getUnit(params.id);

  if (!unit) {
    return {
      title: "Entité introuvable",
      description: "Cette entité n'existe pas ou a été supprimée.",
    };
  }

  const description =
    (unit.subtitle || unit.intro || `Découvrez ${unit.title} dans l'univers Seranya.`).slice(0, 160);
  const image = getImageUrl(unit.headerImage || unit.profileImage);

  return {
    title: unit.title,
    description,
    alternates: { canonical: `/univers/units/${unit.id}` },
    openGraph: {
      title: unit.title,
      description,
      type: "profile",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: unit.title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const unit = await getUnit(params.id);

  const jsonLd = unit
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Univers", item: `${siteUrl}/univers` },
          { "@type": "ListItem", position: 2, name: unit.title, item: `${siteUrl}/univers/units/${unit.id}` },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <UnitDetailClient />
    </>
  );
}
