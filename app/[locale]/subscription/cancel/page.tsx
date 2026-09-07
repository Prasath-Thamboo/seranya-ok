import type { Metadata } from "next";
import CancelClient from "./CancelClient";

export const metadata: Metadata = {
  title: "Paiement annulé",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CancelClient />;
}
