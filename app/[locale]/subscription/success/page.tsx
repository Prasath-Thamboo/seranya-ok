import type { Metadata } from "next";
import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "Abonnement confirmé",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SuccessClient />;
}
