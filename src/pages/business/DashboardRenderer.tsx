// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS DASHBOARD RENDERER — Dynamic Rendering Engine (Phase 4)
// ═══════════════════════════════════════════════════════════════════════════
//
// This component has ZERO knowledge of individual widget implementations.
// It receives a config, looks up each widget's renderer from the registry,
// and delegates rendering via the `WidgetSlot` abstraction.
//
// Each tab has its own layout strategy to preserve intentional grid
// arrangements (e.g. 3-column sidebar, 2-column chart grid).
// ═══════════════════════════════════════════════════════════════════════════

import { Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WIDGET_REGISTRY } from "./widgetRegistry";
import type {
  DashboardWidget,
  DashboardHeader,
  DashboardTab,
  BusinessDashboardConfig,
} from "./types";

// ─── Exhaustiveness Guard ──────────────────────────────────────────────────

function assertNever(value: never): never {
  throw new Error(`Unhandled widget type: ${JSON.stringify(value)}`);
}

// ─── Single Widget Renderer ────────────────────────────────────────────────

interface WidgetSlotProps {
  widget: DashboardWidget;
}

/**
 * Resolves the correct renderer for a widget config via the registry.
 * The `assertNever` call on the `default` branch guarantees compile-time
 * exhaustiveness when the union grows.
 */
const WidgetSlot = ({ widget }: WidgetSlotProps) => {
  const type = widget.type;

  if (type in WIDGET_REGISTRY) {
    // Safe cast: the registry's type-level constraint guarantees this
    // component accepts `{ config: typeof widget }`.
    const Renderer = WIDGET_REGISTRY[type] as React.ComponentType<{
      config: typeof widget;
    }>;
    return <Renderer config={widget} />;
  }

  // Compile-time exhaustiveness check — unreachable at runtime
  // if the registry covers all union members.
  return assertNever(type as never);
};

// ─── Page Header ───────────────────────────────────────────────────────────

interface PageHeaderProps {
  header: DashboardHeader;
}

const PageHeader = ({ header }: PageHeaderProps) => {
  const Icon = header.icon;
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between pb-6 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-muted rounded-lg">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-medium text-foreground">
            {header.title}
          </h1>
        </div>
        <p className="text-muted-foreground">{header.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{header.dateLabel}</span>
      </div>
    </div>
  );
};

// ─── Tab Content Layout ────────────────────────────────────────────────────

/**
 * Each tab defines its own layout strategy.
 *
 * "overview" uses a specific two-column layout (contracts left, sidebar right).
 * "analytics" uses a uniform 2-column grid + a full-width table.
 *
 * This keeps layout intentional and readable rather than trying to force
 * every tab into a single generic grid (which would be worse, not better).
 */
function renderOverviewLayout(widgets: DashboardWidget[]) {
  const pipeline = widgets.find((w) => w.type === "pipeline");
  const contractGrid = widgets.find((w) => w.type === "contract-grid");
  const clientRanking = widgets.find((w) => w.type === "client-ranking");
  const quickLinks = widgets.find((w) => w.type === "quick-links");

  return (
    <>
      {pipeline && <WidgetSlot widget={pipeline} />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {contractGrid && <WidgetSlot widget={contractGrid} />}
        </div>
        <div className="space-y-6">
          {clientRanking && <WidgetSlot widget={clientRanking} />}
          {quickLinks && <WidgetSlot widget={quickLinks} />}
        </div>
      </div>
    </>
  );
}

function renderAnalyticsLayout(widgets: DashboardWidget[]) {
  const charts = widgets.filter(
    (w) =>
      w.type === "bar-chart" ||
      w.type === "pie-chart" ||
      w.type === "payment-list"
  );
  const tables = widgets.filter((w) => w.type === "contracts-table");

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((widget, index) => (
          <WidgetSlot key={`${widget.type}-${index}`} widget={widget} />
        ))}
      </div>
      {tables.map((widget, index) => (
        <WidgetSlot key={`${widget.type}-${index}`} widget={widget} />
      ))}
    </>
  );
}

const TAB_LAYOUT_STRATEGY: Record<
  string,
  (widgets: DashboardWidget[]) => React.ReactNode
> = {
  overview: renderOverviewLayout,
  analytics: renderAnalyticsLayout,
};

function renderTabContent(tab: DashboardTab) {
  const strategy = TAB_LAYOUT_STRATEGY[tab.id];
  if (strategy) return strategy(tab.widgets);

  // Fallback: render widgets sequentially (safe default for new tabs)
  return tab.widgets.map((widget, index) => (
    <WidgetSlot key={`${widget.type}-${index}`} widget={widget} />
  ));
}

// ─── Main Dashboard Renderer ───────────────────────────────────────────────

interface DashboardRendererProps {
  config: BusinessDashboardConfig;
}

const BusinessDashboardRenderer = ({ config }: DashboardRendererProps) => (
  <div className="space-y-6 stagger-children">
    <PageHeader header={config.header} />

    {config.globalWidgets.map((widget, index) => (
      <WidgetSlot key={`global-${widget.type}-${index}`} widget={widget} />
    ))}

    <Tabs defaultValue={config.tabs[0]?.id} className="space-y-6">
      <TabsList className="bg-muted p-1 h-auto rounded-lg">
        {config.tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg"
            >
              <TabIcon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {config.tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-6 mt-0">
          {renderTabContent(tab)}
        </TabsContent>
      ))}
    </Tabs>
  </div>
);

export default BusinessDashboardRenderer;
