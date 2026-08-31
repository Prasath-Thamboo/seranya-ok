import React from "react";
import Badge from "./Badge";

interface DividersWithHeadingProps {
  text: string;
  badge?: string;
  customStyle?: string;
  styleVariant?: "default" | "admin";
}

export default function DividersWithHeading({
  text,
  badge,
  customStyle,
  styleVariant = "default",
}: DividersWithHeadingProps) {
  const textStyle =
    styleVariant === "admin"
      ? "text-2xl text-ink font-medium px-4"
      : "text-lg text-ink-soft font-medium";

  return (
    <div className="my-10 flex items-center justify-center">
      <span aria-hidden="true" className="h-px grow rounded bg-line" />
      <span className={`mx-4 flex items-center gap-3 font-serif ${textStyle} ${customStyle || ""}`}>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent/70" />
        {text}
        {badge && (
          <span className="ml-2">
            <Badge type={badge} />
          </span>
        )}
      </span>
      <span aria-hidden="true" className="h-px grow rounded bg-line" />
    </div>
  );
}
