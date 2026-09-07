import type { Metadata } from "next";
import TutorielsClient from "./TutorielsClient";

export const metadata: Metadata = {
  title: "Tutoriels",
  description:
    "Découvrez nos vidéos pour pratiquer le yoga et la méditation bouddhiste avec Seranya.",
  alternates: { canonical: "/tutoriels" },
};

export default function Page() {
  return <TutorielsClient />;
}
