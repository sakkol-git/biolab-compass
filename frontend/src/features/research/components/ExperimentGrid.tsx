/* ═══════════════════════════════════════════════════════════════════════════
 * ExperimentGrid — Card-based grid view for experiments.
 * ═══════════════════════════════════════════════════════════════════════════ */

import ExperimentCard from "@/features/research/components/ExperimentCard";
import type { ExperimentApi } from "@/shared/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ExperimentGridProps {
  experiments: ExperimentApi[];
  onEdit: (exp: ExperimentApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ExperimentGrid = ({ experiments, onEdit }: ExperimentGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
    {experiments.map((exp) => (
      <ExperimentCard key={exp.id} experiment={exp} onEdit={onEdit} />
    ))}
  </div>
);

export default ExperimentGrid;
