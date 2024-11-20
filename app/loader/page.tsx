// seranyanext/app/loader/page.tsx

import React from "react";
import Loader from "@/components/Loader"; // Importe ton composant Loader

const LoaderTest = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default LoaderTest;
