// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// Thin shell: hook → config → renderer.
// Zero business logic. Zero layout. Zero formatting.
// ═══════════════════════════════════════════════════════════════════════════

import AppLayout from "@/components/layout/AppLayout";
import {
  DetailSkeleton,
  DetailNotFound,
} from "@/components/detail/DetailPageShell";
import ChemicalDetailRenderer from "./chemical-detail/ChemicalDetailRenderer";
import { useChemicalDetail } from "./chemical-detail/useChemicalDetail";

const ChemicalDetailPage = () => {
  const { state, id, config } = useChemicalDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Chemical"
        id={id}
        backTo="/inventory/chemicals"
        backLabel="All Chemicals"
      />
    );
  }

  return (
    <AppLayout>
      <ChemicalDetailRenderer config={config} />
    </AppLayout>
  );
};

export default ChemicalDetailPage;
