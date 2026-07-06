import type { Metadata } from "next";
import MentionsClient from "./MentionsClient";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: "Mentions légales du site Seranya : éditeur, hébergement, propriété intellectuelle et contact.",
  alternates: { canonical: "/mentions" },
};

export default function Page() {
  return <MentionsClient />;
}
