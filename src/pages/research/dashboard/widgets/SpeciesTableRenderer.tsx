import type { SpeciesTableWidget } from "../types";

interface SpeciesTableRendererProps {
  config: SpeciesTableWidget;
}

const COLUMNS = [
  "Species",
  "Avg Mult.",
  "Best Mult.",
  "Avg Survival",
  "Cycle (wks)",
  "Experiments",
  "Methods",
] as const;

const SpeciesTableRenderer = ({ config }: SpeciesTableRendererProps) => (
  <div className="bg-card rounded-xl overflow-x-auto border border-border shadow-sm">
    <div className="p-5 border-b border-border">
      <h3 className="text-sm font-medium tracking-wider text-muted-foreground">
        {config.title}
      </h3>
    </div>
    <table className="w-full">
      <thead>
        <tr className="border-b border-border bg-muted/30">
          {COLUMNS.map((col) => (
            <th
              key={col}
              className={`p-3 text-xs font-medium text-muted-foreground ${
                col === "Species" || col === "Methods" ? "text-left" : "text-right"
              }`}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {config.profiles.map((sp) => (
          <tr
            key={sp.speciesId}
            className="border-b border-border hover:bg-muted/20 transition-colors"
          >
            <td className="p-3">
              <p className="text-sm font-medium text-foreground">{sp.commonName}</p>
              <p className="text-xs text-muted-foreground italic">{sp.speciesName}</p>
            </td>
            <td className="p-3 text-sm font-medium text-primary tabular-nums text-right">
              {sp.avgMultiplicationRate}×
            </td>
            <td className="p-3 text-sm font-medium tabular-nums text-right">
              {sp.bestMultiplicationRate}×
            </td>
            <td className="p-3 text-sm font-medium tabular-nums text-right">
              {sp.avgSurvivalRate}%
            </td>
            <td className="p-3 text-sm font-medium tabular-nums text-right">
              {sp.avgCycleDurationWeeks}
            </td>
            <td className="p-3 text-sm font-medium tabular-nums text-right">
              {sp.completedExperiments}/{sp.totalExperiments}
            </td>
            <td className="p-3">
              <div className="flex flex-wrap gap-1">
                {sp.propagationMethods.map((m) => (
                  <span
                    key={m}
                    className="text-xs font-medium px-1.5 py-0.5 bg-muted text-muted-foreground rounded-lg"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default SpeciesTableRenderer;
