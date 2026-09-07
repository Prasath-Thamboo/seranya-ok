import type { Metadata } from "next";
import UniversClient from "./UniversClient";

export const metadata: Metadata = {
  title: "L'Univers",
  description:
    "Articles, tutoriels vidéo et définitions — toute la connaissance Seranya réunie en un seul endroit.",
  alternates: { canonical: "/univers" },
};

export default function Page() {
  return <UniversClient />;
}
