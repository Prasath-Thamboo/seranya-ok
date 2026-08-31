"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchPostById, fetchPosts } from "@/lib/queries/PostQueries";
import { fetchCurrentUser, getAccessToken } from "@/lib/queries/AuthQueries";
import { PostModel } from "@/lib/models/PostModels";
import { Skeleton, Image as AntImage } from "antd";
import Badge from "@/components/Badge";
import CommentSection from "@/components/CommentSection";
import SubscriptionLock from "@/components/SubscriptionLock";
import Masonry from "react-masonry-css";
import Link from "next/link";
import Image from "next/image";

const PostDetailPage = () => {
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;

  const [post, setPost] = useState<PostModel | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostModel[]>([]);
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [loadingRelatedPosts, setLoadingRelatedPosts] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isPrivileged, setIsPrivileged] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    if (!getAccessToken()) {
      setLoadingUser(false);
      return;
    }
    fetchCurrentUser()
      .then((user: any) => {
        setIsPrivileged(user?.role === "ADMIN" || user?.role === "EDITOR");
        setIsSubscribed(!!user?.isSubscribed);
      })
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  const hasFullAccess = isPrivileged || isSubscribed;

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const fetchedPost = await fetchPostById(parseInt(id, 10));
          setPost(fetchedPost);
        } catch (error) {
          console.error("Error fetching post:", error);
          setNotFound(true);
        } finally {
          setLoadingPost(false);
        }
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (post) {
        try {
          const fetchedPosts = await fetchPosts();
          setRelatedPosts(fetchedPosts.filter((p) => p.type === post.type && p.id !== post.id));
        } catch (error) {
          console.error("Error fetching related posts:", error);
        } finally {
          setLoadingRelatedPosts(false);
        }
      }
    };
    fetchRelatedPosts();
  }, [post]);

  if (!loadingPost && notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-page px-4 text-center font-sans text-ink">
        <p className="mb-4 font-serif text-2xl">Contenu non disponible.</p>
        <Link href="/posts" className="text-accent underline transition-colors hover:text-accent-hover">
          Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-page font-sans text-ink">
      {/* Bannière image */}
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden bg-sunken">
        {post?.headerImage && (
          <Image src={post.headerImage} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-transparent to-page" />
      </div>

      <div className="relative z-10 mx-auto -mt-24 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-10">
          {/* Colonne gauche */}
          <aside className="lg:w-2/5">
            <div className="mb-6 overflow-hidden rounded-2xl border border-line bg-raised shadow-md">
              {loadingPost ? (
                <Skeleton.Image style={{ width: "100%", height: 260 }} active />
              ) : post?.headerImage ? (
                <Image
                  src={post.headerImage}
                  alt={`${post.title}`}
                  width={768}
                  height={520}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="h-auto w-full object-cover"
                />
              ) : null}
            </div>

            <div className="rounded-2xl border border-line bg-raised p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-lg font-medium text-ink">Articles similaires</h2>
              {loadingRelatedPosts ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : relatedPosts.length > 0 ? (
                <ul className="space-y-3">
                  {relatedPosts.map((relatedPost) => (
                    <li key={relatedPost.id}>
                      <Link
                        href={`/posts/${relatedPost.id}`}
                        className="block text-sm text-ink-soft transition-colors hover:text-accent"
                      >
                        {relatedPost.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-ink-muted">Aucun article similaire.</p>
              )}
            </div>
          </aside>

          {/* Colonne contenu */}
          <div className="mt-8 lg:mt-0 lg:w-3/5">
            {loadingPost ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <article className="mx-auto max-w-2xl">
                <header className="mb-8 text-center lg:text-left">
                  <h1 className="font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl md:text-5xl">
                    {post?.title}
                  </h1>
                  <div className="mt-3 flex justify-center gap-2 lg:justify-start">
                    <Badge role={post?.type || "DEFAULT"} />
                    {isPrivileged && post?.publishedAt && new Date(post.publishedAt) > new Date() && (
                      <Badge type={`Prévu le ${new Date(post.publishedAt).toLocaleDateString("fr-FR")}`} />
                    )}
                  </div>
                  {post?.subtitle && (
                    <p className="mt-4 font-serif text-xl text-ink-soft sm:text-2xl">{post.subtitle}</p>
                  )}
                </header>

                {loadingUser ? (
                  <Skeleton active paragraph={{ rows: 5 }} />
                ) : hasFullAccess ? (
                  <div
                    className="text-base leading-relaxed text-ink-soft [&_a]:text-accent [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-serif [&_h3]:text-ink [&_p]:mb-4"
                    dangerouslySetInnerHTML={{ __html: post?.content || "Contenu non disponible." }}
                  />
                ) : (
                  <div className="relative min-h-[300px]">
                    {post?.intro && (
                      <p className="select-none text-ink-soft blur-[2px]">{post.intro}</p>
                    )}
                    <SubscriptionLock message="L'article complet est réservé aux abonnés" />
                  </div>
                )}

                {post?.gallery && post.gallery.length > 0 && (
                  <div className="mt-12">
                    <h2 className="mb-8 font-serif text-2xl font-medium text-ink">Galerie</h2>
                    <Masonry
                      breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                      className="-ml-4 flex w-auto"
                      columnClassName="pl-4"
                    >
                      {post.gallery.map((imgUrl, index) => (
                        <div key={index} className="relative mb-4">
                          <AntImage
                            src={imgUrl}
                            alt={`${post.title} — image ${index + 1}`}
                            className="w-full rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                            style={{ objectFit: "cover", aspectRatio: "16/9" }}
                          />
                        </div>
                      ))}
                    </Masonry>
                  </div>
                )}
              </article>
            )}
            {post && <CommentSection postId={post.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
