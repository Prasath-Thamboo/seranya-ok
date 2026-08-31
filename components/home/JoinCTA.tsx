"use client";

import Link from "next/link";
import { useAuthState } from "@/lib/hooks/useAuthState";

export default function JoinCTA() {
  const { isLoggedIn } = useAuthState();

  if (isLoggedIn) return null;

  return (
    <Link
      href="/auth/register"
      className="inline-flex items-center gap-2 rounded-full border border-white/60 px-8 py-3.5 text-sm font-sans text-white backdrop-blur-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-white/10"
    >
      Rejoindre
    </Link>
  );
}
