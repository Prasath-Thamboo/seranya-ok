import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers locale-aware de `next/navigation` :
// `usePathname` renvoie le chemin SANS préfixe de locale,
// `Link` / `useRouter` réappliquent le bon préfixe automatiquement.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
