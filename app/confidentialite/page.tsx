import type { Metadata } from "next";
import ConfidentialiteClient from "./ConfidentialiteClient";

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description:
    "Politique de confidentialité de Seranya : données collectées, droits RGPD, Google Analytics et paiements.",
  alternates: { canonical: "/confidentialite" },
};

export default function Page() {
  return <ConfidentialiteClient />;
}
