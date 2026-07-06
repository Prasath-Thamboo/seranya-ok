import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Un problème technique, une question sur l'univers Seranya, ou une idée à partager ? Contactez-nous.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return <ContactClient />;
}
