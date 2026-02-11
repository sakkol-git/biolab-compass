// ═══════════════════════════════════════════════════════════════════════════
// CONCLUSION — Section Renderer
// ═══════════════════════════════════════════════════════════════════════════

import { SectionCard } from "@/components/detail/DetailPageShell";
import type { ConclusionSection } from "../types";

interface Props {
  section: ConclusionSection;
}

const ConclusionRenderer = ({ section }: Props) => (
  <SectionCard
    title={section.title}
    icon={section.icon}
    className={section.className}
  >
    <p className="text-sm text-emerald-800 leading-relaxed">{section.text}</p>
  </SectionCard>
);

export default ConclusionRenderer;
