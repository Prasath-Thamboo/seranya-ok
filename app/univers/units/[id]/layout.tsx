// spectralnext/app/univers/units/[id]/layout.tsx

import ClientLayout from "@/components/ClientLayout";
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import React from "react";

interface UnitsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const UnitsLayout = async ({ children, params }: UnitsLayoutProps) => {
  const id = parseInt(params.id, 10);
  const unit: UnitModel | null = await fetchUnitById(id);

  return (
    <ClientLayout footerImage={unit?.footerImage || "/images/default-footer.jpg"} disableFooter={false}>
      {children}
    </ClientLayout>
  );
};

export default UnitsLayout;
