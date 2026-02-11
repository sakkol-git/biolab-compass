// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAILS — Section Renderer
// ═══════════════════════════════════════════════════════════════════════════

import { SectionCard, InfoRow } from "@/components/detail/DetailPageShell";
import type { ExperimentDetailsSection } from "../types";

interface Props {
  section: ExperimentDetailsSection;
}

const ExperimentDetailsRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <div className="space-y-4">
      {section.fields.map((f) => (
        <InfoRow key={f.label} label={f.label} value={f.value} />
      ))}
    </div>
  </SectionCard>
);

export default ExperimentDetailsRenderer;
