/* ═══════════════════════════════════════════════════════════════════════════
 * ProtocolTable — Table view for protocols.
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
import { protocolStatusStyles, statusBadge } from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ProtocolApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ProtocolTableProps {
  protocols: ProtocolApi[];
  onEdit: (p: ProtocolApi) => void;
  onDelete: (p: ProtocolApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ProtocolTable = ({ protocols, onEdit, onDelete }: ProtocolTableProps) => (
  <div className="rounded-lg overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Code</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-center">Version</TableHead>
          <TableHead className="text-center">Steps</TableHead>
          <TableHead className="text-center">Linked</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {protocols.map((p) => (
          <ProtocolTableRow
            key={p.id}
            protocol={p}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ProtocolTable;

// ─── Row ───────────────────────────────────────────────────────────────────

const ProtocolTableRow = ({
  protocol: p,
  onEdit,
  onDelete,
}: {
  protocol: ProtocolApi;
  onEdit: (p: ProtocolApi) => void;
  onDelete: (p: ProtocolApi) => void;
}) => (
  <TableRow>
    <TableCell className="font-mono text-xs text-muted-foreground/70">
      {p.protocol_code}
    </TableCell>
    <TableCell className="font-medium max-w-[200px] truncate">
      {p.title}
    </TableCell>
    <TableCell className="text-muted-foreground">{p.category}</TableCell>
    <TableCell className="text-center font-medium">v{p.version}</TableCell>
    <TableCell className="text-center tabular-nums">{p.steps_count}</TableCell>
    <TableCell className="text-center tabular-nums">
      {p.linked_experiments_count}
    </TableCell>
    <TableCell className="text-center">
      <span className={cn(statusBadge(protocolStatusStyles, p.status, false))}>
        {formatEnumLabel(p.status)}
      </span>
    </TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {p.author.name}
    </TableCell>
    <TableCell className="text-sm">{p.last_updated}</TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => onEdit(p)}
          aria-label={`Edit ${p.title}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(p)}
          aria-label={`Delete ${p.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);
