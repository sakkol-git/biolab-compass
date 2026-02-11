// ═══════════════════════════════════════════════════════════════════════════
// GROWTH CURVE — Section Renderer
// ═══════════════════════════════════════════════════════════════════════════

import { TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/detail/DetailPageShell";
import GrowthChart from "@/components/research/GrowthChart";
import type { GrowthCurveSection } from "../types";

interface Props {
  section: GrowthCurveSection;
}

const GrowthCurveRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    {section.logs.length > 0 ? (
      <GrowthChart logs={section.logs} title="Growth Curve" />
    ) : (
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg border-border">
        <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          No growth data yet
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Add growth logs to visualize the growth curve chart and track survival
          rates.
        </p>
      </div>
    )}
  </SectionCard>
);

export default GrowthCurveRenderer;
