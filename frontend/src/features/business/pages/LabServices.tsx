/* ═══════════════════════════════════════════════════════════════════════════
 * LabServices — Lab service requests listing page (Business Module).
 *
 * All state lives in useLabServicesView().
 * Sub-components: LabServiceGrid, LabServiceTable, LabServiceFormDialog.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { DollarSign, Microscope, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/core/layouts/AppLayout";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import EmptyState from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import PageHeader from "@/shared/components/PageHeader";
import { QuickStats } from "@/shared/components/QuickStats";
import SearchFilter from "@/shared/components/SearchFilter";
import { ViewToggle } from "@/shared/components/ViewToggle";
import { formatEnumLabel } from "@/shared/types/enums";

import LabServiceFormDialog from "../components/LabServiceFormDialog";
import LabServiceGrid from "../components/LabServiceGrid";
import LabServiceTable from "../components/LabServiceTable";
import { useLabServicesView } from "./useLabServicesView";

const LabServices = () => {
  const view = useLabServicesView();
  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="page-content">
        <PageHeader
          icon={Microscope}
          title="Lab Services"
          description="Manage laboratory service requests from external clients"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" />
              New Service
            </Button>
          }
        />

        <QuickStats stats={view.quickStats} />

        {/* Revenue Summary */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              Total: <strong>${view.totalRevenue.toLocaleString()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-700 dark:text-emerald-300">
              Paid: <strong>${view.paidRevenue.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SearchFilter
            query={view.searchQuery}
            onQueryChange={view.updateSearchQuery}
            placeholder="Search services, clients..."
          />
          <div className="flex items-center gap-2">
            <Select
              value={view.statusFilter}
              onValueChange={view.updateStatusFilter}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {(view.statusOptions as readonly string[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {formatEnumLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ViewToggle current={view.viewMode} onChange={view.setViewMode} />
          </div>
        </div>

        {view.isLoading && (
          <LoadingState
            variant="skeleton"
            rows={6}
            text="Loading services..."
          />
        )}
        {view.isError && !view.isLoading && (
          <ErrorState
            message="Failed to load lab services"
            onRetry={() => window.location.reload()}
          />
        )}
        {!view.isLoading && !view.isError && !hasResults && (
          <EmptyState
            title="No lab services found"
            description="Try adjusting your search or create a new service."
          />
        )}

        {!view.isLoading &&
          !view.isError &&
          hasResults &&
          view.viewMode === "grid" && (
            <LabServiceGrid
              items={view.filteredItems}
              onEdit={view.openEditForm}
              onDelete={view.requestDeleteService}
            />
          )}
        {!view.isLoading &&
          !view.isError &&
          hasResults &&
          view.viewMode === "table" && (
            <LabServiceTable
              items={view.filteredItems}
              onEdit={view.openEditForm}
              onDelete={view.requestDeleteService}
            />
          )}
      </div>

      <LabServiceFormDialog view={view} />
      <ConfirmDialog
        open={view.deleteDialog.open}
        onOpenChange={view.deleteDialog.setOpen}
        onConfirm={view.confirmDeleteService}
        title={view.deleteDialog.pendingMeta.title}
        description={view.deleteDialog.pendingMeta.description}
        confirmLabel="Delete"
        variant="destructive"
      />
    </AppLayout>
  );
};

export default LabServices;
