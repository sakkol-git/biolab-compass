import { cn } from "@/lib/utils";
import type { Contract, ContractStatus } from "@/types/business";

const pipelineStages: { status: ContractStatus; label: string; color: string }[] = [
  { status: "Draft", label: "Draft", color: "bg-muted" },
  { status: "Sent", label: "Sent", color: "bg-blue-100" },
  { status: "Signed", label: "Signed", color: "bg-violet-100" },
  { status: "In Production", label: "Production", color: "bg-muted" },
  { status: "Ready", label: "Ready", color: "bg-amber-100" },
  { status: "Delivered", label: "Delivered", color: "bg-emerald-100" },
];

interface ContractPipelineProps {
  contracts: Contract[];
  className?: string;
}

const ContractPipeline = ({ contracts, className }: ContractPipelineProps) => {
  const grouped = pipelineStages.map((stage) => ({
    ...stage,
    contracts: contracts.filter((c) => c.status === stage.status),
  }));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {grouped.map((stage) => (
          <div key={stage.status} className="flex-1 min-w-[120px]">
            <div className={cn(
              "p-3 text-center bg-muted/30 rounded-lg",
              stage.color
            )}>
              <p className="text-xs font-medium tracking-wide text-foreground">{stage.label}</p>
              <p className="text-2xl font-medium text-foreground tabular-nums mt-1">{stage.contracts.length}</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                ${stage.contracts.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractPipeline;
