import Badge from "./Badge";

interface DividersWithHeadingProps {
  text: string;
  badge?: string;
  customStyle?: string;
}

export default function DividersWithHeading({ text, badge, customStyle }: DividersWithHeadingProps) {
  return (
    <>
      {/* Divider: With Heading */}
      <div className="flex items-center justify-center my-8">
        <span aria-hidden="true" className="h-0.5 grow rounded bg-gray-200 dark:bg-gray-700/75" />
        <span className={`mx-3 flex items-center ${customStyle || "text-lg text-white font-medium font-oxanium uppercase"}`}>
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
