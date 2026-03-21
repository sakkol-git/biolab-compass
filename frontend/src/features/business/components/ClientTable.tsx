/* ═══════════════════════════════════════════════════════════════════════════
 * ClientTable — Table view for clients.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/shared/lib/calculator";
import { clientTypeStyles, statusBadge } from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ClientApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ClientTableProps {
  clients: ClientApi[];
  onEdit: (cl: ClientApi) => void;
  onDelete: (cl: ClientApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ClientTable = ({ clients, onEdit, onDelete }: ClientTableProps) => (
  <div className="bg-card overflow-x-auto rounded-xl border border-border/40">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border/40">
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">
            Code
          </th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">
            Company
          </th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">
            Contact
          </th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">
            Type
          </th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">
            Email
          </th>
          <th className="text-right p-3 text-xs font-normal text-muted-foreground/70">
            Contracts
          </th>
          <th className="text-right p-3 text-xs font-normal text-muted-foreground/70">
            Value
          </th>
          <th className="p-3 w-20"></th>
        </tr>
      </thead>
      <tbody>
        {clients.map((cl) => (
          <ClientTableRow
            key={cl.id}
            client={cl}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Table Row ─────────────────────────────────────────────────────────────

const ClientTableRow = ({
  client: cl,
  onEdit,
  onDelete,
}: {
  client: ClientApi;
  onEdit: (cl: ClientApi) => void;
  onDelete: (cl: ClientApi) => void;
}) => (
  <tr className="border-b border-border/40 hover:bg-muted/20 transition-colors">
    <td className="p-3 text-xs font-mono text-muted-foreground">
      {cl.client_code}
    </td>
    <td className="p-3 text-sm font-medium text-foreground">
      {cl.company_name}
    </td>
    <td className="p-3 text-sm text-muted-foreground">{cl.contact_name}</td>
    <td className="p-3">
      <span
        className={cn(statusBadge(clientTypeStyles, cl.client_type, false))}
      >
        {formatEnumLabel(cl.client_type)}
      </span>
    </td>
    <td className="p-3 text-sm text-muted-foreground">{cl.email || "—"}</td>
    <td className="p-3 text-sm font-medium text-foreground tabular-nums text-right">
      {cl.total_contracts}
    </td>
    <td className="p-3 text-sm font-medium text-primary tabular-nums text-right">
      {formatCurrency(cl.total_value)}
    </td>
    <td className="p-3">
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => onEdit(cl)}
          aria-label={`Edit ${cl.company_name}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-destructive"
          onClick={() => onDelete(cl)}
          aria-label={`Delete ${cl.company_name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </td>
  </tr>
);

export default ClientTable;
