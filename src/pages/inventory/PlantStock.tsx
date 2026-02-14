/* ═══════════════════════════════════════════════════════════════════════════
 * PlantStock — Plant Stock Management page.
 *
 * All state lives in usePlantStockView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { ProductCard } from "@/components/ui/ProductCard";
import { Pencil, Plus, Sprout, Warehouse } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import EmptyState from "@/components/EmptyState";
import ImageUpload from "@/components/ImageUpload";
import AppLayout from "@/components/layout/AppLayout";
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

// ─── Hook & Types ──────────────────────────────────────────────────────────
import {
    stageStyle,
    usePlantStockView,
    type StockForm,
    type StockItem,
} from "./usePlantStockView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const PlantStock = () => {
  const view = usePlantStockView();
  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={Warehouse}
          title="Plant Stock Management"
          description="Track and manage plant inventory, growth stages, and stock levels"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> Add Stock
            </Button>
          }
        />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search by species, name, or batch ID..."
        >
          <StageFilter
            value={view.stageFilter}
            onChange={view.updateStageFilter}
          />
          <LocationFilter
            locations={view.locations}
            value={view.locationFilter}
            onChange={view.updateLocationFilter}
          />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && (
          <EmptyState
            icon={Warehouse}
            title="No stock entries found"
            description="Try adjusting your search, stage, or location filters."
          />
        )}

        {hasResults && view.viewMode === "grid" && (
          <StockGrid
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
          />
        )}

        {hasResults && view.viewMode === "list" && (
          <StockTable
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
          />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {view.filteredItems.length} of {view.totalCount} stock
            entries
          </p>
        </footer>
      </div>

      <StockFormDialog view={view} />
    </AppLayout>
  );
};

export default PlantStock;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Filter Selects ────────────────────────────────────────────────────── */

const StageFilter = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-40">
      <SelectValue placeholder="All Stages" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Stages</SelectItem>
      <SelectItem value="seed">Seed</SelectItem>
      <SelectItem value="seedling">Seedling</SelectItem>
      <SelectItem value="growing">Growing</SelectItem>
      <SelectItem value="harvested">Harvested</SelectItem>
      <SelectItem value="failed">Failed</SelectItem>
    </SelectContent>
  </Select>
);

const LocationFilter = ({
  locations,
  value,
  onChange,
}: {
  locations: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-48">
      <SelectValue placeholder="All Locations" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Locations</SelectItem>
      {locations.map((loc) => (
        <SelectItem key={loc} value={loc}>
          {loc}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

interface StockListProps {
  items: StockItem[];
  onNavigate: (id: string) => void;
  onEdit: (b: StockItem) => void;
}

const StockGrid = ({ items, onNavigate, onEdit }: StockListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((b) => (
      <StockCard key={b.id} item={b} onNavigate={onNavigate} onEdit={onEdit} />
    ))}
  </div>
);

const StockCard = ({
  item,
  onNavigate,
  onEdit,
}: {
  item: StockItem;
  onNavigate: (id: string) => void;
  onEdit: (b: StockItem) => void;
}) => {
  const navigateToDetail = () => onNavigate(item.id);

  // Build subtitle
  const subtitle = item.species;

  // Build metadata
  const meta = [
    { label: "Qty:", value: item.quantity },
    { label: "Loc:", value: item.location },
  ];

  // Status badge (stage)
  const statusBadge = (
    <span className={stageStyle(item.stage)}>{item.stage}</span>
  );

  // Fallback image content
  const fallbackImage = (
    <Sprout className="h-20 w-20 text-muted-foreground/40" />
  );

  return (
    <ProductCard
      image={item.imageUrl}
      fallbackImage={fallbackImage}
      title={item.commonName}
      subtitle={subtitle}
      id={item.id}
      statusBadge={statusBadge}
      meta={meta}
      onClick={navigateToDetail}
      onEdit={() => onEdit(item)}
      className="aspect-square"
      imageBackgroundColor="bg-muted/30"
    />
  );
};

/* ─── Table View ────────────────────────────────────────────────────────── */

const StockTable = ({ items, onNavigate, onEdit }: StockListProps) => (
  <div className="rounded-xl overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead className="w-24">Stock ID</TableHead>
          <TableHead>Species</TableHead>
          <TableHead>Growth Stage</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((b) => (
          <StockTableRow
            key={b.id}
            item={b}
            onNavigate={onNavigate}
            onEdit={onEdit}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

const StockTableRow = ({
  item,
  onNavigate,
  onEdit,
}: {
  item: StockItem;
  onNavigate: (id: string) => void;
  onEdit: (b: StockItem) => void;
}) => {
  const navigateToDetail = () => onNavigate(item.id);
  const stopAndEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  return (
    <TableRow
      className="cursor-pointer"
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
        <div className="w-10 h-10 overflow-hidden bg-muted/50 flex items-center justify-center rounded-lg">
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.commonName}
            fallback={<Sprout className="h-4 w-4 text-muted-foreground/50" />}
          />
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground/70">
        {item.id}
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-foreground">{item.commonName}</p>
          <p className="text-xs text-muted-foreground/60 italic">
            {item.species}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <span className={stageStyle(item.stage)}>{item.stage}</span>
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {item.quantity.toLocaleString()}
      </TableCell>
      <TableCell className="text-muted-foreground">{item.location}</TableCell>
      <TableCell className="text-muted-foreground">{item.startDate}</TableCell>
      <TableCell className="text-muted-foreground">{item.status}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          aria-label={`Edit stock ${item.id}`}
          onClick={stopAndEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const StockFormDialog = ({
  view,
}: {
  view: ReturnType<typeof usePlantStockView>;
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

        <SpeciesIdentSection
          form={view.form}
          updateField={view.updateFormField}
        />
        <GrowthStatusSection
          form={view.form}
          updateField={view.updateFormField}
        />
        <DatesSection form={view.form} updateField={view.updateFormField} />

        <div className="space-y-2">
          <Label htmlFor="pb-notes">Notes</Label>
          <Textarea
            id="pb-notes"
            placeholder="Stock observations, experiment details, growth notes..."
            value={view.form.notes}
            onChange={(e) => view.updateFormField("notes", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Stock Image</Label>
          <ImageUpload
            value={view.form.imageUrl}
            onChange={(url) => view.updateFormField("imageUrl", url)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button onClick={view.submitStockForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Add Stock"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections ─────────────────────────────────────────────────────── */

type SectionProps = {
  form: StockForm;
  updateField: <K extends keyof StockForm>(
    field: K,
    value: StockForm[K],
  ) => void;
};

const SpeciesIdentSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Sprout className="h-4 w-4 text-muted-foreground/60" /> Species &amp;
      Identification
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="pb-common">Common Name *</Label>
        <Input
          id="pb-common"
          placeholder="e.g., Tomato"
          value={form.commonName}
          onChange={(e) => updateField("commonName", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pb-species">Scientific Name *</Label>
        <Input
          id="pb-species"
          placeholder="e.g., Solanum lycopersicum"
          value={form.species}
          onChange={(e) => updateField("species", e.target.value)}
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="pb-source">Source Material</Label>
        <Input
          id="pb-source"
          placeholder="e.g., Seed lot TM-2024-A (certified)"
          value={form.sourceMaterial}
          onChange={(e) => updateField("sourceMaterial", e.target.value)}
        />
      </div>
    </div>
  </fieldset>
);

const GrowthStatusSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Sprout className="h-4 w-4 text-muted-foreground/60" /> Growth &amp;
      Status
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="pb-stage">Growth Stage *</Label>
        <Select
          value={form.stage}
          onValueChange={(v) => updateField("stage", v)}
        >
          <SelectTrigger id="pb-stage">
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Seed">Seed</SelectItem>
            <SelectItem value="Seedling">Seedling</SelectItem>
            <SelectItem value="Growing">Growing</SelectItem>
            <SelectItem value="Harvested">Harvested</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pb-status">Health Status *</Label>
        <Select
          value={form.status}
          onValueChange={(v) => updateField("status", v)}
        >
          <SelectTrigger id="pb-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Healthy">Healthy</SelectItem>
            <SelectItem value="Dormant">Dormant</SelectItem>
            <SelectItem value="Stressed">Stressed</SelectItem>
            <SelectItem value="Processed">Processed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pb-qty">Quantity *</Label>
        <Input
          id="pb-qty"
          type="number"
          min="0"
          placeholder="e.g., 150"
          value={form.quantity}
          onChange={(e) => updateField("quantity", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pb-health">Health Score (0–100)</Label>
        <Input
          id="pb-health"
          type="number"
          min="0"
          max="100"
          placeholder="e.g., 92"
          value={form.healthScore}
          onChange={(e) => updateField("healthScore", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pb-location">Location *</Label>
        <Input
          id="pb-location"
          placeholder="e.g., Greenhouse A"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pb-assigned">Assigned To</Label>
        <Input
          id="pb-assigned"
          placeholder="e.g., Dr. Sarah Chen"
          value={form.assignedTo}
          onChange={(e) => updateField("assignedTo", e.target.value)}
        />
      </div>
    </div>
  </fieldset>
);

const DatesSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Sprout className="h-4 w-4 text-muted-foreground/60" /> Dates
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="pb-start">Start Date *</Label>
        <Input
          id="pb-start"
          type="date"
          value={form.startDate}
          onChange={(e) => updateField("startDate", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pb-harvest">Expected Harvest Date</Label>
        <Input
          id="pb-harvest"
          type="date"
          value={form.expectedHarvestDate}
          onChange={(e) => updateField("expectedHarvestDate", e.target.value)}
        />
      </div>
    </div>
  </fieldset>
);
