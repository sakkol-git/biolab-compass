// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// Thin shell: hook → config → renderer.
// Zero business logic. Zero layout. Zero formatting.
// ═══════════════════════════════════════════════════════════════════════════

import AppLayout from "@/core/layouts/AppLayout";
import {
    DetailNotFound,
    DetailSkeleton,
} from "@/shared/components/detail/DetailPageShell";
import ExperimentFormDialog from "../components/ExperimentFormDialog";
import ExperimentDetailRenderer from "./experiment-detail/ExperimentDetailRenderer";
import { useExperimentDetail } from "./experiment-detail/useExperimentDetail";
import { useExperimentsView } from "./useExperimentsView";

const ExperimentDetail = () => {
  const detail = useExperimentDetail();
  const experimentsView = useExperimentsView();

  if (detail.state === "loading") return <DetailSkeleton />;

  if (detail.state === "not-found" || !detail.config) {
    return (
      <DetailNotFound
        category="Experiment"
        id={detail.id}
        backTo="/research/experiments"
        backLabel="Experiments"
      />
    );
  }

  const config = {
    ...detail.config,
    actions: detail.config.actions.map((a) =>
      a.label === "Edit"
        ? { ...a, onClick: () => experimentsView.openEditForm(detail.rawData) }
        : a,
    ),
  };

  return (
    <AppLayout>
      <ExperimentDetailRenderer config={config} />
      <ExperimentFormDialog view={experimentsView} />
    </AppLayout>
  );
};

export default ExperimentDetail;
