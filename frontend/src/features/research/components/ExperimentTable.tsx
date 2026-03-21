/* ═══════════════════════════════════════════════════════════════════════════
 * ExperimentTable — Table view for experiments.
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
import {
    experimentStatusStyles,
    statusBadge,
} from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ExperimentApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ExperimentTableProps {
  experiments: ExperimentApi[];
  onNavigate: (id: number) => void;
  onEdit: (exp: ExperimentApi) => void;
  onDelete: (exp: ExperimentApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ExperimentTable = ({
  experiments,
  onNavigate,
  onEdit,
  onDelete,
}: ExperimentTableProps) => (
  <div className="rounded-lg overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Code</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Species</TableHead>
          <TableHead className="text-center">Method</TableHead>
          <TableHead className="text-center">Initial</TableHead>
          <TableHead className="text-center">Current</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {experiments.map((exp) => (
          <TableRow
            key={exp.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onNavigate(exp.id)}
          >
            <TableCell className="font-mono text-xs text-muted-foreground/70">
              {exp.experiment_code}
            </TableCell>
            <TableCell className="font-medium max-w-[200px] truncate">
              {exp.title}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {exp.species.common_name}
            </TableCell>
            <TableCell className="text-center text-xs">
              {formatEnumLabel(exp.propagation_method)}
            </TableCell>
            <TableCell className="text-center font-medium tabular-nums">
              {exp.metrics.initial_seed_count}
            </TableCell>
            <TableCell className="text-center font-medium tabular-nums">
              {exp.metrics.current_count.toLocaleString()}
            </TableCell>
            <TableCell className="text-center">
              <span
                className={cn(
                  statusBadge(experimentStatusStyles, exp.status, false),
                )}
              >
                {formatEnumLabel(exp.status)}
              </span>
            </TableCell>
            <TableCell className="text-sm">{exp.dates.start_date}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(exp);
                  }}
                  aria-label={`Edit ${exp.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(exp);
                  }}
                  aria-label={`Delete ${exp.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ExperimentTable;
