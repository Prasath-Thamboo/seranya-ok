import type { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "Abonnement",
  description:
    "Accédez à l'intégralité du contenu Seranya, devenez éditeur actif et rejoignez une communauté passionnée.",
  alternates: { canonical: "/subscription" },
};

export default function Page() {
  return <SubscriptionClient />;
}
