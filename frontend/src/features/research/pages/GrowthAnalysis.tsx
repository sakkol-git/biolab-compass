/* ═══════════════════════════════════════════════════════════════════════════
 * GrowthAnalysis — Species comparisons, growth trends, and insights.
 *
 * All state lives in useGrowthAnalysisView().
 * Connects to /species-analytics/* via React Query.
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Activity, BarChart3, TrendingUp } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/core/layouts/AppLayout";
import { LoadingState } from "@/shared/components/LoadingState";
import PageHeader from "@/shared/components/PageHeader";

import ComparisonTab from "../components/ComparisonTab";
import CurvesTab from "../components/CurvesTab";
import RadarTab from "../components/RadarTab";
import { useGrowthAnalysisView } from "./useGrowthAnalysisView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const GrowthAnalysis = () => {
  const view = useGrowthAnalysisView();

  return (
    <AppLayout>
      <div className="page-content">
        <PageHeader
          icon={TrendingUp}
          title="Growth Analysis"
          description="Species comparisons, growth trends, and performance insights"
        />

        {view.isLoading && (
          <LoadingState variant="skeleton" rows={4} text="Loading analytics…" />
        )}

        {!view.isLoading && (
          <Tabs defaultValue="comparison" className="space-y-6">
            <TabsList className="bg-muted/50 p-1 rounded-lg">
              <TabsTrigger
                value="comparison"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" /> Species Comparison
              </TabsTrigger>
              <TabsTrigger
                value="curves"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="h-4 w-4" /> Growth Curves
              </TabsTrigger>
              <TabsTrigger
                value="radar"
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Activity className="h-4 w-4" /> Species Profiles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              <ComparisonTab data={view.comparisonData} />
            </TabsContent>

            <TabsContent value="curves" className="space-y-4">
              <CurvesTab view={view} />
            </TabsContent>

            <TabsContent value="radar" className="space-y-6">
              <RadarTab data={view.radarData} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
};

export default GrowthAnalysis;
