// spectralnext/components/FooterSetter.tsx
"use client";

import React, { useEffect } from "react";
import { useFooter } from "@/context/FooterContext";

interface FooterSetterProps {
  footerImage: string;
  children: React.ReactNode;
}

const FooterSetter = ({ footerImage, children }: FooterSetterProps) => {
  const { setFooterImage } = useFooter();

  useEffect(() => {
    setFooterImage(footerImage);
  }, [footerImage, setFooterImage]);

  return <>{children}</>;
};

export default FooterSetter;
