import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte Seranya et rejoignez la communauté.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <RegisterClient />;
}
