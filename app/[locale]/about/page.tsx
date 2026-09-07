import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Seranya est un espace de paix numérique dédié au yoga, à la méditation et à la philosophie bouddhiste.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <AboutClient />;
}
