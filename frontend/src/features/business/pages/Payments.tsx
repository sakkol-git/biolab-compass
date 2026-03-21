/* ═══════════════════════════════════════════════════════════════════════════
 * Payments — Track invoices, deposits, and payment statuses.
 *
 * All state lives in usePaymentsView().
 * Sub-components: PaymentTable, PaymentFormDialog, PaymentFilters.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { DollarSign, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AppLayout from "@/core/layouts/AppLayout";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import EmptyState from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import PageHeader from "@/shared/components/PageHeader";
import { QuickStats } from "@/shared/components/QuickStats";
import SearchFilter from "@/shared/components/SearchFilter";

import {
    PaymentStatusFilter,
    PaymentTypeFilter,
} from "../components/PaymentFilters";
import PaymentFormDialog from "../components/PaymentFormDialog";
import PaymentTable from "../components/PaymentTable";
import { usePaymentsView } from "./usePaymentsView";

const Payments = () => {
  const view = usePaymentsView();
  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="page-content">
        <PageHeader
          icon={DollarSign}
          title="Payments"
          description="Track invoices, deposits, and payment statuses"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> Add Payment
            </Button>
          }
        />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search payments..."
        >
          <PaymentStatusFilter
            value={view.statusFilter}
            onChange={view.updateStatusFilter}
            options={view.statusOptions}
          />
          <PaymentTypeFilter
            value={view.typeFilter}
            onChange={view.updateTypeFilter}
            options={view.typeOptions}
          />
        </SearchFilter>

        {view.isLoading && (
          <LoadingState
            variant="skeleton"
            rows={6}
            text="Loading payments..."
          />
        )}
        {view.isError && !view.isLoading && (
          <ErrorState
            message="Failed to load payments"
            onRetry={() => window.location.reload()}
          />
        )}
        {!view.isLoading && !view.isError && !hasResults && (
          <EmptyState
            icon={DollarSign}
            title="No payments found"
            description="Try adjusting your search or filters."
          />
        )}

        {!view.isLoading && !view.isError && hasResults && (
          <PaymentTable
            payments={view.filteredItems}
            onEdit={view.openEditForm}
            onDelete={view.requestDeletePayment}
          />
        )}
      </div>

      <PaymentFormDialog view={view} />
      <ConfirmDialog
        open={view.deleteDialog.open}
        onOpenChange={view.deleteDialog.setOpen}
        onConfirm={view.confirmDeletePayment}
        title={view.deleteDialog.pendingMeta.title}
        description={view.deleteDialog.pendingMeta.description}
        confirmLabel="Delete"
        variant="destructive"
      />
    </AppLayout>
  );
};

export default Payments;
