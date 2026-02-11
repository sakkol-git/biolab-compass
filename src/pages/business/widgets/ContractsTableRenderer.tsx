// ═══════════════════════════════════════════════════════════════════════════
// CONTRACTS TABLE WIDGET
// Full data table of all contracts with inline status badges.
// ═══════════════════════════════════════════════════════════════════════════

import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/calculator";
import { contractStatusStyles, statusBadge } from "@/lib/status-styles";
import type { ContractsTableWidget } from "../types";

interface ContractsTableRendererProps {
  config: ContractsTableWidget;
}

const COLUMNS = [
  { label: "Contract", align: "text-left" },
  { label: "Client", align: "text-left" },
  { label: "Species", align: "text-left" },
  { label: "Status", align: "text-left" },
  { label: "Quantity", align: "text-right" },
  { label: "Value", align: "text-right" },
  { label: "Deadline", align: "text-right" },
] as const;

const ContractsTableRenderer = ({ config }: ContractsTableRendererProps) => {
  const navigate = useNavigate();

  const navigateToContract = (contractId: string) => {
    navigate(`/business/contracts/${contractId}`);
  };

  return (
    <div className="bg-card overflow-x-auto rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground">
          {config.title}
        </h3>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                className={cn(
                  "p-3 text-xs font-medium text-muted-foreground",
                  col.align
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {config.contracts.map((contract) => (
            <tr
              key={contract.id}
              className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => navigateToContract(contract.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigateToContract(contract.id);
                }
              }}
              role="link"
              tabIndex={0}
            >
              <td className="p-3 text-sm font-mono font-normal text-foreground">
                {contract.contractCode}
              </td>
              <td className="p-3 text-sm text-foreground">
                {contract.clientName}
              </td>
              <td className="p-3 text-sm text-muted-foreground">
                {contract.commonName}
              </td>
              <td className="p-3">
                <span
                  className={cn(
                    statusBadge(contractStatusStyles, contract.status)
                  )}
                >
                  {contract.status}
                </span>
              </td>
              <td className="p-3 text-sm font-medium tabular-nums text-right">
                {contract.quantityOrdered.toLocaleString()}
              </td>
              <td className="p-3 text-sm font-medium text-primary tabular-nums text-right">
                {formatCurrency(contract.totalValue)}
              </td>
              <td className="p-3 text-sm text-muted-foreground text-right">
                {contract.deliveryDeadline}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsTableRenderer;
