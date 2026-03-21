/* ═══════════════════════════════════════════════════════════════════════════
 * ContractGrid — Card-based grid view for contracts with hover actions.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ContractCard from "@/features/business/components/ContractCard";
import { mapContract } from "@/shared/lib/api-mappers";
import type { ContractApi } from "@/shared/types";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ContractGridProps {
  contracts: ContractApi[];
  onEdit: (c: ContractApi) => void;
  onDelete: (c: ContractApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ContractGrid = ({ contracts, onEdit, onDelete }: ContractGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
    {contracts.map((c) => (
      <div key={c.id} className="relative group">
        <ContractCard contract={mapContract(c)} />
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-card/80 hover:bg-muted/40 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(c);
            }}
            aria-label={`Edit contract ${c.contract_code}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-card/80 hover:bg-destructive/10 text-destructive rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(c);
            }}
            aria-label={`Delete contract ${c.contract_code}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

export default ContractGrid;
