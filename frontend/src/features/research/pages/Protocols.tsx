/* ═══════════════════════════════════════════════════════════════════════════
 * Protocols — Standard operating procedures and lab protocols.
 *
 * Uses ListPage shell. All state lives in useProtocolsView().
 * Follows the golden-standard pattern (see Chemicals.tsx).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { BookOpen } from "lucide-react";

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

import type { ProtocolApi } from "@/shared/types";
import ProtocolFormDialog from "../components/ProtocolFormDialog";
import ProtocolGrid from "../components/ProtocolGrid";
import ProtocolTable from "../components/ProtocolTable";
import { useProtocolsView } from "./useProtocolsView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Protocols = () => {
  const view = useProtocolsView();

  return (
    <ListPage<ProtocolApi>
      icon={BookOpen}
      title="Protocols"
      description="Standard operating procedures and lab protocols"
      addLabel="Add Protocol"
      onAdd={view.openCreateForm}
      stats={view.quickStats}
      searchPlaceholder="Search protocols…"
      searchQuery={view.searchQuery}
      onSearchChange={view.updateSearchQuery}
      viewMode={view.viewMode}
      onViewModeChange={view.switchViewMode}
      items={view.filteredItems}
      isLoading={view.isLoading}
      isError={view.isError}
      emptyTitle="No protocols found"
      emptyDescription="Try adjusting your search or filter, or add a new protocol."
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
        <ProtocolGrid
          protocols={items}
          onEdit={view.openEditForm}
          onDelete={view.requestDeleteProtocol}
        />
      )}
      renderTable={(items) => (
        <ProtocolTable
          protocols={items}
          onEdit={view.openEditForm}
          onDelete={view.requestDeleteProtocol}
        />
      )}
    >
      <ProtocolFormDialog view={view} />
      <ConfirmDialog
        dialog={view.deleteDialog}
        onConfirm={view.confirmDeleteProtocol}
        variant="destructive"
      />
    </ListPage>
  );
};

export default Protocols;
