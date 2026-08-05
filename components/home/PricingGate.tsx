"use client";

import { useAuthState } from "@/lib/hooks/useAuthState";

export default function PricingGate({ children }: { children: React.ReactNode }) {
  const { isSubscribed } = useAuthState();

  if (isSubscribed) return null;

  return <>{children}</>;
}
