import { cn } from "@/lib/utils";
import { statusBadge, growthStageStyles } from "@/lib/status-styles";
import type { GrowthStageWidget } from "../types";

interface GrowthStageRendererProps {
  config: GrowthStageWidget;
}

const GrowthStageRenderer = ({ config }: GrowthStageRendererProps) => (
  <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
    <h3 className="text-sm font-medium text-muted-foreground mb-4">
      {config.title}
    </h3>
    <div className="space-y-2">
      {config.stages.map(({ stage, count }) => (
        <div key={stage} className="flex items-center justify-between">
          <span className={cn(statusBadge(growthStageStyles, stage))}>{stage}</span>
          <span className="text-sm font-medium tabular-nums text-foreground">{count}</span>
        </div>
      ))}
    </div>
  </div>
);

export default GrowthStageRenderer;
