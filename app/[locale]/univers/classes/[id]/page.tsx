import type { Metadata } from "next";
import { fetchClassById } from "@/lib/queries/ClassQueries";
import { getImageUrl } from "@/utils/image";
import { UploadType, UploadModel } from "@/lib/models/ClassModels";
import ClassDetailClient from "./ClassDetailClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getClass(id: string) {
  try {
    return await fetchClassById(id);
  } catch {
    return null;
  }
}

function getClassImage(classe: Awaited<ReturnType<typeof getClass>>) {
  if (!classe) return getImageUrl(null);
  const header = classe.uploads?.find((u: UploadModel) => u.type === UploadType.HEADERIMAGE);
  const profile = classe.uploads?.find((u: UploadModel) => u.type === UploadType.PROFILEIMAGE);
  return getImageUrl(header?.path || profile?.path || classe.headerImage || classe.profileImage);
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const classe = await getClass(params.id);

  if (!classe) {
    return {
      title: "Classe introuvable",
      description: "Cette classe n'existe pas ou a été supprimée.",
    };
  }

  const description =
    (classe.subtitle || classe.intro || `Découvrez la classe ${classe.title} dans l'univers Seranya.`).slice(0, 160);
  const image = getClassImage(classe);

  return {
    title: classe.title,
    description,
    alternates: { canonical: `/univers/classes/${classe.id}` },
    openGraph: {
      title: classe.title,
      description,
      type: "profile",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: classe.title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const classe = await getClass(params.id);

  const jsonLd = classe
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Univers", item: `${siteUrl}/univers` },
          { "@type": "ListItem", position: 2, name: classe.title, item: `${siteUrl}/univers/classes/${classe.id}` },
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
      <ClassDetailClient />
    </>
  );
}
