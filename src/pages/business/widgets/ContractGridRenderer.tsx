// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT GRID WIDGET
// Renders a titled section of ContractCard components.
// ═══════════════════════════════════════════════════════════════════════════

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ContractCard from "@/components/business/ContractCard";
import { Button } from "@/components/ui/button";
import type { ContractGridWidget } from "../types";

interface ContractGridRendererProps {
  config: ContractGridWidget;
}

const ContractGridRenderer = ({ config }: ContractGridRendererProps) => {
  const navigate = useNavigate();

  return (
    <div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {config.contracts.map((contract) => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </div>
  );
};

export default ContractGridRenderer;
