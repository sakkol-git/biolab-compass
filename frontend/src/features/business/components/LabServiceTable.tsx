/* ═══════════════════════════════════════════════════════════════════════════
 * LabServiceTable — Table view for lab services.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/shared/lib/utils";
import type { LabServiceApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

import { PAYMENT_COLORS, STATUS_COLORS } from "../pages/useLabServicesView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface LabServiceTableProps {
  items: LabServiceApi[];
  onEdit: (item: LabServiceApi) => void;
  onDelete: (item: LabServiceApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const LabServiceTable = ({ items, onEdit, onDelete }: LabServiceTableProps) => (
  <div className="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-mono text-xs">
              {item.service_code}
            </TableCell>
            <TableCell className="font-medium text-sm max-w-[200px] truncate">
              {item.service_title}
            </TableCell>
            <TableCell className="text-sm">{item.client_name}</TableCell>
            <TableCell className="text-xs">
              {item.assigned_staff?.join(", ") || "—"}
            </TableCell>
            <TableCell className="text-sm">
              {item.service_fee != null
                ? `$${item.service_fee.toLocaleString()}`
                : "—"}
            </TableCell>
            <TableCell>
              <Badge
                className={cn("text-xs", STATUS_COLORS[item.status] ?? "")}
              >
                {formatEnumLabel(item.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "text-xs",
                  PAYMENT_COLORS[item.payment_status] ?? "",
                )}
              >
                {formatEnumLabel(item.payment_status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.service_title}`}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onDelete(item)}
                aria-label={`Delete ${item.service_title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default LabServiceTable;
