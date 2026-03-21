import type { TopSpeciesWidget } from "../types";

interface TopSpeciesRendererProps {
  config: TopSpeciesWidget;
}

const TopSpeciesRenderer = ({ config }: TopSpeciesRendererProps) => (
  <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
    <h3 className="text-sm font-medium tracking-wider text-muted-foreground mb-4">
      {config.title}
    </h3>
    <div className="space-y-3">
      {config.species.map((sp, i) => (
        <div
          key={sp.speciesId}
          className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground w-4">#{i + 1}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{sp.commonName}</p>
              <p className="text-xs text-muted-foreground italic">{sp.speciesName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-primary tabular-nums">
              {sp.avgMultiplicationRate}×
            </p>
            <p className="text-xs text-muted-foreground">
              {sp.avgSurvivalRate}% survival
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopSpeciesRenderer;
