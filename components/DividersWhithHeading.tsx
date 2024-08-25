interface DividersWithHeadingProps {
  text: string;
}

export default function DividersWithHeading({ text }: DividersWithHeadingProps) {
  return (
    <>
      {/* Divider: With Heading */}
      <h3 className="my-8 flex items-center">
        <span
          aria-hidden="true"
          className="h-0.5 grow rounded bg-gray-200 dark:bg-gray-700/75"
        />
        <span className="mx-3 text-lg text-white font-medium font-oxanium uppercase">{text}</span>
        <span
          aria-hidden="true"
          className="h-0.5 grow rounded bg-gray-200 dark:bg-gray-700/75"
        />
      </h3>
      {/* END Divider: With Heading */}
    </>
  );
}
