"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SearchOutlined } from "@ant-design/icons";
import { FaPlay, FaBookOpen, FaNewspaper, FaLayerGroup } from "react-icons/fa";
import { fetchPosts } from "@/lib/queries/PostQueries";
import { fetchPublishedTutorials } from "@/lib/queries/TutorialQueries";
import { fetchPublishedDefinitions } from "@/lib/queries/DefinitionQueries";
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery";
import { PostModel } from "@/lib/models/PostModels";
import { TutorialModel } from "@/lib/models/TutorialModels";
import { DefinitionModel } from "@/lib/models/DefinitionModels";

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
  { key: "all",         label: "Tout",        icon: <FaLayerGroup className="w-4 h-4" /> },
  { key: "posts",       label: "Articles",    icon: <FaNewspaper  className="w-4 h-4" /> },
  { key: "tutorials",   label: "Tutoriels",   icon: <FaPlay       className="w-4 h-4" /> },
  { key: "definitions", label: "Définitions", icon: <FaBookOpen   className="w-4 h-4" /> },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ── Cards ── */
function PostCard({ post }: { post: PostModel }) {
  return (
    <Link href={`/posts/${post.id}`}>
      <motion.div
        variants={fadeUp}
        className="group flex flex-col bg-black/60 border border-gray-700 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 h-full"
      >
        <div className="relative w-full h-44 overflow-hidden">
          {post.headerImage ? (
            <Image
              src={post.headerImage}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <FaNewspaper className="w-10 h-10 text-gray-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-green-500/80 text-white text-xs font-iceberg uppercase tracking-widest rounded">
            {post.type}
          </span>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-white font-iceberg uppercase text-base mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-400 font-kanit text-sm flex-grow line-clamp-3">{post.intro}</p>
          <p className="text-gray-600 font-kanit text-xs mt-3">
            {new Date(post.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

function TutorialCard({ tutorial }: { tutorial: TutorialModel }) {
  const thumb = getYouTubeThumbnail(tutorial.videoUrl);
  return (
    <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer">
      <motion.div
        variants={fadeUp}
        className="group flex flex-col bg-black/60 border border-gray-700 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 h-full"
      >
        <div className="relative w-full h-44 overflow-hidden">
          {thumb ? (
            <Image
              src={thumb}
              alt={tutorial.title}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <FaPlay className="w-10 h-10 text-gray-700" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-green-500/80 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaPlay className="w-4 h-4 text-white ml-1" />
            </div>
          </div>
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-red-600/80 text-white text-xs font-iceberg uppercase tracking-widest rounded">
            Tutoriel
          </span>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-white font-iceberg uppercase text-base mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
            {tutorial.title}
          </h3>
          {tutorial.description && (
            <p className="text-gray-400 font-kanit text-sm flex-grow line-clamp-3">{tutorial.description}</p>
          )}
          <p className="text-gray-600 font-kanit text-xs mt-3">
            {new Date(tutorial.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      </motion.div>
    </a>
  );
}

function DefinitionCard({ def }: { def: DefinitionModel }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col bg-black/60 border border-gray-700 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 h-full"
    >
      <div className="relative w-full h-20 bg-gradient-to-r from-green-950/60 to-black/60 flex items-center px-5">
        <span className="text-5xl font-iceberg text-green-500/30 font-bold select-none">
          {def.term[0]?.toUpperCase()}
        </span>
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-iceberg uppercase tracking-widest rounded">
          {def.category || "Définition"}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-white font-iceberg uppercase text-base mb-2">{def.term}</h3>
        <p className="text-gray-400 font-kanit text-sm flex-grow line-clamp-4">{def.definition}</p>
        <p className="text-gray-600 font-kanit text-xs mt-3">
          {new Date(def.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function UniversPage() {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [tutorials, setTutorials] = useState<TutorialModel[]>([]);
  const [definitions, setDefinitions] = useState<DefinitionModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ContentType>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.allSettled([
      fetchPosts(),
      fetchPublishedTutorials(),
      fetchPublishedDefinitions(),
      fetchRandomBackground(),
    ]).then(([p, t, d, bg]) => {
      if (p.status === "fulfilled") setPosts(p.value);
      if (t.status === "fulfilled") setTutorials(t.value);
      if (d.status === "fulfilled") setDefinitions(d.value);
      if (bg.status === "fulfilled") setBackgroundImage(bg.value);
      setLoading(false);
    });
  }, []);

  const items = useMemo<UnifiedItem[]>(() => {
    const q = search.toLowerCase();

    const filteredPosts: UnifiedItem[] = (activeFilter === "all" || activeFilter === "posts")
      ? posts
          .filter((p) =>
            !q || p.title.toLowerCase().includes(q) || p.intro?.toLowerCase().includes(q)
          )
          .map((p) => ({ kind: "post", data: p }))
      : [];

    const filteredTuts: UnifiedItem[] = (activeFilter === "all" || activeFilter === "tutorials")
      ? tutorials
          .filter((t) =>
            !q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
          )
          .map((t) => ({ kind: "tutorial", data: t }))
      : [];

    const filteredDefs: UnifiedItem[] = (activeFilter === "all" || activeFilter === "definitions")
      ? definitions
          .filter((d) =>
            !q || d.term.toLowerCase().includes(q) || d.definition.toLowerCase().includes(q)
          )
          .map((d) => ({ kind: "definition", data: d }))
      : [];

    return [...filteredPosts, ...filteredTuts, ...filteredDefs];
  }, [posts, tutorials, definitions, activeFilter, search]);

  const counts = useMemo(() => ({
    all:         posts.length + tutorials.length + definitions.length,
    posts:       posts.length,
    tutorials:   tutorials.length,
    definitions: definitions.length,
  }), [posts, tutorials, definitions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen text-white font-kanit">

      {/* Fond fixe */}
      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <img
            src={backgroundImage}
            alt="Background"
            style={{ objectFit: "cover", width: "100%", height: "100%", position: "fixed" }}
            className="brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        </div>
      )}

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center justify-center min-h-[45vh] text-center px-6 pt-32 pb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block px-4 py-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-iceberg uppercase tracking-widest rounded-full mb-5">
              Tout le contenu Seranya
            </span>
            <h1 className="text-5xl md:text-6xl font-iceberg uppercase tracking-wide text-white mb-4 leading-tight">
              L&apos;Univers
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
              Articles, tutoriels vidéo et définitions — toute la connaissance Seranya réunie en un seul endroit.
            </p>
          </motion.div>
        </section>

        {/* ── Filtres + Recherche ── */}
        <div className="sticky top-16 z-20 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">

            {/* Tabs */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-iceberg uppercase tracking-widest transition-all duration-200 ${
                    activeFilter === f.key
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-gray-700"
                  }`}
                >
                  {f.icon}
                  {f.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-kanit ${
                    activeFilter === f.key ? "bg-white/20" : "bg-gray-700"
                  }`}>
                    {counts[f.key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Recherche */}
            <div className="relative ml-auto w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full h-10 pl-9 pr-4 rounded-lg bg-white/5 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
              <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        {/* ── Grille de contenu ── */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 font-kanit text-lg">Aucun contenu trouvé.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {items.map((item, i) => {
                if (item.kind === "post")       return <PostCard       key={`post-${item.data.id}`}    post={item.data} />;
                if (item.kind === "tutorial")   return <TutorialCard   key={`tuto-${item.data.id}`}    tutorial={item.data} />;
                if (item.kind === "definition") return <DefinitionCard key={`def-${item.data.id}`}     def={item.data} />;
              })}
            </motion.div>
          )}
        </section>

      </div>
    </div>
  );
}
