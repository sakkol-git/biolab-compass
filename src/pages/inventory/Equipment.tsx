/* ═══════════════════════════════════════════════════════════════════════════
 * Equipment — Inventory listing page.
 *
 * All state lives in useEquipmentView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { ProductCard } from "@/components/ui/ProductCard";
import {
    DollarSign,
    MapPin,
    Pencil,
    Plus,
    Settings,
    Trash2,
    Wrench,
} from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import EmptyState from "@/components/EmptyState";
import ImageUpload from "@/components/ImageUpload";
import AppLayout from "@/components/layout/AppLayout";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import PageHeader from "@/components/shared/PageHeader";
import { QuickStats } from "@/components/shared/QuickStats";
import SearchFilter from "@/components/shared/SearchFilter";
import { ViewToggle } from "@/components/shared/ViewToggle";
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

// ─── Hook & Types ──────────────────────────────────────────────────────────
import {
    conditionBadgeClass,
    EQUIPMENT_CATEGORIES,
    EQUIPMENT_CONDITIONS,
    EQUIPMENT_STATUSES,
    formatEnumLabel,
    statusBadgeClass,
    useEquipmentView,
    type EquipmentForm,
    type EquipmentItem,
} from "./useEquipmentView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Equipment = () => {
  const view = useEquipmentView();

  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={Wrench}
          title="Equipment Inventory"
          description="Track lab equipment and manage availability"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" />
              Add Equipment
            </Button>
          }
        />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search equipment..."
        >
          <StatusFilter
            value={view.statusFilter}
            onChange={view.updateStatusFilter}
          />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {view.isLoading && (
          <p className="text-sm text-muted-foreground text-center py-12">
            Loading equipment…
          </p>
        )}

        {view.isError && (
          <p className="text-sm text-destructive text-center py-12">
            Failed to load equipment. Please try again.
          </p>
        )}

        {!view.isLoading && !view.isError && !hasResults && (
          <EmptyState
            icon={Wrench}
            title="No equipment found"
            description="Try adjusting your search or status filter."
          />
        )}

        {hasResults && view.viewMode === "grid" && (
          <EquipmentGrid
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
            onDelete={view.requestDeleteEquipment}
          />
        )}

        {hasResults && view.viewMode === "list" && (
          <EquipmentTable
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
            onDelete={view.requestDeleteEquipment}
          />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {view.filteredItems.length} of {view.totalCount} equipment
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

      <EquipmentFormDialog view={view} />
      <ConfirmDialog
        open={view.deleteDialog.open}
        onOpenChange={view.deleteDialog.setOpen}
        onConfirm={view.confirmDeleteEquipment}
        title={view.deleteDialog.pendingMeta.title}
        description={view.deleteDialog.pendingMeta.description}
      />
    </AppLayout>
  );
};

export default Equipment;

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
      {EQUIPMENT_STATUSES.map((s) => (
        <SelectItem key={s} value={s}>
          {formatEnumLabel(s)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

interface EquipmentGridProps {
  items: EquipmentItem[];
  onNavigate: (id: number) => void;
  onEdit: (eq: EquipmentItem) => void;
  onDelete: (eq: EquipmentItem) => void;
}

const EquipmentGrid = ({
  items,
  onNavigate,
  onEdit,
  onDelete,
}: EquipmentGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((eq) => (
      <EquipmentCard
        key={eq.id}
        item={eq}
        onNavigate={onNavigate}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

/* ─── Single Equipment Card ─────────────────────────────────────────────── */

interface EquipmentCardProps {
  item: EquipmentItem;
  onNavigate: (id: number) => void;
  onEdit: (eq: EquipmentItem) => void;
  onDelete: (eq: EquipmentItem) => void;
}

const EquipmentCard = ({
  item,
  onNavigate,
  onEdit,
  onDelete,
}: EquipmentCardProps) => {
  const Icon = item.icon;
  const navigateToDetail = () => onNavigate(item.id);

  const subtitle = item.manufacturer
    ? `${item.manufacturer}${item.model_name ? ` — ${item.model_name}` : ""}`
    : undefined;

  const meta = [
    { icon: MapPin, value: item.location || "—" },
    item.is_borrowable && { icon: Wrench, value: "Borrowable" },
  ].filter(Boolean) as { icon: typeof MapPin; value: string }[];

  const statusBadge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg",
        statusBadgeClass(item.status),
      )}
    >
      {formatEnumLabel(item.status)}
    </span>
  );

  const fallbackImage = (
    <>
      <Icon
        className="h-16 w-16 transition-transform duration-200 group-hover:scale-110"
        style={{ color: item.color }}
        strokeWidth={1.2}
      />
      <span className="mt-3 text-xs font-medium tracking-wide text-muted-foreground">
        {formatEnumLabel(item.category)}
      </span>
    </>
  );

  return (
    <div className="relative">
      <ProductCard
        image={item.image_url}
        fallbackImage={fallbackImage}
        title={item.equipment_name}
        subtitle={subtitle}
        id={String(item.id)}
        statusBadge={statusBadge}
        meta={meta}
        onClick={navigateToDetail}
        className="aspect-square"
      />
      <div
        className="absolute bottom-5 left-5 right-5 pt-3 border-t border-border/40 flex items-center gap-2 bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded",
            conditionBadgeClass(item.condition),
          )}
        >
          {formatEnumLabel(item.condition)}
        </span>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 p-0 shrink-0"
          aria-label={`Edit ${item.equipment_name}`}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 p-0 shrink-0 text-destructive hover:text-destructive"
          aria-label={`Delete ${item.equipment_name}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

/* ─── Table View ────────────────────────────────────────────────────────── */

interface EquipmentTableProps {
  items: EquipmentItem[];
  onNavigate: (id: number) => void;
  onEdit: (eq: EquipmentItem) => void;
  onDelete: (eq: EquipmentItem) => void;
}

const EquipmentTable = ({
  items,
  onNavigate,
  onEdit,
  onDelete,
}: EquipmentTableProps) => (
  <div className="rounded-xl overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead className="w-24">Code</TableHead>
          <TableHead>Equipment Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Condition</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((eq) => (
          <EquipmentTableRow
            key={eq.id}
            item={eq}
            onNavigate={onNavigate}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

const EquipmentTableRow = ({
  item,
  onNavigate,
  onEdit,
  onDelete,
}: {
  item: EquipmentItem;
  onNavigate: (id: number) => void;
  onEdit: (eq: EquipmentItem) => void;
  onDelete: (eq: EquipmentItem) => void;
}) => {
  const navigateToDetail = () => onNavigate(item.id);

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={navigateToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigateToDetail();
        }
      }}
      role="link"
      tabIndex={0}
    >
      <TableCell>
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
          <ImageWithFallback
            src={item.image_url}
            alt={item.equipment_name}
            fallback={<Wrench className="h-4 w-4 text-muted-foreground/50" />}
          />
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground/70">
        {item.equipment_code || "—"}
      </TableCell>
      <TableCell className="font-medium text-foreground">
        {item.equipment_name}
      </TableCell>
      <TableCell className="text-muted-foreground/70 text-sm">
        {formatEnumLabel(item.category)}
      </TableCell>
      <TableCell className="text-center">
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg",
            statusBadgeClass(item.status),
          )}
        >
          {formatEnumLabel(item.status)}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <span
          className={cn(
            "text-xs px-2 py-1 rounded",
            conditionBadgeClass(item.condition),
          )}
        >
          {formatEnumLabel(item.condition)}
        </span>
      </TableCell>
      <TableCell className="text-sm">{item.location || "—"}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            aria-label={`Edit ${item.equipment_name}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-destructive hover:text-destructive"
            aria-label={`Delete ${item.equipment_name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const EquipmentFormDialog = ({
  view,
}: {
  view: ReturnType<typeof useEquipmentView>;
}) => (
  <Dialog
    open={view.formOpen}
    onOpenChange={(open) => {
      if (!open) view.closeForm();
    }}
  >
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> indicates a required field
        </p>

        <BasicInfoSection
          form={view.form}
          updateField={view.updateFormField}
          errors={view.formErrors}
        />
        <SpecificationsSection
          form={view.form}
          updateField={view.updateFormField}
          errors={view.formErrors}
        />
        <FinancialSection
          form={view.form}
          updateField={view.updateFormField}
          errors={view.formErrors}
        />

        <div className="space-y-2">
          <Label htmlFor="eq-description">Description</Label>
          <Textarea
            id="eq-description"
            placeholder="Optional description about this equipment..."
            value={view.form.description}
            onChange={(e) =>
              view.updateFormField("description", e.target.value)
            }
            rows={3}
          />
          {view.formErrors.description && (
            <p className="text-xs text-destructive">
              {view.formErrors.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Equipment Image</Label>
          <ImageUpload
            value={view.form.imageUrl}
            onChange={(url) => view.updateFormField("imageUrl", url)}
          />
          {view.formErrors.imageUrl && (
            <p className="text-xs text-destructive">
              {view.formErrors.imageUrl}
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitEquipmentForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isSubmitting
            ? "Saving…"
            : view.isEditing
              ? "Save Changes"
              : "Add Equipment"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections ─────────────────────────────────────────────────────── */

type FormSectionProps = {
  form: EquipmentForm;
  updateField: <K extends keyof EquipmentForm>(
    field: K,
    value: EquipmentForm[K],
  ) => void;
  errors: Partial<Record<keyof EquipmentForm, string>>;
};

const BasicInfoSection = ({ form, updateField, errors }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Wrench className="h-4 w-4 text-muted-foreground/60" />
      Basic Information
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 col-span-2">
        <Label htmlFor="eq-name">Equipment Name *</Label>
        <Input
          id="eq-name"
          placeholder="e.g., Compound Microscope"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-code">Equipment Code</Label>
        <Input
          id="eq-code"
          placeholder="e.g., EQ-001"
          value={form.equipmentCode}
          onChange={(e) => updateField("equipmentCode", e.target.value)}
        />
        {errors.equipmentCode && (
          <p className="text-xs text-destructive">{errors.equipmentCode}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-category">Category *</Label>
        <Select
          value={form.category}
          onValueChange={(v) => updateField("category", v)}
        >
          <SelectTrigger id="eq-category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {formatEnumLabel(cat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-status">Status *</Label>
        <Select
          value={form.status}
          onValueChange={(v) => updateField("status", v)}
        >
          <SelectTrigger id="eq-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {formatEnumLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-xs text-destructive">{errors.status}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-condition">Condition *</Label>
        <Select
          value={form.condition}
          onValueChange={(v) => updateField("condition", v)}
        >
          <SelectTrigger id="eq-condition">
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {formatEnumLabel(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.condition && (
          <p className="text-xs text-destructive">{errors.condition}</p>
        )}
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="eq-location">Location</Label>
        <Input
          id="eq-location"
          placeholder="e.g., Lab Room 1"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
        {errors.location && (
          <p className="text-xs text-destructive">{errors.location}</p>
        )}
      </div>
    </div>
  </fieldset>
);

const SpecificationsSection = ({
  form,
  updateField,
  errors,
}: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Settings className="h-4 w-4 text-muted-foreground/60" />
      Specifications
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="eq-manufacturer">Manufacturer</Label>
        <Input
          id="eq-manufacturer"
          placeholder="e.g., Nikon"
          value={form.manufacturer}
          onChange={(e) => updateField("manufacturer", e.target.value)}
        />
        {errors.manufacturer && (
          <p className="text-xs text-destructive">{errors.manufacturer}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-model">Model</Label>
        <Input
          id="eq-model"
          placeholder="e.g., Eclipse Ei"
          value={form.modelName}
          onChange={(e) => updateField("modelName", e.target.value)}
        />
        {errors.modelName && (
          <p className="text-xs text-destructive">{errors.modelName}</p>
        )}
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="eq-serial">Serial Number</Label>
        <Input
          id="eq-serial"
          placeholder="e.g., NKN-2024-08812"
          value={form.serialNumber}
          onChange={(e) => updateField("serialNumber", e.target.value)}
        />
        {errors.serialNumber && (
          <p className="text-xs text-destructive">{errors.serialNumber}</p>
        )}
      </div>
    </div>
  </fieldset>
);

const FinancialSection = ({ form, updateField, errors }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <DollarSign className="h-4 w-4 text-muted-foreground/60" />
      Financial Information
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="eq-price">Purchase Price</Label>
        <Input
          id="eq-price"
          type="number"
          step="0.01"
          placeholder="e.g., 4200"
          value={form.purchasePrice}
          onChange={(e) => updateField("purchasePrice", e.target.value)}
        />
        {errors.purchasePrice && (
          <p className="text-xs text-destructive">{errors.purchasePrice}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-purchasedate">Purchase Date</Label>
        <Input
          id="eq-purchasedate"
          type="date"
          value={form.purchaseDate}
          onChange={(e) => updateField("purchaseDate", e.target.value)}
        />
        {errors.purchaseDate && (
          <p className="text-xs text-destructive">{errors.purchaseDate}</p>
        )}
      </div>
    </div>
  </fieldset>
);
