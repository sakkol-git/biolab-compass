/* ═══════════════════════════════════════════════════════════════════════════
 * useBorrowRecordsView — All state + logic for the Borrow Records page.
 *
 * Supports: listing, creating (borrow), returning, and viewing overdue.
 * Connects to Laravel backend via React Query + borrowRecordService.
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    useBorrowRecordList,
    useCreateBorrowRecord,
    useReturnBorrowRecord,
} from "@/hooks/useBorrowRecordQuery";
import {
    getErrorMessage,
    isCustomError,
    isValidationError,
} from "@/types/api-error";
import type {
    BorrowPayload,
    BorrowRecordApi,
    ReturnPayload,
} from "@/types/borrow-record";
import {
    BORROW_STATUSES,
    BORROWABLE_TYPES,
    formatEnumLabel,
    type BorrowableType,
} from "@/types/enums";
import { useState } from "react";
import { toast } from "sonner";

// ─── Re-exports ────────────────────────────────────────────────────────────

export { BORROW_STATUSES, BORROWABLE_TYPES, formatEnumLabel };

// ─── Types ─────────────────────────────────────────────────────────────────

export type BorrowItem = BorrowRecordApi;

export type BorrowForm = {
  userId: string;
  borrowableType: string;
  borrowableId: string;
  quantity: string;
  dueAt: string;
  notes: string;
};

export type ReturnForm = {
  notes: string;
};

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_BORROW_FORM: BorrowForm = {
  userId: "",
  borrowableType: "equipment",
  borrowableId: "",
  quantity: "1",
  dueAt: "",
  notes: "",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

export const statusBadgeClass = (status: string): string => {
  switch (status) {
    case "borrowed":
      return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950";
    case "returned":
      return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950";
    case "overdue":
      return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950";
    default:
      return "text-muted-foreground bg-muted";
  }
};

export const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getItemName = (item: BorrowRecordApi["item"]): string => {
  if (!item.data) return `${formatEnumLabel(item.type)} #${item.id}`;
  const data = item.data as unknown as Record<string, unknown>;
  // Try common name fields from different resource types
  return (
    (data.equipment_name as string) ||
    (data.common_name as string) ||
    ((data.identity as Record<string, unknown>)?.name as string) ||
    `${formatEnumLabel(item.type)} #${item.id}`
  );
};

// ─── Backend Error Field Map ────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof BorrowForm> = {
  user_id: "userId",
  borrowable_type: "borrowableType",
  borrowable_id: "borrowableId",
  quantity: "quantity",
  due_at: "dueAt",
  notes: "notes",
};

type FormErrors = Partial<Record<keyof BorrowForm, string>>;

function mapBackendErrors(errors: Record<string, string[]>): FormErrors {
  const mapped: FormErrors = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useBorrowRecordsView() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams: Record<string, unknown> = { page };
  if (searchQuery) queryParams.search = searchQuery;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const {
    data: response,
    isLoading,
    isError,
  } = useBorrowRecordList(queryParams);

  const items: BorrowItem[] = response?.data ?? [];
  const meta = response?.meta;

  // ── Mutations ──
  const createMutation = useCreateBorrowRecord();
  const returnMutation = useReturnBorrowRecord();

  // ── Borrow form state ──
  const [borrowFormOpen, setBorrowFormOpen] = useState(false);
  const [borrowForm, setBorrowForm] = useState<BorrowForm>(EMPTY_BORROW_FORM);
  const [borrowFormErrors, setBorrowFormErrors] = useState<FormErrors>({});

  // ── Return dialog state ──
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [returningItem, setReturningItem] = useState<BorrowItem | null>(null);
  const [returnNotes, setReturnNotes] = useState("");

  const canSubmitBorrow = Boolean(
    borrowForm.userId &&
    borrowForm.borrowableType &&
    borrowForm.borrowableId &&
    Number(borrowForm.quantity) > 0,
  );

  // ── Borrow actions ──
  const openBorrowForm = () => {
    setBorrowForm(EMPTY_BORROW_FORM);
    setBorrowFormErrors({});
    setBorrowFormOpen(true);
  };

  const closeBorrowForm = () => setBorrowFormOpen(false);

  const updateBorrowField = <K extends keyof BorrowForm>(
    field: K,
    value: BorrowForm[K],
  ) => {
    setBorrowForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitBorrow = () => {
    if (!canSubmitBorrow) {
      toast.error("Please fill in all required fields");
      return;
    }
    setBorrowFormErrors({});

    const payload: BorrowPayload = {
      user_id: Number(borrowForm.userId),
      borrowable_type: borrowForm.borrowableType as BorrowableType,
      borrowable_id: Number(borrowForm.borrowableId),
      quantity: Number(borrowForm.quantity),
      due_at: borrowForm.dueAt || null,
      notes: borrowForm.notes || null,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setBorrowFormOpen(false);
        setBorrowForm(EMPTY_BORROW_FORM);
        toast.success("Item borrowed successfully");
      },
      onError: (err) => {
        if (isValidationError(err)) {
          setBorrowFormErrors(mapBackendErrors(err.response.data.errors));
          toast.error(err.response.data.message);
        } else if (isCustomError(err)) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Failed to create borrow record");
        }
      },
    });
  };

  // ── Return actions ──
  const openReturnDialog = (item: BorrowItem) => {
    setReturningItem(item);
    setReturnNotes("");
    setReturnDialogOpen(true);
  };

  const closeReturnDialog = () => {
    setReturnDialogOpen(false);
    setReturningItem(null);
  };

  const submitReturn = () => {
    if (!returningItem) return;

    const payload: ReturnPayload = {
      notes: returnNotes || null,
    };

    returnMutation.mutate(
      { id: returningItem.id, payload },
      {
        onSuccess: () => {
          setReturnDialogOpen(false);
          setReturningItem(null);
          toast.success("Item returned successfully");
        },
        onError: (err) => {
          toast.error(getErrorMessage(err) || "Failed to return item");
        },
      },
    );
  };

  const isSubmitting = createMutation.isPending || returnMutation.isPending;

  return {
    items,
    totalCount: meta?.total ?? items.length,
    searchQuery,
    updateSearchQuery: setSearchQuery,
    statusFilter,
    updateStatusFilter: setStatusFilter,
    // Borrow form
    borrowFormOpen,
    borrowForm,
    borrowFormErrors,
    canSubmitBorrow,
    openBorrowForm,
    closeBorrowForm,
    updateBorrowField,
    submitBorrow,
    // Return dialog
    returnDialogOpen,
    returningItem,
    returnNotes,
    setReturnNotes,
    openReturnDialog,
    closeReturnDialog,
    submitReturn,
    isLoading,
    isError,
    isSubmitting,
    page,
    setPage,
    meta,
  };
}
