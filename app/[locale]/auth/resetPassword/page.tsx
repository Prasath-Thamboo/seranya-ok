import type { Metadata } from "next";
import ResetPasswordClient from "./ResetPasswordClient";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
  description: "Choisissez un nouveau mot de passe pour votre compte Seranya.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ResetPasswordClient />;
}
