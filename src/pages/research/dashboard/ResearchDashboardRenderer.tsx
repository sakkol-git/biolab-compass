// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH DASHBOARD RENDERER — Dynamic Rendering Engine (Phase 4)
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
  ResearchWidget,
  DashboardHeader,
  DashboardTab,
  ResearchDashboardConfig,
} from "./types";

// ─── Exhaustiveness Guard ──────────────────────────────────────────────────

function assertNever(value: never): never {
  throw new Error(`Unhandled widget type: ${JSON.stringify(value)}`);
}

// ─── Single Widget Renderer ────────────────────────────────────────────────

interface WidgetSlotProps {
  widget: ResearchWidget;
}

const WidgetSlot = ({ widget }: WidgetSlotProps) => {
  const type = widget.type;

  if (type in WIDGET_REGISTRY) {
    const Renderer = WIDGET_REGISTRY[type] as React.ComponentType<{
      config: typeof widget;
    }>;
    return <Renderer config={widget} />;
  }

  return assertNever(type as never);
};

// ─── Page Header ───────────────────────────────────────────────────────────

interface PageHeaderProps {
  header: DashboardHeader;
}

const PageHeader = ({ header }: PageHeaderProps) => {
  const Icon = header.icon;
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between border-b border-border pb-6 gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-muted border rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-medium text-foreground">
            {header.title}
          </h1>
        </div>
        <p className="text-muted-foreground font-medium">{header.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{header.dateLabel}</span>
      </div>
    </div>
  );
};

// ─── Tab Content Layout Strategies ─────────────────────────────────────────

/**
 * Overview: 3-column layout.
 *
 * Left (2 cols): RecentExperiments
 * Right (1 col): StatusPie + TopSpecies + GrowthStage
 * Below: QuickLinks (full width)
 */
function renderOverviewLayout(widgets: ResearchWidget[]) {
  const recentExperiments = widgets.find((w) => w.type === "recent-experiments");
  const statusPie = widgets.find((w) => w.type === "status-pie");
  const topSpecies = widgets.find((w) => w.type === "top-species");
  const growthStage = widgets.find((w) => w.type === "growth-stage");
  const quickLinks = widgets.find((w) => w.type === "quick-links");

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {recentExperiments && <WidgetSlot widget={recentExperiments} />}
        </div>
        <div className="space-y-6">
          {statusPie && <WidgetSlot widget={statusPie} />}
          {topSpecies && <WidgetSlot widget={topSpecies} />}
          {growthStage && <WidgetSlot widget={growthStage} />}
        </div>
      </div>
      {quickLinks && <WidgetSlot widget={quickLinks} />}
    </>
  );
}

/**
 * Analytics: 2-column chart grid + full-width table.
 *
 * Row 1–2: Bar charts in 2-col grid
 * Row 3: Health score grid (full width from grid)
 * Below: Species performance table (full width)
 */
function renderAnalyticsLayout(widgets: ResearchWidget[]) {
  const charts = widgets.filter(
    (w) => w.type === "bar-chart" || w.type === "health-score-grid"
  );
  const tables = widgets.filter((w) => w.type === "species-table");

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
  (widgets: ResearchWidget[]) => React.ReactNode
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

interface ResearchDashboardRendererProps {
  config: ResearchDashboardConfig;
}

const ResearchDashboardRenderer = ({ config }: ResearchDashboardRendererProps) => (
  <div className="space-y-6 stagger-children">
    <PageHeader header={config.header} />

    {config.globalWidgets.map((widget, index) => (
      <WidgetSlot key={`global-${widget.type}-${index}`} widget={widget} />
    ))}

    <Tabs defaultValue={config.tabs[0]?.id} className="space-y-6">
      <TabsList className="bg-card rounded-xl p-1 border border-border shadow-sm h-auto">
        {config.tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="gap-2 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
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

export default ResearchDashboardRenderer;
