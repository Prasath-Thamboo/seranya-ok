import type { Metadata } from "next";
import EveilClient from "./EveilClient";

export const metadata: Metadata = {
  title: "Éveil — Les bienfaits du yoga",
  description:
    "Pourquoi pratiquer le yoga ? Découvrez tous les bienfaits du yoga pour le corps et l'esprit : souplesse, force, respiration, gestion du stress et sérénité intérieure.",
  alternates: { canonical: "/eveil" },
};

export default function Page() {
  return <EveilClient />;
}
