// ═══════════════════════════════════════════════════════════════════════════
// OBJECTIVE — Section Renderer
// ═══════════════════════════════════════════════════════════════════════════

import { SectionCard } from "@/components/detail/DetailPageShell";
import type { ObjectiveSection } from "../types";

interface Props {
  section: ObjectiveSection;
}

const ObjectiveRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <p className="text-sm text-foreground leading-relaxed">{section.text}</p>
  </SectionCard>
);

export default ObjectiveRenderer;
