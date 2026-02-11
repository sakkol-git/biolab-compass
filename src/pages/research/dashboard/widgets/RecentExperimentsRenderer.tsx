import { useNavigate } from "react-router-dom";
import { FlaskConical, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { experimentStatusStyles, statusBadge } from "@/lib/status-styles";
import type { RecentExperimentsWidget } from "../types";

interface RecentExperimentsRendererProps {
  config: RecentExperimentsWidget;
}

const RecentExperimentsRenderer = ({ config }: RecentExperimentsRendererProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium tracking-wider text-muted-foreground">
          {config.title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => navigate(config.navigateTo)}
        >
          View All <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-3">
        {config.experiments.map((exp) => (
          <div
            key={exp.id}
            onClick={() => navigate(`/research/experiments/${exp.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/research/experiments/${exp.id}`);
              }
            }}
            role="link"
            tabIndex={0}
            className="flex items-center gap-4 p-3 hover:bg-muted/30 transition-all cursor-pointer rounded-lg"
          >
            <div className="shrink-0 w-10 h-10 bg-muted flex items-center justify-center">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{exp.title}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="font-mono font-medium">{exp.experimentCode}</span>
                <span>{exp.commonName}</span>
                <span>{exp.propagationMethod}</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium tabular-nums">{exp.currentCount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">seedlings</p>
              </div>
              <span className={cn(statusBadge(experimentStatusStyles, exp.status))}>
                {exp.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExperimentsRenderer;
