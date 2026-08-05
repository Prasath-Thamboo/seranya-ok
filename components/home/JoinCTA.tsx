"use client";

import Link from "next/link";
import { useAuthState } from "@/lib/hooks/useAuthState";

export default function JoinCTA() {
  const { isLoggedIn } = useAuthState();

  if (isLoggedIn) return null;

  return (
    <Link
      href="/auth/register"
      className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/40 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:border-green-400 hover:text-green-400 transition-all duration-200 backdrop-blur-sm"
    >
      Rejoindre
    </Link>
  );
}
