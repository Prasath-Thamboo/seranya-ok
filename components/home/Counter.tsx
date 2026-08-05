"use client";

import CountUp from "react-countup";

export default function Counter({ value }: { value: number }) {
  return <CountUp end={value} duration={2} enableScrollSpy scrollSpyOnce />;
}
