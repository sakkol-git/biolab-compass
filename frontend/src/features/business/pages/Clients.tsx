/* ═══════════════════════════════════════════════════════════════════════════
 * Clients — Client relationships and contacts.
 *
 * All state lives in useClientsView().
 * Sub-components: ClientGrid, ClientTable, ClientFormDialog.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Handshake } from "lucide-react";

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

import type { ClientApi } from "@/shared/types";
import ClientFormDialog from "../components/ClientFormDialog";
import ClientGrid from "../components/ClientGrid";
import ClientTable from "../components/ClientTable";
import { useClientsView } from "./useClientsView";

const Clients = () => {
  const view = useClientsView();

  return (
    <ListPage<ClientApi>
      icon={Handshake}
      title="Clients"
      description="Manage your client relationships and contacts"
      addLabel="Add Client"
      onAdd={view.openCreateForm}
      stats={view.quickStats}
      searchPlaceholder="Search clients..."
      searchQuery={view.searchQuery}
      onSearchChange={view.updateSearchQuery}
      viewMode={view.viewMode}
      onViewModeChange={view.switchViewMode}
      items={view.filteredItems}
      isLoading={view.isLoading}
      isError={view.isError}
      emptyTitle="No clients found"
      emptyDescription="Try adjusting your search or add a new client."
      filterSlot={
        <Select value={view.typeFilter} onValueChange={view.updateTypeFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {view.clientTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {formatEnumLabel(t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      renderGrid={(items) => (
        <ClientGrid
          clients={items}
          onEdit={view.openEditForm}
          onDelete={view.requestDeleteClient}
        />
      )}
      renderTable={(items) => (
        <ClientTable
          clients={items}
          onEdit={view.openEditForm}
          onDelete={view.requestDeleteClient}
        />
      )}
    >
      <ClientFormDialog view={view} />
      <ConfirmDialog
        open={view.deleteDialog.open}
        onOpenChange={view.deleteDialog.setOpen}
        onConfirm={view.confirmDeleteClient}
        title={view.deleteDialog.pendingMeta.title}
        description={view.deleteDialog.pendingMeta.description}
        confirmLabel="Delete"
        variant="destructive"
      />
    </ListPage>
  );
};

export default Clients;
