// seranyanext/components/MiniLoader.tsx

import Image from 'next/image';

export default function MiniLoader() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse">
        <Image
          src="/logos/seranyaicon.png" // Assure-toi que le chemin est correct
          alt="Loading..."
          width={50}
          height={50}
        />
      </div>
    </div>
  );
}
