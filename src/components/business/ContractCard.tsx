/* ═══════════════════════════════════════════════════════════════════════════
 * ContractCard — Presentational card for a single contract.
 *
 * Stateless. Navigation handler received via prop (onSelect).
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import { Calendar, Sprout, DollarSign, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Internal ──────────────────────────────────────────────────────────────
import { cn } from "@/lib/utils";
import { contractStatusStyles, statusBadge } from "@/lib/status-styles";
import type { Contract } from "@/types/business";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const ContractCard = ({ contract }: { contract: Contract }) => {
  const navigate = useNavigate();
  const openDetail = () => navigate(`/business/contracts/${contract.id}`);
  const onKeyActivate = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(); }
  };

  return (
    <div
      className="bg-card rounded-xl border border-border/60 shadow-md hover:shadow-lg hover:bg-muted/30 transition-all cursor-pointer p-5"
      onClick={openDetail}
      onKeyDown={onKeyActivate}
      role="link"
      tabIndex={0}
      aria-label={`View contract: ${contract.contractCode} - ${contract.clientName}`}
    >
      <CardHeader contract={contract} />
      <ContractDetails contract={contract} />
      <ProgressBar
        pct={contract.progressPct}
        delivered={contract.quantityDelivered}
        ordered={contract.quantityOrdered}
      />
    </div>
  );
};

export default ContractCard;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

const CardHeader = ({ contract }: { contract: Contract }) => (
  <div className="flex items-start justify-between mb-3">
    <div>
      <span className="font-mono text-xs font-normal text-muted-foreground/70">{contract.contractCode}</span>
      <h3 className="font-medium text-foreground text-sm mt-0.5">{contract.clientName}</h3>
    </div>
    <span className={cn("shrink-0", statusBadge(contractStatusStyles, contract.status))}>
      {contract.status}
    </span>
  </div>
);

const ContractDetails = ({ contract }: { contract: Contract }) => (
  <div className="space-y-2 text-xs mb-3">
    <DetailLine icon={Sprout}>
      <span className="text-muted-foreground">{contract.commonName}</span>
      <span className="font-medium text-foreground tabular-nums">{contract.quantityOrdered.toLocaleString()}</span>
      <span className="text-muted-foreground">seedlings</span>
    </DetailLine>
    <DetailLine icon={DollarSign}>
      <span className="font-medium text-foreground tabular-nums">${contract.totalValue.toLocaleString()}</span>
      <span className="text-muted-foreground">{contract.currency}</span>
    </DetailLine>
    <DetailLine icon={Calendar}>
      <span className="text-muted-foreground">Due:</span>
      <span className="font-medium text-foreground">{contract.deliveryDeadline}</span>
    </DetailLine>
    <DetailLine icon={Building2}>
      <span className="text-muted-foreground truncate">{contract.managedBy}</span>
    </DetailLine>
  </div>
);

const DetailLine = ({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3 w-3 text-muted-foreground/50" />
    {children}
  </div>
);

const ProgressBar = ({ pct, delivered, ordered }: { pct: number; delivered: number; ordered: number }) => {
  const fillColor = pct >= 100 ? "bg-emerald-500" : pct >= 50 ? "bg-primary" : "bg-amber-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-normal text-muted-foreground/70">Progress</span>
        <span className="font-medium text-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-lg">
        <div
          className={cn("h-full transition-all duration-300", fillColor)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground/70">
        <span>{delivered.toLocaleString()} delivered</span>
        <span>{ordered.toLocaleString()} ordered</span>
      </div>
    </div>
  );
};

