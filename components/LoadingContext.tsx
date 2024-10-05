// spectralnext/components/LoadingContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Définition des types pour le contexte
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Création du contexte avec des valeurs par défaut
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Fournisseur du contexte
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook pour accéder au contexte de chargement
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading doit être utilisé dans un LoadingProvider");
  }
  return context;
};
