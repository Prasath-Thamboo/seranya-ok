import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez le mot de passe de votre compte Seranya.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ForgotPasswordClient />;
}
