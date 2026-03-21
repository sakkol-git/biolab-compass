/* ═══════════════════════════════════════════════════════════════════════════
 * LabNotebooks — Digital lab notebook entries.
 *
 * Uses a unique expandable-card layout (not grid/table ListPage).
 * All state lives in useLabNotebooksView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AppLayout from "@/core/layouts/AppLayout";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import EmptyState from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import PageHeader from "@/shared/components/PageHeader";
import { QuickStats } from "@/shared/components/QuickStats";
import SearchFilter from "@/shared/components/SearchFilter";

import NotebookCard from "../components/NotebookCard";
import NotebookFormDialog from "../components/NotebookFormDialog";
import { useLabNotebooksView } from "./useLabNotebooksView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const LabNotebooks = () => {
  const view = useLabNotebooksView();
  const hasResults = view.filteredEntries.length > 0;

  return (
    <AppLayout>
      <div className="page-content">
        <PageHeader
          icon={FileText}
          title="Lab Notebooks"
          description="Digital lab notebook entries, observations, and experimental notes"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> New Entry
            </Button>
          }
        />

        <QuickStats stats={view.summaryStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search entries by title, content, author, or tags…"
        />

        {view.isLoading && (
          <LoadingState variant="skeleton" rows={4} text="Loading entries…" />
        )}

        {view.isError && !view.isLoading && (
          <ErrorState
            message="Failed to load notebook entries"
            onRetry={() => window.location.reload()}
          />
        )}

        {!view.isLoading && !view.isError && !hasResults && (
          <EmptyState
            icon={FileText}
            title="No entries found"
            description="Try adjusting your search or create a new notebook entry."
          />
        )}

        {!view.isLoading && !view.isError && hasResults && (
          <div className="space-y-4">
            {view.filteredEntries.map((nb) => (
              <NotebookCard
                key={nb.id}
                entry={nb}
                isExpanded={view.isExpanded(nb.id)}
                onToggle={() => view.toggleExpansion(nb.id)}
                onEdit={() => view.openEditForm(nb)}
                onToggleLock={() => view.toggleLock(nb)}
                onDelete={() => view.requestDeleteNotebook(nb)}
              />
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Showing {view.filteredEntries.length} of {view.totalCount} entries
        </p>
      </div>

      <NotebookFormDialog view={view} />
      <ConfirmDialog
        dialog={view.deleteDialog}
        onConfirm={view.confirmDeleteNotebook}
        variant="destructive"
      />
    </AppLayout>
  );
};

export default LabNotebooks;
