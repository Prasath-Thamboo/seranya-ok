import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Seranya.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LoginClient />;
}
