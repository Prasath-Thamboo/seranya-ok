import type { Metadata } from "next";
import EncyclopedieClient from "./EncyclopedieClient";

export const metadata: Metadata = {
  title: "Encyclopédie",
  description:
    "Retrouvez les définitions essentielles du yoga et de la philosophie bouddhiste sur Seranya.",
  alternates: { canonical: "/encyclopedie" },
};

export default function Page() {
  return <EncyclopedieClient />;
}
