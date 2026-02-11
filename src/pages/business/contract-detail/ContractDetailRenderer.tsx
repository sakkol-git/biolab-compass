// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT DETAIL — Stateless Rendering Engine
// ═══════════════════════════════════════════════════════════════════════════
//
// Unique to ContractDetail: has a "Value Banner" between header and KPI strip.
// Otherwise uses the shared DetailLayout.
// ═══════════════════════════════════════════════════════════════════════════

import { cn } from "@/lib/utils";
import {
  DetailLayout,
  createSectionDispatch,
} from "@/components/detail/DetailLayout";
import { sectionRegistry } from "./sectionRegistry";
import type { ContractPageConfig, DetailSection } from "./types";

const renderSection = createSectionDispatch<DetailSection>(sectionRegistry);

// ─── Value Banner (Contract-specific) ────────────────────────────────────

const ValueBanner = ({ config }: { config: ContractPageConfig }) => {
  const vb = config.valueBanner;
  return (
    <div className="bg-card border border-border shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl">
      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Total Contract Value
        </p>
        <p className="text-3xl font-medium text-foreground tabular-nums mt-1">
          {vb.totalValue}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{vb.currency}</p>
      </div>
      <div className="flex-1 max-w-md">
        <div className="flex items-center justify-between text-xs font-medium mb-2">
          <span className="text-muted-foreground">
            Delivery Progress
          </span>
          <span className="text-foreground tabular-nums">{vb.deliveredLabel}</span>
        </div>
        <div className="w-full h-4 bg-muted rounded-full">
          <div
            className={cn("h-full transition-all rounded-full", vb.progressBarClass)}
            style={{ width: `${Math.min(vb.progressPct, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mt-1">
          <span>{vb.progressPct}% complete</span>
          <span>Deadline: {vb.deadline}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Renderer ────────────────────────────────────────────────────────────

const ContractDetailRenderer = ({ config }: { config: ContractPageConfig }) => (
  <DetailLayout<DetailSection>
    header={config.header}
    actions={config.actions}
    statusBadge={config.statusBadge}
    banner={<ValueBanner config={config} />}
    kpiStrip={config.kpiStrip}
    kpiColumns="6"
    mainSections={config.mainSections}
    sidebarSections={config.sidebarSections}
    renderSection={renderSection}
  />
);

export default ContractDetailRenderer;
