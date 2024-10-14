// spectralnext/context/FooterContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FooterContextProps {
  footerImage: string;
  setFooterImage: (image: string) => void;
}

const FooterContext = createContext<FooterContextProps | undefined>(undefined);

export const FooterProvider = ({ children }: { children: ReactNode }) => {
  const [footerImage, setFooterImage] = useState<string>('/images/default-footer.jpg');

  return (
    <FooterContext.Provider value={{ footerImage, setFooterImage }}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};
