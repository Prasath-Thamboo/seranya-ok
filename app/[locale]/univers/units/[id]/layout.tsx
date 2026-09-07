// Seranyanext/app/univers/units/[id]/layout.tsx

import FooterSetter from "@/components/FooterSetter"; // Importez FooterSetter
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

  if (!unit) {
    return <div>Unité non trouvée</div>;
  }

  return (
    <FooterSetter footerImage={unit.footerImage || "/images/default-footer.jpg"}>
      {children}
    </FooterSetter>
  );
};

export default UnitsLayout;
