/* ═══════════════════════════════════════════════════════════════════════════
 * ClientGrid — Card-based grid view for clients.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Building2, Mail, Pencil, Phone, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/shared/lib/calculator";
import { clientTypeStyles, statusBadge } from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ClientApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ClientGridProps {
  clients: ClientApi[];
  onEdit: (cl: ClientApi) => void;
  onDelete: (cl: ClientApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ClientGrid = ({ clients, onEdit, onDelete }: ClientGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
    {clients.map((cl) => (
      <ClientCard key={cl.id} client={cl} onEdit={onEdit} onDelete={onDelete} />
    ))}
  </div>
);

// ─── Client Card ───────────────────────────────────────────────────────────

const ClientCard = ({
  client: cl,
  onEdit,
  onDelete,
}: {
  client: ClientApi;
  onEdit: (cl: ClientApi) => void;
  onDelete: (cl: ClientApi) => void;
}) => (
  <div className="bg-card border border-border/60 hover-lift hover:shadow-md transition-all p-5 rounded-xl">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-medium text-foreground text-sm">
          {cl.company_name}
        </h3>
        <p className="text-xs text-muted-foreground/60">{cl.contact_name}</p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(statusBadge(clientTypeStyles, cl.client_type, false))}
        >
          {formatEnumLabel(cl.client_type)}
        </span>
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
    </div>
    <ContactLines email={cl.email} phone={cl.phone} address={cl.address} />
    <div className="flex items-center justify-between pt-3 border-t border-border/40">
      <div className="text-xs">
        <span className="font-medium text-foreground tabular-nums">
          {cl.total_contracts}
        </span>
        <span className="text-muted-foreground ml-1">contracts</span>
      </div>
      <p className="text-sm font-medium text-primary tabular-nums">
        {formatCurrency(cl.total_value)}
      </p>
    </div>
  </div>
);

// ─── Contact Lines ─────────────────────────────────────────────────────────

const ContactLines = ({
  email,
  phone,
  address,
}: {
  email: string | null;
  phone: string | null;
  address: string | null;
}) => (
  <div className="space-y-1.5 text-sm mb-4">
    <ContactLine icon={Mail} value={email || "—"} />
    <ContactLine icon={Phone} value={phone || "—"} />
    <ContactLine icon={Building2} value={address || "—"} />
  </div>
);

const ContactLine = ({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
    <span className="text-muted-foreground/70 truncate">{value}</span>
  </div>
);

export default ClientGrid;
