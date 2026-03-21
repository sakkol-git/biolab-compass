/* ═══════════════════════════════════════════════════════════════════════════
 * ContractTable — Table view for contracts with progress bar.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/shared/lib/calculator";
import { contractStatusStyles, statusBadge } from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ContractApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ContractTableProps {
  contracts: ContractApi[];
  onNavigate: (id: number) => void;
  onEdit: (c: ContractApi) => void;
  onDelete: (c: ContractApi) => void;
}

// ─── Table ─────────────────────────────────────────────────────────────────

const ContractTable = ({
  contracts,
  onNavigate,
  onEdit,
  onDelete,
}: ContractTableProps) => (
  <div className="overflow-hidden rounded-xl border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Code</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Species</TableHead>
          <TableHead className="text-center">Qty Ordered</TableHead>
          <TableHead className="text-center">Delivered</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-center">Progress</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead className="w-20"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((c) => (
          <ContractTableRow
            key={c.id}
            contract={c}
            onNavigate={onNavigate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

// ─── Table Row ─────────────────────────────────────────────────────────────

const ContractTableRow = ({
  contract: c,
  onNavigate,
  onEdit,
  onDelete,
}: {
  contract: ContractApi;
  onNavigate: (id: number) => void;
  onEdit: (c: ContractApi) => void;
  onDelete: (c: ContractApi) => void;
}) => (
  <TableRow
    className="cursor-pointer hover:bg-muted/50"
    onClick={() => onNavigate(c.id)}
  >
    <TableCell className="font-mono text-xs font-normal">
      {c.contract_code}
    </TableCell>
    <TableCell className="font-medium">{c.client.company_name}</TableCell>
    <TableCell className="text-muted-foreground">{c.common_name}</TableCell>
    <TableCell className="text-center font-medium tabular-nums">
      {c.quantities.quantity_ordered.toLocaleString()}
    </TableCell>
    <TableCell className="text-center font-medium tabular-nums">
      {c.quantities.quantity_delivered.toLocaleString()}
    </TableCell>
    <TableCell className="text-right font-medium tabular-nums">
      {formatCurrency(c.quantities.total_value)}
    </TableCell>
    <TableCell className="text-center">
      <ProgressBar progress={c.progress_pct} />
    </TableCell>
    <TableCell className="text-center">
      <span className={cn(statusBadge(contractStatusStyles, c.status, false))}>
        {formatEnumLabel(c.status)}
      </span>
    </TableCell>
    <TableCell className="text-sm">
      {c.dates.delivery_deadline || "—"}
    </TableCell>
    <TableCell onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => onEdit(c)}
          aria-label={`Edit contract ${c.contract_code}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-destructive"
          onClick={() => onDelete(c)}
          aria-label={`Delete contract ${c.contract_code}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

// ─── Progress Bar ──────────────────────────────────────────────────────────

const ProgressBar = ({ progress }: { progress: number }) => {
  const barColor =
    progress >= 100
      ? "bg-emerald-500"
      : progress >= 50
        ? "bg-primary"
        : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full">
        <div
          className={cn("h-full", barColor)}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums w-8">{progress}%</span>
    </div>
  );
};

export default ContractTable;
