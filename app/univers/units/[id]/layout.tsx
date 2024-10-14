// spectralnext/app/univers/units/[id]/layout.tsx

import React from "react";
import ClientLayout from "@/components/ClientLayout";
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";

interface UnitsLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const UnitsLayout = async ({ children, params }: UnitsLayoutProps) => {
  const id = parseInt(params.id, 10);
  const unit: UnitModel | null = await fetchUnitById(id);

  console.log("UnitsLayout: unit:", unit);
  console.log("UnitsLayout: footerImage:", unit?.footerImage);

  return (
    <ClientLayout footerImage={unit?.footerImage || "/images/default-footer.jpg"} disableFooter={false}>
      {children}
    </ClientLayout>
  );
};

export default UnitsLayout;
