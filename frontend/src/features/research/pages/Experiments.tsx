/* ═══════════════════════════════════════════════════════════════════════════
 * Experiments — Seedling propagation experiments (composition root).
 *
 * Uses ListPage shell. All state lives in useExperimentsView().
 * Follows the golden-standard pattern (see Chemicals.tsx).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { TestTubes } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ListPage } from "@/shared/components/ListPage";
import { formatEnumLabel } from "@/shared/types/enums";

import ExperimentFormDialog from "../components/ExperimentFormDialog";
import ExperimentGrid from "../components/ExperimentGrid";
import ExperimentTable from "../components/ExperimentTable";
import { useExperimentsView } from "./useExperimentsView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Experiments = () => {
  const view = useExperimentsView();

  return (
    <ListPage
      icon={TestTubes}
      title="Experiments"
      description="Track seedling propagation experiments and growth data"
      addLabel="New Experiment"
      onAdd={view.openCreateForm}
      stats={view.quickStats}
      searchPlaceholder="Search experiments..."
      searchQuery={view.searchQuery}
      onSearchChange={view.updateSearchQuery}
      viewMode={view.viewMode}
      onViewModeChange={view.switchViewMode}
      items={view.filteredItems}
      isLoading={view.isLoading}
      isError={view.isError}
      emptyTitle="No experiments found"
      emptyDescription="Try adjusting your search or filter."
      filterSlot={
        <Select
          value={view.statusFilter}
          onValueChange={view.updateStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {view.statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {formatEnumLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      renderGrid={(items) => (
        <ExperimentGrid experiments={items} onEdit={view.openEditForm} />
      )}
      renderTable={(items) => (
        <ExperimentTable
          experiments={items}
          onNavigate={view.navigateToDetail}
          onEdit={view.openEditForm}
          onDelete={view.requestDeleteExperiment}
        />
      )}
    >
      <ExperimentFormDialog view={view} />
      <ConfirmDialog
        open={view.deleteDialog.open}
        onOpenChange={view.deleteDialog.setOpen}
        onConfirm={view.confirmDeleteExperiment}
        title={view.deleteDialog.pendingMeta.title}
        description={view.deleteDialog.pendingMeta.description}
        confirmLabel="Delete"
        variant="destructive"
      />
    </ListPage>
  );
};

export default Experiments;
