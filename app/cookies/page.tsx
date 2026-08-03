import type { Metadata } from "next";
import CookiesClient from "./CookiesClient";

export const metadata: Metadata = {
  title: "Politique de Cookies",
  description:
    "Politique de cookies de Seranya : liste des cookies utilisés, finalités, durées de conservation et gestion du consentement.",
  alternates: { canonical: "/cookies" },
};

export default function Page() {
  return <CookiesClient />;
}
