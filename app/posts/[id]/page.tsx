import type { Metadata } from "next";
import { fetchPostById } from "@/lib/queries/PostQueries";
import PostDetailClient from "./PostDetailClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const stripHtml = (html?: string) => (html ? html.replace(/<[^>]*>/g, "").trim() : "");

async function getPost(id: string) {
  try {
    return await fetchPostById(parseInt(id, 10));
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPost(params.id);

  if (!post) {
    return {
      title: "Article introuvable",
      description: "Cet article n'existe pas ou a été supprimé.",
    };
  }

  const description = stripHtml(post.intro).slice(0, 160) || `Découvrez "${post.title}" sur Seranya.`;
  const image = post.headerImage || post.profileImage;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.id}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: stripHtml(post.intro).slice(0, 160),
        image: post.headerImage ? [post.headerImage] : undefined,
        datePublished: new Date(post.createdAt).toISOString(),
        dateModified: new Date(post.updatedAt).toISOString(),
        mainEntityOfPage: `${siteUrl}/posts/${post.id}`,
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
      <PostDetailClient />
    </>
  );
}
