import type { Metadata } from "next";
import CompteClient from "./CompteClient";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Gérez vos informations personnelles et votre compte Seranya.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CompteClient />;
}
