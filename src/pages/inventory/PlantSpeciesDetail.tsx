// ═══════════════════════════════════════════════════════════════════════════
// PLANT SPECIES DETAIL PAGE — Composition Root
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
import SpeciesDetailRenderer from "./plant-species-detail/SpeciesDetailRenderer";
import { useSpeciesDetail } from "./plant-species-detail/useSpeciesDetail";

const PlantSpeciesDetailPage = () => {
  const { state, id, config } = useSpeciesDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Plant Species"
        id={id}
        backTo="/inventory/plant-species"
        backLabel="All Species"
      />
    );
  }

  return (
    <AppLayout>
      <SpeciesDetailRenderer config={config} />
    </AppLayout>
  );
};

export default PlantSpeciesDetailPage;
