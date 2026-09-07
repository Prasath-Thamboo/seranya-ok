"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LuSearch, LuPlay, LuBookOpen, LuNewspaper, LuLayers } from "react-icons/lu";
import { fetchPosts } from "@/lib/queries/PostQueries";
import { fetchPublishedTutorials } from "@/lib/queries/TutorialQueries";
import { fetchPublishedDefinitions } from "@/lib/queries/DefinitionQueries";
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery";
import { fetchCurrentUser, getAccessToken } from "@/lib/queries/AuthQueries";
import { PostModel } from "@/lib/models/PostModels";
import { TutorialModel } from "@/lib/models/TutorialModels";
import { DefinitionModel } from "@/lib/models/DefinitionModels";
import SubscriptionLock from "@/components/SubscriptionLock";

/* ── Types ── */
type ContentType = "all" | "posts" | "tutorials" | "definitions";

type UnifiedItem =
  | { kind: "post"; data: PostModel }
  | { kind: "tutorial"; data: TutorialModel }
  | { kind: "definition"; data: DefinitionModel };

/* ── Helpers ── */
const getYouTubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([^#&?]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

const FILTERS: { key: ContentType; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "Tout", icon: <LuLayers className="h-4 w-4" /> },
  { key: "posts", label: "Articles", icon: <LuNewspaper className="h-4 w-4" /> },
  { key: "tutorials", label: "Tutoriels", icon: <LuPlay className="h-4 w-4" /> },
  { key: "definitions", label: "Définitions", icon: <LuBookOpen className="h-4 w-4" /> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const CARD =
  "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md";

/* ── Cards ── */
function PostCard({ post }: { post: PostModel }) {
  return (
    <Link href={`/posts/${post.id}`}>
      <motion.div variants={fadeUp} className={CARD}>
        <div className="relative h-44 w-full overflow-hidden bg-sunken">
          {post.headerImage ? (
            <Image
              src={post.headerImage}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 ease-calm group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <LuNewspaper className="h-10 w-10 text-ink-muted" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="mb-2 self-start rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-sans uppercase tracking-[0.14em] text-accent">
            {post.type}
          </span>
          <h3 className="mb-2 font-serif text-lg font-medium text-ink transition-colors group-hover:text-accent line-clamp-2">
            {post.title}
          </h3>
          <p className="flex-grow text-sm leading-relaxed text-ink-soft line-clamp-3">{post.intro}</p>
          <p className="mt-3 text-xs text-ink-muted">
            {new Date(post.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

function TutorialCard({ tutorial, hasFullAccess }: { tutorial: TutorialModel; hasFullAccess: boolean }) {
  const thumb = tutorial.thumbnailUrl ?? (tutorial.videoUrl ? getYouTubeThumbnail(tutorial.videoUrl) : null);

  const inner = (
    <motion.div variants={fadeUp} className={CARD}>
      <div className="relative h-44 w-full overflow-hidden bg-sunken">
        {thumb ? (
          <Image
            src={thumb}
            alt={tutorial.title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-500 ease-calm group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <LuPlay className="h-10 w-10 text-ink-muted" />
          </div>
        )}
        {hasFullAccess ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/10 transition-colors group-hover:bg-ink/0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-raised/90 text-accent shadow-md transition-transform group-hover:scale-110">
              <LuPlay className="ml-0.5 h-4 w-4" />
            </div>
          </div>
        ) : (
          <SubscriptionLock message="Vidéo réservée aux abonnés" minHeight={0} className="rounded-none" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 self-start rounded-full bg-warm-soft px-2.5 py-0.5 text-xs font-sans uppercase tracking-[0.14em] text-warm">
          Tutoriel
        </span>
        <h3 className="mb-2 font-serif text-lg font-medium text-ink transition-colors group-hover:text-accent line-clamp-2">
          {tutorial.title}
        </h3>
        {tutorial.description && (
          <p className="flex-grow text-sm leading-relaxed text-ink-soft line-clamp-3">{tutorial.description}</p>
        )}
        <p className="mt-3 text-xs text-ink-muted">
          {new Date(tutorial.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </motion.div>
  );

  if (!hasFullAccess || !tutorial.videoUrl) return inner;

  return (
    <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}

function DefinitionCard({ def }: { def: DefinitionModel }) {
  return (
    <motion.div variants={fadeUp} className={CARD}>
      <div className="relative flex h-20 items-center bg-accent-soft px-5">
        <span className="select-none font-serif text-5xl font-medium text-accent/30">
          {def.term[0]?.toUpperCase()}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-raised px-2.5 py-0.5 text-xs font-sans uppercase tracking-[0.14em] text-accent">
          {def.category || "Définition"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-serif text-lg font-medium text-ink">{def.term}</h3>
        <p className="flex-grow text-sm leading-relaxed text-ink-soft line-clamp-4">{def.definition}</p>
        <p className="mt-3 text-xs text-ink-muted">
          {new Date(def.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function UniversPage() {
  const locale = useLocale();
  const [backgroundImage, setBackgroundImage] = useState("");
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [tutorials, setTutorials] = useState<TutorialModel[]>([]);
  const [definitions, setDefinitions] = useState<DefinitionModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ContentType>("all");
  const [search, setSearch] = useState("");
  const [hasFullAccess, setHasFullAccess] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      fetchPosts(locale),
      fetchPublishedTutorials(locale),
      fetchPublishedDefinitions(locale),
      fetchRandomBackground(),
    ]).then(([p, t, d, bg]) => {
      if (p.status === "fulfilled") setPosts(p.value);
      if (t.status === "fulfilled") setTutorials(t.value);
      if (d.status === "fulfilled") setDefinitions(d.value);
      if (bg.status === "fulfilled") setBackgroundImage(bg.value);
      setLoading(false);
    });
  }, [locale]);

  useEffect(() => {
    if (!getAccessToken()) return;
    fetchCurrentUser()
      .then((user: any) => setHasFullAccess(user?.role === "ADMIN" || user?.role === "EDITOR" || !!user?.isSubscribed))
      .catch(() => {});
  }, []);

  const items = useMemo<UnifiedItem[]>(() => {
    const q = search.toLowerCase();

    const filteredPosts: UnifiedItem[] = (activeFilter === "all" || activeFilter === "posts")
      ? posts
          .filter((p) => !q || p.title.toLowerCase().includes(q) || p.intro?.toLowerCase().includes(q))
          .map((p) => ({ kind: "post", data: p }))
      : [];

    const filteredTuts: UnifiedItem[] = (activeFilter === "all" || activeFilter === "tutorials")
      ? tutorials
          .filter((t) => !q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
          .map((t) => ({ kind: "tutorial", data: t }))
      : [];

    const filteredDefs: UnifiedItem[] = (activeFilter === "all" || activeFilter === "definitions")
      ? definitions
          .filter((d) => !q || d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q))
          .map((d) => ({ kind: "definition", data: d }))
      : [];

    return [...filteredPosts, ...filteredTuts, ...filteredDefs];
  }, [posts, tutorials, definitions, activeFilter, search]);

  const counts = useMemo(() => ({
    all: posts.length + tutorials.length + definitions.length,
    posts: posts.length,
    tutorials: tutorials.length,
    definitions: definitions.length,
  }), [posts, tutorials, definitions]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-page">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-page font-sans text-ink">

      {/* Bandeau d'image, fondu vers la page */}
      {backgroundImage && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[62vh]">
          <Image src={backgroundImage} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-page" />
        </div>
      )}

      <div className="relative z-10">
        {/* Hero */}
        <section className="flex min-h-[46vh] flex-col items-center justify-center px-6 pb-14 pt-36 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="mb-5 inline-block rounded-full border border-white/40 bg-white/10 px-4 py-1.5 text-xs font-sans uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              Tout le contenu Seranya
            </span>
            <h1 className="mb-4 font-serif text-5xl font-medium leading-tight text-white md:text-6xl text-shadow-sm">
              L&apos;Univers
            </h1>
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/90 text-shadow-sm">
              Articles, tutoriels vidéo et définitions — toute la connaissance Seranya réunie en un seul endroit.
            </p>
          </motion.div>
        </section>

        {/* Filtres + recherche */}
        <div className="sticky top-16 z-20 border-b border-line bg-page/85 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-sans transition-all duration-200 ${
                    activeFilter === f.key
                      ? "bg-accent text-ink-invert shadow-sm"
                      : "border border-line bg-raised text-ink-soft hover:border-accent hover:text-accent"
                  }`}
                >
                  {f.icon}
                  {f.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-xs ${
                    activeFilter === f.key ? "bg-white/25" : "bg-sunken text-ink-muted"
                  }`}>
                    {counts[f.key]}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative ml-auto w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="h-10 w-full rounded-full border border-line bg-raised pl-9 pr-4 text-sm text-ink placeholder-ink-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
              />
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            </div>
          </div>
        </div>

        {/* Grille */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-sans text-lg text-ink-muted">Aucun contenu trouvé.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {items.map((item) => {
                if (item.kind === "post") return <PostCard key={`post-${item.data.id}`} post={item.data} />;
                if (item.kind === "tutorial") return <TutorialCard key={`tuto-${item.data.id}`} tutorial={item.data} hasFullAccess={hasFullAccess} />;
                if (item.kind === "definition") return <DefinitionCard key={`def-${item.data.id}`} def={item.data} />;
              })}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
