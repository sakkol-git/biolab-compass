// ═══════════════════════════════════════════════════════════════════════════
// GROWTH MILESTONES SECTION RENDERER
// ═══════════════════════════════════════════════════════════════════════════

import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/detail/DetailPageShell";
import type { GrowthMilestonesSection } from "../types";

interface Props {
  section: GrowthMilestonesSection;
}

const GrowthMilestonesSectionRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    {section.milestones.length === 0 ? (
      <p className="text-sm text-muted-foreground italic">
        No milestones recorded.
      </p>
    ) : (
      <div className="relative pl-6 space-y-4">
        {/* Vertical timeline line */}
        <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-border" />
        {section.milestones.map((m, i) => (
          <div key={i} className="relative flex items-start gap-3">
            <div
              className={cn(
                "absolute left-[-21px] top-1 h-3 w-3 border-2",
                i === section.milestones.length - 1
                  ? "bg-primary border-primary"
                  : "bg-card border-border"
              )}
            />
            <div>
              <p className="text-xs font-mono text-muted-foreground">
                {m.date}
              </p>
              <p className="text-sm text-foreground">{m.event}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </SectionCard>
);

export default GrowthMilestonesSectionRenderer;
