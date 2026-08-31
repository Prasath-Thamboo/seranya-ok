// seranyanext/components/MiniLoader.tsx

import Image from "next/image";

/** Chargement inline — même respiration douce que <Loader />, en petit. */
export default function MiniLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <Image
        src="/logos/seranyaicon.png"
        alt="Chargement"
        width={44}
        height={44}
        className="[animation:breathe_2.4s_ease-in-out_infinite]"
      />
    </div>
  );
}
