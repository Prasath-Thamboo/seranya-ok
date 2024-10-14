// spectralnext/app/univers/units/[id]/layout.tsx

"use client";

import React, { useEffect, useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import { useParams } from "next/navigation";

interface UnitsLayoutProps {
  children: React.ReactNode;
}

const UnitsLayout: React.FC<UnitsLayoutProps> = ({ children }) => {
  const params = useParams();
  const id = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : null;

  const [unit, setUnit] = useState<UnitModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const fetchedUnit = await fetchUnitById(parseInt(id, 10));
          if (fetchedUnit) {
            setUnit(fetchedUnit);
          }
        } catch (error) {
          console.error("Error fetching unit in layout:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return null; // Ou afficher un loader spécifique
  }

  return (
    <ClientLayout footerImage={unit?.footerImage || undefined} disableFooter={false}>
      {children}
    </ClientLayout>
  );
};

export default UnitsLayout;
