// ═══════════════════════════════════════════════════════════════════════════
// PLANT VARIETY DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════

import {
    DetailNotFound,
    DetailSkeleton,
} from "@/components/detail/DetailPageShell";
import AppLayout from "@/components/layout/AppLayout";
import VarietyDetailRenderer from "./plant-variety-detail/VarietyDetailRenderer";
import { useVarietyDetail } from "./plant-variety-detail/useVarietyDetail";

const PlantVarietyDetailPage = () => {
  const { state, id, config } = useVarietyDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Plant Variety"
        id={id}
        backTo="/inventory/plant-varieties"
        backLabel="All Varieties"
      />
    );
  }

  return (
    <AppLayout>
      <VarietyDetailRenderer config={config} />
    </AppLayout>
  );
};

export default PlantVarietyDetailPage;
