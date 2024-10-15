// spectralnext/context/ColorContext.tsx

import React, { createContext, useState, ReactNode } from "react";

interface ColorContextType {
  color: string;
  setColor: (color: string) => void;
}

export const ColorContext = createContext<ColorContextType>({
  color: "#008080", // Couleur par défaut (teal)
  setColor: () => {},
});

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState<string>("#008080"); // Teal par défaut

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
};
