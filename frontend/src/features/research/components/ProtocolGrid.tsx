/* ═══════════════════════════════════════════════════════════════════════════
 * ProtocolGrid — Card-based grid view for protocols.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { FileText, Link2, Pencil, Tag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { protocolStatusStyles, statusBadge } from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ProtocolApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Grid ──────────────────────────────────────────────────────────────────

interface ProtocolGridProps {
  protocols: ProtocolApi[];
  onEdit: (p: ProtocolApi) => void;
  onDelete: (p: ProtocolApi) => void;
}

const ProtocolGrid = ({ protocols, onEdit, onDelete }: ProtocolGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
    {protocols.map((p) => (
      <ProtocolCard
        key={p.id}
        protocol={p}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default ProtocolGrid;

// ─── Card ──────────────────────────────────────────────────────────────────

const ProtocolCard = ({
  protocol: p,
  onEdit,
  onDelete,
}: {
  protocol: ProtocolApi;
  onEdit: (p: ProtocolApi) => void;
  onDelete: (p: ProtocolApi) => void;
}) => (
  <div className="bg-card rounded-xl border border-border/60 hover:bg-muted/30 transition-colors p-5 flex flex-col overflow-hidden">
    <div className="flex items-start justify-between mb-3">
      <span className="font-mono text-xs font-normal text-muted-foreground/70">
        {p.protocol_code}
      </span>
      <span className={cn(statusBadge(protocolStatusStyles, p.status))}>
        {formatEnumLabel(p.status)}
      </span>
    </div>
    <h3 className="font-medium text-foreground text-sm leading-tight mb-1 line-clamp-2">
      {p.title}
    </h3>
    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
      {p.description}
    </p>
    <div className="mt-auto space-y-2 text-xs">
      <InfoLine icon={Tag} label={p.category} trailing={`v${p.version}`} />
      <InfoLine icon={FileText} label={`${p.steps_count} steps`} />
      <InfoLine
        icon={Link2}
        label={`${p.linked_experiments_count} linked experiments`}
      />
    </div>
    <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
      <div>
        <span className="text-xs text-muted-foreground">{p.author.name}</span>
        <span className="text-xs text-muted-foreground ml-2">
          {p.last_updated}
        </span>
      </div>
      <div className="flex gap-1">
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
    </div>
  </div>
);

// ─── InfoLine helper ───────────────────────────────────────────────────────

const InfoLine = ({
  icon: Icon,
  label,
  trailing,
}: {
  icon: React.ElementType;
  label: string;
  trailing?: string;
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3 w-3 text-muted-foreground/50 shrink-0" />
    <span className="text-muted-foreground/70">{label}</span>
    {trailing && (
      <span className="text-foreground font-medium ml-auto">{trailing}</span>
    )}
  </div>
);
