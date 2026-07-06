import type { Metadata } from "next";
import ConfirmClient from "./ConfirmClient";

export const metadata: Metadata = {
  title: "Confirmation de compte",
  description: "Confirmez votre compte Seranya.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <ConfirmClient />;
}
