/* ═══════════════════════════════════════════════════════════════════════════
 * BorrowRecords — Borrow/Return management page.
 *
 * All state lives in useBorrowRecordsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { ArrowLeftRight, Plus, RotateCcw } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import EmptyState from "@/components/EmptyState";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── Hook & Helpers ────────────────────────────────────────────────────────
import {
    BORROW_STATUSES,
    BORROWABLE_TYPES,
    formatDate,
    formatEnumLabel,
    getItemName,
    statusBadgeClass,
    useBorrowRecordsView,
    type BorrowItem,
} from "./useBorrowRecordsView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const BorrowRecords = () => {
  const view = useBorrowRecordsView();

  const hasResults = view.items.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={ArrowLeftRight}
          title="Borrow Records"
          description="Track borrowed items and manage returns"
          actions={
            <Button className="gap-2" onClick={view.openBorrowForm}>
              <Plus className="h-4 w-4" />
              New Borrow
            </Button>
          }
        />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search borrow records..."
        >
          <StatusFilter
            value={view.statusFilter}
            onChange={view.updateStatusFilter}
          />
        </SearchFilter>

        {view.isLoading && (
          <p className="text-sm text-muted-foreground text-center py-12">
            Loading borrow records…
          </p>
        )}

        {view.isError && (
          <p className="text-sm text-destructive text-center py-12">
            Failed to load borrow records. Please try again.
          </p>
        )}

        {!view.isLoading && !view.isError && !hasResults && (
          <EmptyState
            icon={ArrowLeftRight}
            title="No borrow records found"
            description="No items are currently borrowed."
          />
        )}

        {hasResults && (
          <BorrowTable items={view.items} onReturn={view.openReturnDialog} />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {view.items.length} of {view.totalCount} records
          </p>
          {view.meta && view.meta.last_page > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={view.page <= 1}
                onClick={() => view.setPage(view.page - 1)}
              >
                Previous
              </Button>
              <span className="text-xs">
                Page {view.meta.current_page} of {view.meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={view.page >= view.meta.last_page}
                onClick={() => view.setPage(view.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </footer>
      </div>

      <BorrowFormDialog view={view} />
      <ReturnDialog view={view} />
    </AppLayout>
  );
};

export default BorrowRecords;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Status Filter ─────────────────────────────────────────────────────── */

const StatusFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-40">
      <SelectValue placeholder="All Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      {BORROW_STATUSES.map((s) => (
        <SelectItem key={s} value={s}>
          {formatEnumLabel(s)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ─── Table ─────────────────────────────────────────────────────────────── */

const BorrowTable = ({
  items,
  onReturn,
}: {
  items: BorrowItem[];
  onReturn: (item: BorrowItem) => void;
}) => (
  <div className="rounded-xl overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-medium w-24">ID</TableHead>
          <TableHead className="font-medium">User</TableHead>
          <TableHead className="font-medium">Item</TableHead>
          <TableHead className="font-medium">Type</TableHead>
          <TableHead className="font-medium text-center">Qty</TableHead>
          <TableHead className="font-medium text-center">Status</TableHead>
          <TableHead className="font-medium">Borrowed</TableHead>
          <TableHead className="font-medium">Due</TableHead>
          <TableHead className="font-medium">Returned</TableHead>
          <TableHead className="font-medium text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <BorrowRow key={item.id} item={item} onReturn={onReturn} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const BorrowRow = ({
  item,
  onReturn,
}: {
  item: BorrowItem;
  onReturn: (item: BorrowItem) => void;
}) => (
  <TableRow className="transition-colors">
    <TableCell className="font-mono text-xs text-muted-foreground">
      #{item.id}
    </TableCell>
    <TableCell className="text-foreground">
      {item.user?.name ?? "Unknown"}
    </TableCell>
    <TableCell className="max-w-xs truncate" title={getItemName(item.item)}>
      {getItemName(item.item)}
    </TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {formatEnumLabel(item.item.type)}
    </TableCell>
    <TableCell className="text-center tabular-nums">{item.quantity}</TableCell>
    <TableCell className="text-center">
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-lg",
          statusBadgeClass(item.status),
        )}
      >
        {item.is_overdue ? "Overdue" : formatEnumLabel(item.status)}
      </span>
    </TableCell>
    <TableCell className="text-sm">{formatDate(item.borrowed_at)}</TableCell>
    <TableCell className="text-sm">{formatDate(item.due_at)}</TableCell>
    <TableCell className="text-sm">{formatDate(item.returned_at)}</TableCell>
    <TableCell className="text-right">
      {item.status === "borrowed" && (
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={() => onReturn(item)}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Return
        </Button>
      )}
    </TableCell>
  </TableRow>
);

/* ─── Borrow Form Dialog ────────────────────────────────────────────────── */

const BorrowFormDialog = ({
  view,
}: {
  view: ReturnType<typeof useBorrowRecordsView>;
}) => (
  <Dialog
    open={view.borrowFormOpen}
    onOpenChange={(open) => {
      if (!open) view.closeBorrowForm();
    }}
  >
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New Borrow Record</DialogTitle>
        <DialogDescription>
          Record a new item borrow. Select the user, item type, and item.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> indicates a required field
        </p>

        <div className="space-y-2">
          <Label htmlFor="borrow-user">User ID *</Label>
          <Input
            id="borrow-user"
            type="number"
            placeholder="Enter user ID"
            value={view.borrowForm.userId}
            onChange={(e) => view.updateBorrowField("userId", e.target.value)}
          />
          {view.borrowFormErrors.userId && (
            <p className="text-xs text-destructive">
              {view.borrowFormErrors.userId}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="borrow-type">Item Type *</Label>
            <Select
              value={view.borrowForm.borrowableType}
              onValueChange={(v) => view.updateBorrowField("borrowableType", v)}
            >
              <SelectTrigger id="borrow-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {BORROWABLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {formatEnumLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {view.borrowFormErrors.borrowableType && (
              <p className="text-xs text-destructive">
                {view.borrowFormErrors.borrowableType}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrow-item-id">Item ID *</Label>
            <Input
              id="borrow-item-id"
              type="number"
              placeholder="Enter item ID"
              value={view.borrowForm.borrowableId}
              onChange={(e) =>
                view.updateBorrowField("borrowableId", e.target.value)
              }
            />
            {view.borrowFormErrors.borrowableId && (
              <p className="text-xs text-destructive">
                {view.borrowFormErrors.borrowableId}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="borrow-qty">Quantity *</Label>
            <Input
              id="borrow-qty"
              type="number"
              min="1"
              value={view.borrowForm.quantity}
              onChange={(e) =>
                view.updateBorrowField("quantity", e.target.value)
              }
            />
            {view.borrowFormErrors.quantity && (
              <p className="text-xs text-destructive">
                {view.borrowFormErrors.quantity}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrow-due">Due Date</Label>
            <Input
              id="borrow-due"
              type="date"
              value={view.borrowForm.dueAt}
              onChange={(e) => view.updateBorrowField("dueAt", e.target.value)}
            />
            {view.borrowFormErrors.dueAt && (
              <p className="text-xs text-destructive">
                {view.borrowFormErrors.dueAt}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="borrow-notes">Notes</Label>
          <Textarea
            id="borrow-notes"
            placeholder="Optional notes..."
            value={view.borrowForm.notes}
            onChange={(e) => view.updateBorrowField("notes", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeBorrowForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitBorrow}
          disabled={!view.canSubmitBorrow || view.isSubmitting}
        >
          {view.isSubmitting ? "Saving…" : "Record Borrow"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Return Dialog ─────────────────────────────────────────────────────── */

const ReturnDialog = ({
  view,
}: {
  view: ReturnType<typeof useBorrowRecordsView>;
}) => (
  <Dialog
    open={view.returnDialogOpen}
    onOpenChange={(open) => {
      if (!open) view.closeReturnDialog();
    }}
  >
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Return Item</DialogTitle>
        <DialogDescription>
          {view.returningItem && (
            <>
              Confirm return of{" "}
              <strong>{getItemName(view.returningItem.item)}</strong>
              {view.returningItem.user && (
                <> by {view.returningItem.user.name}</>
              )}
              .
            </>
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="return-notes">Notes (optional)</Label>
          <Textarea
            id="return-notes"
            placeholder="e.g., Item returned in good condition"
            value={view.returnNotes}
            onChange={(e) => view.setReturnNotes(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeReturnDialog}>
          Cancel
        </Button>
        <Button onClick={view.submitReturn} disabled={view.isSubmitting}>
          {view.isSubmitting ? "Processing…" : "Confirm Return"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
