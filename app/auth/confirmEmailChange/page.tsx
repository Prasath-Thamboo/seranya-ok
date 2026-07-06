import type { Metadata } from "next";
import ConfirmEmailChangeClient from "./ConfirmEmailChangeClient";

export const metadata: Metadata = {
  title: "Confirmation de changement d'email",
  description: "Confirmez le changement d'adresse email de votre compte Seranya.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ConfirmEmailChangeClient />;
}
