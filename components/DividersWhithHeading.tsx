import React from "react";
import Badge from "./Badge";

interface DividersWithHeadingProps {
  text: string;
  badge?: string;
  customStyle?: string;
  styleVariant?: 'default' | 'admin';  // Prop pour choisir le style
}

export default function DividersWithHeading({
  text,
  badge,
  customStyle,
  styleVariant = 'default' // Définir 'default' comme valeur par défaut
}: DividersWithHeadingProps) {
  const textStyle = styleVariant === 'admin'
    ? 'text-2xl text-black font-bold px-4' // Style pour la version admin
    : 'text-lg text-white font-medium';    // Style par défaut

  return (
    <>
      {/* Divider: With Heading */}
      <div className="flex items-center justify-center my-8">
        <span aria-hidden="true" className="h-0.5 grow rounded bg-gray-200 dark:bg-gray-700/75" />
        <span className={`mx-3 flex items-center ${textStyle} ${customStyle || 'font-oxanium uppercase'}`}>
          {text}
          {badge && (
            <span className="ml-4">
              <Badge type={badge} />
            </span>
          )}
        </span>
        <span aria-hidden="true" className="h-0.5 grow rounded bg-gray-200 dark:bg-gray-700/75" />
      </div>
      {/* END Divider: With Heading */}
    </>
  );
}
