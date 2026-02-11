import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { HealthScoreGridWidget } from "../types";

interface HealthScoreGridRendererProps {
  config: HealthScoreGridWidget;
}

const HealthScoreGridRenderer = ({ config }: HealthScoreGridRendererProps) => {
  const navigate = useNavigate();
  const Icon = config.titleIcon;

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
      <h3 className="text-sm font-medium tracking-wider text-muted-foreground mb-4">
        <Icon className="h-4 w-4 inline mr-1.5 text-primary" />
        {config.title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {config.entries.map((entry) => (
          <div
            key={entry.experimentId}
            className="bg-muted/30 rounded-lg p-3 text-center cursor-pointer hover:bg-muted/40 transition-all"
            onClick={() => navigate(`/research/experiments/${entry.experimentId}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/research/experiments/${entry.experimentId}`);
              }
            }}
            role="link"
            tabIndex={0}
          >
            <p className="text-xs font-medium text-muted-foreground">
              {entry.experimentCode}
            </p>
            <p
              className={cn(
                "text-2xl font-medium tabular-nums mt-1",
                entry.score >= 8
                  ? "text-primary"
                  : entry.score >= 6
                    ? "text-warning"
                    : "text-destructive"
              )}
            >
              {entry.score}/10
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {entry.commonName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthScoreGridRenderer;
