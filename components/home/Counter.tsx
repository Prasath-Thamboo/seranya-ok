"use client";

import CountUp from "react-countup";
import { useReducedMotion } from "framer-motion";

export default function Counter({ value }: { value: number }) {
  // prefers-reduced-motion : on affiche directement la valeur finale, sans décompte.
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{value}</>;
  return <CountUp end={value} duration={2} enableScrollSpy scrollSpyOnce />;
}
