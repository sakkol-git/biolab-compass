// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL PAGE — Composition Root
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
import ExperimentDetailRenderer from "./experiment-detail/ExperimentDetailRenderer";
import { useExperimentDetail } from "./experiment-detail/useExperimentDetail";

const ExperimentDetail = () => {
  const { state, id, config } = useExperimentDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Experiment"
        id={id}
        backTo="/research/experiments"
        backLabel="Experiments"
      />
    );
  }

  return (
    <AppLayout>
      <ExperimentDetailRenderer config={config} />
    </AppLayout>
  );
};

export default ExperimentDetail;
