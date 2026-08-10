"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiOutlineBookOpen, HiOutlineUsers, HiOutlineSparkles } from "react-icons/hi2";
import Counter from "@/components/home/Counter";
import { fetchPosts } from "@/lib/queries/PostQueries";
import { fetchPublishedTutorials } from "@/lib/queries/TutorialQueries";
import { fetchPublishedDefinitions } from "@/lib/queries/DefinitionQueries";
import { getAccessToken } from "@/lib/queries/AuthQueries";

interface StatsCountersProps {
  initialPostCount: number;
  initialTutorialCount: number;
  initialDefinitionCount: number;
}

export default function StatsCounters({
  initialPostCount,
  initialTutorialCount,
  initialDefinitionCount,
}: StatsCountersProps) {
  const [postCount, setPostCount] = useState(initialPostCount);
  const [tutorialCount, setTutorialCount] = useState(initialTutorialCount);
  const [definitionCount, setDefinitionCount] = useState(initialDefinitionCount);

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

  const stats = [
    { icon: <HiOutlineBookOpen className="w-7 h-7" />, label: "Articles de blog", value: postCount, href: "/posts" },
    { icon: <HiOutlineSparkles className="w-7 h-7" />, label: "Tuto", value: tutorialCount, href: "/tutoriels" },
    { icon: <HiOutlineUsers className="w-7 h-7" />, label: "Définitions", value: definitionCount, href: "/encyclopedie" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-gray-800 bg-gray-950 hover:border-green-400/40 transition-colors"
        >
          <div className="text-green-400">{stat.icon}</div>
          <span className="text-5xl font-bold font-iceberg text-white">
            <Counter value={stat.value} />
          </span>
          <span className="text-gray-400 font-kanit uppercase text-xs tracking-widest">{stat.label}</span>
        </Link>
      ))}
    </div>
  );
}
