// ═══════════════════════════════════════════════════════════════════════════
// PLANT SAMPLE DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════

import {
    DetailNotFound,
    DetailSkeleton,
} from "@/components/detail/DetailPageShell";
import AppLayout from "@/components/layout/AppLayout";
import SampleDetailRenderer from "./plant-sample-detail/SampleDetailRenderer";
import { useSampleDetail } from "./plant-sample-detail/useSampleDetail";

const PlantSampleDetailPage = () => {
  const { state, id, config } = useSampleDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Plant Sample"
        id={id}
        backTo="/inventory/plant-samples"
        backLabel="All Samples"
      />
    );
  }

  return (
    <AppLayout>
      <SampleDetailRenderer config={config} />
    </AppLayout>
  );
};

export default PlantSampleDetailPage;
