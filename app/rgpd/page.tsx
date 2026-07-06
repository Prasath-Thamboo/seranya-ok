import type { Metadata } from "next";
import RgpdClient from "./RgpdClient";

export const metadata: Metadata = {
  title: "Exercer vos droits RGPD",
  description:
    "Demandez l'accès, la rectification, la suppression, la portabilité de vos données ou opposez-vous à leur traitement.",
  alternates: { canonical: "/rgpd" },
};

export default function Page() {
  return <RgpdClient />;
}
