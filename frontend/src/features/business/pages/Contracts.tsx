/* ═══════════════════════════════════════════════════════════════════════════
 * Contracts — Seedling production contracts and deliveries.
 *
 * All state lives in useContractsView().
 * Sub-components: ContractGrid, ContractTable, ContractFormDialog.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Receipt } from "lucide-react";

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

import type { ContractApi } from "@/shared/types";
import ContractFormDialog from "../components/ContractFormDialog";
import ContractGrid from "../components/ContractGrid";
import ContractTable from "../components/ContractTable";
import { useContractsView } from "./useContractsView";

const Contracts = () => {
  const view = useContractsView();

  return (
    <ListPage<ContractApi>
      icon={Receipt}
      title="Contracts"
      description="Manage seedling production contracts and deliveries"
      addLabel="Add Contract"
      onAdd={view.openCreateForm}
      stats={view.quickStats}
      searchPlaceholder="Search contracts..."
      searchQuery={view.searchQuery}
      onSearchChange={view.updateSearchQuery}
      viewMode={view.viewMode}
      onViewModeChange={view.switchViewMode}
      items={view.filteredItems}
      isLoading={view.isLoading}
      isError={view.isError}
      emptyTitle="No contracts found"
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
        <ContractGrid
          contracts={items}
          onEdit={view.openEditForm}
          onDelete={view.requestDeleteContract}
        />
      )}
      renderTable={(items) => (
        <ContractTable
          contracts={items}
          onNavigate={view.navigateToDetail}
          onEdit={view.openEditForm}
          onDelete={view.requestDeleteContract}
        />
      )}
    >
      <ContractFormDialog view={view} />
      <ConfirmDialog
        open={view.deleteDialog.open}
        onOpenChange={view.deleteDialog.setOpen}
        onConfirm={view.confirmDeleteContract}
        title={view.deleteDialog.pendingMeta.title}
        description={view.deleteDialog.pendingMeta.description}
        confirmLabel="Delete"
        variant="destructive"
      />
    </ListPage>
  );
};

export default Contracts;
