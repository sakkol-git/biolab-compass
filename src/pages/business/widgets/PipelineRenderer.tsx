// ═══════════════════════════════════════════════════════════════════════════
// PIPELINE WIDGET
// Contract pipeline visualization with a "View All" navigation link.
// ═══════════════════════════════════════════════════════════════════════════

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ContractPipeline from "@/components/business/ContractPipeline";
import { Button } from "@/components/ui/button";
import type { PipelineWidget } from "../types";

interface PipelineRendererProps {
  config: PipelineWidget;
}

const PipelineRenderer = ({ config }: PipelineRendererProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
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
      <ContractPipeline contracts={config.contracts} />
    </div>
  );
};

export default PipelineRenderer;
