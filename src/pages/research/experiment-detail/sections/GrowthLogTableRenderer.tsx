// ═══════════════════════════════════════════════════════════════════════════
// GROWTH LOG TABLE — Section Renderer (Phase 2: Edit + Delete)
// ═══════════════════════════════════════════════════════════════════════════

import { SectionCard } from "@/components/detail/DetailPageShell";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { GrowthLogTableSection } from "../types";

interface Props {
  section: GrowthLogTableSection;
}

const GrowthLogTableRenderer = ({ section }: Props) => {
  const navigate = useNavigate();
  const hasActions = Boolean(section.onEdit || section.onDelete);

  // Build action button JSX if provided
  const actionButton = section.action ? (
    <Button
      variant={section.action.variant}
      size="sm"
      className={section.action.className}
      aria-label={section.action.ariaLabel}
      onClick={section.action.onClick ?? (section.action.href ? () => navigate(section.action!.href!) : undefined)}
    >
      <section.action.icon className="h-3.5 w-3.5" />
      {section.action.label}
    </Button>
  ) : undefined;

  return (
    <SectionCard title={section.title} icon={section.icon} headerAction={actionButton}>
      <div className="overflow-x-auto -mx-5 -mb-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 font-medium text-xs">
                Week
              </TableHead>
              <TableHead className="font-medium text-xs">Date</TableHead>
              <TableHead className="text-center font-medium text-xs">
                Total
              </TableHead>
              <TableHead className="text-center font-medium text-xs">
                Alive
              </TableHead>
              <TableHead className="text-center font-medium text-xs">
                Dead
              </TableHead>
              <TableHead className="text-center font-medium text-xs">
                New
              </TableHead>
              <TableHead className="text-center font-medium text-xs">
                Survival
              </TableHead>
              <TableHead className="text-center font-medium text-xs">
                Health
              </TableHead>
              <TableHead className="font-medium text-xs">Stage</TableHead>
              <TableHead className="max-w-[200px] font-medium text-xs">
                Notes
              </TableHead>
              {hasActions && (
                <TableHead className="w-24 text-center font-medium text-xs">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {section.rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium tabular-nums">
                  {row.week}
                </TableCell>
                <TableCell className="text-sm">{row.logDate}</TableCell>
                <TableCell className="text-center font-medium tabular-nums">
                  {row.seedlingCount}
                </TableCell>
                <TableCell className="text-center font-medium tabular-nums text-emerald-600">
                  {row.aliveCount}
                </TableCell>
                <TableCell className="text-center font-medium tabular-nums text-red-500">
                  {row.deadCount}
                </TableCell>
                <TableCell className="text-center font-medium tabular-nums">
                  {row.newPropagations}
                </TableCell>
                <TableCell className="text-center font-medium tabular-nums">
                  {row.survivalRatePct}%
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "inline-block w-7 text-center font-medium text-xs py-0.5",
                      row.healthScoreColor
                    )}
                  >
                    {row.healthScore}/10
                  </span>
                </TableCell>
                <TableCell>{row.growthStageBadge}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                  {row.observations}
                </TableCell>
                {hasActions && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {section.onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => section.onEdit!(row.id)}
                          aria-label={`Edit ${row.week} log`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {section.onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => section.onDelete!(row.id)}
                          aria-label={`Delete ${row.week} log`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
};

export default GrowthLogTableRenderer;
