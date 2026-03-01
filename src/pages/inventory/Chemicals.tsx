/* ═══════════════════════════════════════════════════════════════════════════
 * Chemicals — Chemical inventory listing page.
 *
 * All state lives in useChemicalsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    AlertTriangle,
    Beaker,
    FlaskConical,
    MapPin,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";

import EmptyState from "@/components/EmptyState";
import AppLayout from "@/components/layout/AppLayout";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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
import { ProductCard } from "@/components/ui/ProductCard";
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

import {
    CHEMICAL_CATEGORIES,
    DANGER_LEVELS,
    expiryStatus,
    formatDisplayDate,
    formatEnumLabel,
    hazardBackground,
    hazardBadge,
    useChemicalsView,
    type ChemicalForm,
    type ChemicalItem,
} from "./useChemicalsView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Chemicals = () => {
  const view = useChemicalsView();
  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={FlaskConical}
          title="Chemical Inventory"
          description="Track chemicals, reagents, and hazardous materials"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" />
              Add Chemical
            </Button>
          }
        />

        <SafetyAlert
          expiredCount={view.expiredCount}
          expiringSoonCount={view.expiringSoonCount}
        />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search by name, code, or ID..."
        >
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && (
          <EmptyState
            icon={FlaskConical}
            title="No chemicals found"
            description="Try adjusting your search."
          />
        )}

        {hasResults && view.viewMode === "grid" && (
          <ChemicalGrid
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
          />
        )}

        {hasResults && view.viewMode === "list" && (
          <ChemicalTable
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
            onDelete={view.requestDeleteChemical}
          />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {view.filteredItems.length} of {view.totalCount} chemicals
          </p>
        </footer>
      </div>

      <ChemicalFormDialog view={view} />

      <ConfirmDialog
        open={view.deleteDialog.open}
        onOpenChange={view.deleteDialog.setOpen}
        onConfirm={view.confirmDeleteChemical}
        title={view.deleteDialog.pendingMeta.title}
        description={view.deleteDialog.pendingMeta.description}
        confirmLabel="Delete"
        variant="destructive"
      />
    </AppLayout>
  );
};

export default Chemicals;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

const SafetyAlert = ({
  expiredCount,
  expiringSoonCount,
}: {
  expiredCount: number;
  expiringSoonCount: number;
}) => {
  if (expiredCount === 0 && expiringSoonCount === 0) return null;
  return (
    <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
      <div>
        <p className="text-sm font-medium text-destructive">Safety Alert</p>
        <p className="text-sm text-muted-foreground">
          {expiredCount} expired chemical(s) and {expiringSoonCount} item(s)
          expiring within 14 days require attention.
        </p>
      </div>
    </div>
  );
};

/* ─── Grid View ─────────────────────────────────────────────────────────── */

interface ChemicalListProps {
  items: ChemicalItem[];
  onNavigate: (id: number) => void;
  onEdit: (c: ChemicalItem) => void;
  onDelete?: (c: ChemicalItem) => void;
}

const ChemicalGrid = ({ items, onNavigate, onEdit }: ChemicalListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((chem) => (
      <ChemicalCard
        key={chem.id}
        item={chem}
        onNavigate={onNavigate}
        onEdit={onEdit}
      />
    ))}
  </div>
);

const ChemicalCard = ({
  item,
  onNavigate,
  onEdit,
}: {
  item: ChemicalItem;
  onNavigate: (id: number) => void;
  onEdit: (c: ChemicalItem) => void;
}) => {
  const Icon = item.icon;
  const expiry = expiryStatus(item.daysLeft);

  return (
    <ProductCard
      image={item.image_url || undefined}
      fallbackImage={
        <>
          <Icon
            className="h-16 w-16 transition-transform duration-200 group-hover:scale-110"
            style={{ color: item.color }}
            strokeWidth={1.2}
          />
          <span
            className={cn(
              "mt-3 text-xs font-medium px-2 py-1 rounded-lg",
              hazardBadge(item.danger_level),
            )}
          >
            {item.danger_level} hazard
          </span>
        </>
      }
      title={item.common_name}
      subtitle={item.chemical_code || formatEnumLabel(item.category)}
      id={`#${item.id}`}
      statusBadge={
        <span
          className={cn(
            "text-xs font-medium px-2 py-1 rounded-lg",
            expiry.className,
          )}
        >
          {expiry.label}
        </span>
      }
      meta={
        [
          { label: "Qty:", value: item.quantity },
          item.storage_location
            ? { icon: MapPin, value: item.storage_location }
            : null,
          item.expiry_date
            ? { label: "Exp:", value: formatDisplayDate(item.expiry_date) }
            : null,
        ].filter(Boolean) as any
      }
      onClick={() => onNavigate(item.id)}
      onEdit={() => onEdit(item)}
      className="aspect-square"
      imageBackgroundColor={hazardBackground(item.danger_level)}
    />
  );
};

/* ─── Table View ────────────────────────────────────────────────────────── */

const ChemicalTable = ({
  items,
  onNavigate,
  onEdit,
  onDelete,
}: ChemicalListProps) => (
  <div className="rounded-xl overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-center">Danger</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-center">Expiry</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((chem) => {
          const expiry = expiryStatus(chem.daysLeft);
          return (
            <TableRow
              key={chem.id}
              className="cursor-pointer"
              onClick={() => onNavigate(chem.id)}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                #{chem.id}
              </TableCell>
              <TableCell className="font-medium">{chem.common_name}</TableCell>
              <TableCell className="text-sm">
                {formatEnumLabel(chem.category)}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "inline-block px-2 py-1 text-xs font-medium rounded-lg",
                    hazardBadge(chem.danger_level),
                  )}
                >
                  {chem.danger_level}
                </span>
              </TableCell>
              <TableCell className="text-right font-medium">
                {chem.quantity}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "inline-block px-2 py-1 text-xs font-medium rounded-lg",
                    expiry.className,
                  )}
                >
                  {expiry.label}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {chem.storage_location || "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(chem);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(chem);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const ChemicalFormDialog = ({
  view,
}: {
  view: ReturnType<typeof useChemicalsView>;
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

        <IdentitySection form={view.form} updateField={view.updateFormField} />
        <PropertiesSection
          form={view.form}
          updateField={view.updateFormField}
        />
        <SafetySection form={view.form} updateField={view.updateFormField} />

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Chemical description, handling notes..."
            value={view.form.description}
            onChange={(e) =>
              view.updateFormField("description", e.target.value)
            }
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitChemicalForm}
          disabled={!view.canSubmitForm}
        >
          {view.isEditing ? "Save Changes" : "Add Chemical"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections ─────────────────────────────────────────────────────── */

type SectionProps = {
  form: ChemicalForm;
  updateField: <K extends keyof ChemicalForm>(
    field: K,
    value: ChemicalForm[K],
  ) => void;
};

const IdentitySection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Beaker className="h-4 w-4 text-muted-foreground/60" /> Chemical Identity
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 col-span-2">
        <Label>Chemical Name *</Label>
        <Input
          placeholder="e.g., Sodium Hydroxide (NaOH)"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Chemical Code</Label>
        <Input
          placeholder="e.g., CH-001"
          value={form.chemicalCode}
          onChange={(e) => updateField("chemicalCode", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Category *</Label>
        <Select
          value={form.category}
          onValueChange={(v) => updateField("category", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CHEMICAL_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {formatEnumLabel(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </fieldset>
);

const PropertiesSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <FlaskConical className="h-4 w-4 text-muted-foreground/60" /> Properties
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Quantity *</Label>
        <Input
          type="number"
          min="0"
          placeholder="e.g., 500"
          value={form.quantity}
          onChange={(e) => updateField("quantity", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Storage Location</Label>
        <Input
          placeholder="e.g., Cabinet A-1"
          value={form.storageLocation}
          onChange={(e) => updateField("storageLocation", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Expiry Date</Label>
        <Input
          type="date"
          value={form.expiryDate}
          onChange={(e) => updateField("expiryDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          placeholder="https://..."
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
        />
      </div>
    </div>
  </fieldset>
);

const SafetySection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4 text-muted-foreground/60" /> Safety
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Danger Level *</Label>
        <Select
          value={form.dangerLevel}
          onValueChange={(v) => updateField("dangerLevel", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DANGER_LEVELS.map((d) => (
              <SelectItem key={d} value={d}>
                {formatEnumLabel(d)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Safety Measures</Label>
        <Textarea
          placeholder="Safety precautions and handling instructions..."
          value={form.safetyMeasures}
          onChange={(e) => updateField("safetyMeasures", e.target.value)}
          rows={2}
        />
      </div>
    </div>
  </fieldset>
);
