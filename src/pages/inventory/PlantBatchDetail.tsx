// ═══════════════════════════════════════════════════════════════════════════
// PLANT BATCH DETAIL PAGE — Composition Root
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
import BatchDetailRenderer from "./plant-batch-detail/BatchDetailRenderer";
import { useBatchDetail } from "./plant-batch-detail/useBatchDetail";

const PlantBatchDetailPage = () => {
  const { state, id, config } = useBatchDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Plant Batch"
        id={id}
        backTo="/inventory/plant-batches"
        backLabel="All Batches"
      />
    );
  }

  return (
    <AppLayout>
      <BatchDetailRenderer config={config} />
    </AppLayout>
  );
};

export default PlantBatchDetailPage;
