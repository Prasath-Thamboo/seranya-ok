"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LuBookOpen, LuSparkles, LuLibrary } from "react-icons/lu";
import Counter from "@/components/home/Counter";
import { fetchPosts } from "@/lib/queries/PostQueries";
import { fetchPublishedTutorials } from "@/lib/queries/TutorialQueries";
import { fetchPublishedDefinitions } from "@/lib/queries/DefinitionQueries";
import { getAccessToken } from "@/lib/queries/AuthQueries";

interface StatsCountersProps {
  // null = donnée indisponible (requête échouée) : le compteur n'est pas affiché.
  initialPostCount: number | null;
  initialTutorialCount: number | null;
  initialDefinitionCount: number | null;
}

export default function StatsCounters({
  initialPostCount,
  initialTutorialCount,
  initialDefinitionCount,
}: StatsCountersProps) {
  const [postCount, setPostCount] = useState(initialPostCount);
  const [tutorialCount, setTutorialCount] = useState(initialTutorialCount);
  const [definitionCount, setDefinitionCount] = useState(initialDefinitionCount);
  const t = useTranslations("home.stats");

  useEffect(() => {
    // Le rendu serveur (ISR, page partagée entre visiteurs) ne peut renvoyer que les
    // chiffres publics. Si l'utilisateur est connecté (EDITOR/ADMIN incluant les
    // brouillons/programmés), on recharge les compteurs ici avec son token.
    if (!getAccessToken()) return;

    Promise.allSettled([
      fetchPosts(),
      fetchPublishedTutorials(),
      fetchPublishedDefinitions(),
    ]).then(([posts, tutorials, definitions]) => {
      if (posts.status === "fulfilled") setPostCount(posts.value.length);
      if (tutorials.status === "fulfilled") setTutorialCount(tutorials.value.length);
      if (definitions.status === "fulfilled") setDefinitionCount(definitions.value.length);
    });
  }, []);

  const allStats = [
    { icon: <LuBookOpen className="w-6 h-6" />, label: t("posts"), value: postCount, href: "/posts" },
    { icon: <LuSparkles className="w-6 h-6" />, label: t("tutorials"), value: tutorialCount, href: "/tutoriels" },
    { icon: <LuLibrary className="w-6 h-6" />, label: t("definitions"), value: definitionCount, href: "/encyclopedie" },
  ];
  // Jamais de compteur à 0 ou indisponible : ça donne l'impression d'un site vide.
  const stats = allStats.filter((s) => (s.value ?? 0) > 0);
  if (stats.length === 0) return null;

  const cols = { 1: "md:grid-cols-1 max-w-sm mx-auto", 2: "md:grid-cols-2 max-w-3xl mx-auto", 3: "md:grid-cols-3" }[
    stats.length as 1 | 2 | 3
  ];

  return (
    <div className={`grid grid-cols-1 gap-6 ${cols}`}>
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-line bg-raised shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="text-accent">{stat.icon}</div>
          <span className="text-5xl font-serif font-medium text-ink">
            <Counter value={stat.value ?? 0} />
          </span>
          <span className="text-ink-muted font-sans uppercase text-xs tracking-[0.18em]">{stat.label}</span>
        </Link>
      ))}
    </div>
  );
}
