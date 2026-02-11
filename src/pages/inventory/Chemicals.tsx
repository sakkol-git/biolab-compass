/* ═══════════════════════════════════════════════════════════════════════════
 * Chemicals — Chemical inventory listing page.
 *
 * All state lives in useChemicalsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { Plus, FlaskConical, AlertTriangle, MapPin, Pencil, Beaker, Thermometer, Truck, Shield } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
import { QuickStats } from "@/components/shared/QuickStats";
import { ViewToggle } from "@/components/shared/ViewToggle";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Hook & Types ──────────────────────────────────────────────────────────
import {
  useChemicalsView,
  hazardBackground,
  hazardBadge,
  expiryStatus,
  formatDisplayDate,
  type ChemicalItem,
  type ChemicalForm,
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

        <SafetyAlert expiredCount={view.expiredCount} expiringSoonCount={view.expiringSoonCount} />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search by name, CAS number, or ID..."
        >
          <HazardFilter />
          <ExpiryFilter />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && (
          <EmptyState
            icon={FlaskConical}
            title="No chemicals found"
            description="Try adjusting your search, hazard level, or expiry status filters."
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
          />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {view.filteredItems.length} of {view.totalCount} chemicals</p>
        </footer>
      </div>

      <ChemicalFormDialog view={view} />
    </AppLayout>
  );
};

export default Chemicals;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Safety Alert Banner ───────────────────────────────────────────────── */

const SafetyAlert = ({ expiredCount, expiringSoonCount }: { expiredCount: number; expiringSoonCount: number }) => (
  <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
    <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
    <div>
      <p className="text-sm font-medium text-destructive">Safety Alert</p>
      <p className="text-sm text-muted-foreground">
        {expiredCount} expired chemical(s) and {expiringSoonCount} item(s) expiring within 14 days require attention.
      </p>
    </div>
  </div>
);

/* ─── Filter Selects ────────────────────────────────────────────────────── */

const HazardFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Hazard Level" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Levels</SelectItem>
      <SelectItem value="high">High Hazard</SelectItem>
      <SelectItem value="medium">Medium Hazard</SelectItem>
      <SelectItem value="low">Low Hazard</SelectItem>
    </SelectContent>
  </Select>
);

const ExpiryFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Expiry Status" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="expired">Expired</SelectItem>
      <SelectItem value="expiring">Expiring Soon</SelectItem>
      <SelectItem value="ok">OK</SelectItem>
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

interface ChemicalGridProps {
  items: ChemicalItem[];
  onNavigate: (id: string) => void;
  onEdit: (c: ChemicalItem) => void;
}

const ChemicalGrid = ({ items, onNavigate, onEdit }: ChemicalGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((chem) => (
      <ChemicalCard key={chem.id} item={chem} onNavigate={onNavigate} onEdit={onEdit} />
    ))}
  </div>
);

/* ─── Single Chemical Card ──────────────────────────────────────────────── */

const ChemicalCard = ({ item, onNavigate, onEdit }: { item: ChemicalItem; onNavigate: (id: string) => void; onEdit: (c: ChemicalItem) => void }) => {
  const Icon = item.icon;
  const expiry = expiryStatus(item.daysLeft);
  const navigateToDetail = () => onNavigate(item.id);

  // Build subtitle
  const subtitle = `CAS: ${item.cas}`;

  // Build metadata
  const meta = [
    { label: "Qty:", value: item.quantity },
    { icon: MapPin, value: item.location },
    { label: "Exp:", value: formatDisplayDate(item.expiry) },
  ];

  // Status badge (expiry status)
  const statusBadge = (
    <span className={cn("text-xs font-medium px-2 py-1 rounded-lg", expiry.className)}>
      {expiry.label}
    </span>
  );

  // Fallback image content
  const fallbackImage = (
    <>
      <Icon className="h-16 w-16 transition-transform duration-200 group-hover:scale-110" style={{ color: item.color }} strokeWidth={1.2} />
      <span className={cn("mt-3 text-xs font-medium px-2 py-1 rounded-lg", hazardBadge(item.hazard))}>{item.hazard} hazard</span>
    </>
  );

  return (
    <ProductCard
      image={item.imageUrl}
      fallbackImage={fallbackImage}
      title={item.name}
      subtitle={subtitle}
      id={item.id}
      statusBadge={statusBadge}
      meta={meta}
      onClick={navigateToDetail}
      onEdit={() => onEdit(item)}
      className="aspect-square"
      imageBackgroundColor={hazardBackground(item.hazard)}
    />
  );
};

/* ─── Table View ────────────────────────────────────────────────────────── */

const ChemicalTable = ({ items, onNavigate, onEdit }: ChemicalGridProps) => (
  <div className="rounded-xl overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead className="w-24">ID</TableHead>
          <TableHead>Chemical Name</TableHead>
          <TableHead>CAS Number</TableHead>
          <TableHead className="text-center">Hazard Level</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-center">Expiry Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((chem) => (
          <ChemicalTableRow key={chem.id} item={chem} onNavigate={onNavigate} onEdit={onEdit} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const ChemicalTableRow = ({ item, onNavigate, onEdit }: { item: ChemicalItem; onNavigate: (id: string) => void; onEdit: (c: ChemicalItem) => void }) => {
  const expiry = expiryStatus(item.daysLeft);
  const navigateToDetail = () => onNavigate(item.id);
  const stopAndEdit = (e: React.MouseEvent) => { e.stopPropagation(); onEdit(item); };

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={navigateToDetail}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateToDetail(); } }}
      role="link"
      tabIndex={0}
    >
      <TableCell>
        <div className="w-10 h-10 overflow-hidden bg-muted/50 flex items-center justify-center rounded-lg">
          <ImageWithFallback src={item.imageUrl} alt={item.name} fallback={<FlaskConical className="h-4 w-4 text-muted-foreground/50" />} />
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground/70">{item.id}</TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-muted-foreground text-sm">{item.cas}</TableCell>
      <TableCell className="text-center">
        <span className={cn("inline-block px-2 py-1 text-xs font-medium rounded-lg", hazardBadge(item.hazard))}>{item.hazard}</span>
      </TableCell>
      <TableCell className="text-center font-medium">{item.quantity}</TableCell>
      <TableCell className="text-center">
        <span className={cn("inline-block px-2 py-1 text-xs font-medium rounded-lg", expiry.className)}>{expiry.label}</span>
      </TableCell>
      <TableCell className="text-sm">{item.location}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label={`Edit ${item.name}`} onClick={stopAndEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const ChemicalFormDialog = ({ view }: { view: ReturnType<typeof useChemicalsView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <p className="text-xs text-muted-foreground"><span className="text-destructive">*</span> indicates a required field</p>

        <IdentitySection form={view.form} updateField={view.updateFormField} />
        <PropertiesSection form={view.form} updateField={view.updateFormField} />
        <StorageSection form={view.form} updateField={view.updateFormField} />
        <SafetySection form={view.form} updateField={view.updateFormField} />
        <SupplierSection form={view.form} updateField={view.updateFormField} />
        <DatesSection form={view.form} updateField={view.updateFormField} />

        <div className="space-y-2">
          <Label htmlFor="ch-notes">Notes</Label>
          <Textarea id="ch-notes" placeholder="Safety notes, handling instructions..." value={view.form.notes} onChange={(e) => view.updateFormField("notes", e.target.value)} rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Chemical Image</Label>
          <ImageUpload value={view.form.imageUrl} onChange={(url) => view.updateFormField("imageUrl", url)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitChemicalForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Add Chemical"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections ─────────────────────────────────────────────────────── */

type SectionProps = {
  form: ChemicalForm;
  updateField: <K extends keyof ChemicalForm>(field: K, value: ChemicalForm[K]) => void;
};

const IdentitySection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Beaker className="h-4 w-4 text-muted-foreground/60" /> Chemical Identity
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 col-span-2">
        <Label htmlFor="ch-name">Chemical Name *</Label>
        <Input id="ch-name" placeholder="e.g., Sodium Hydroxide (NaOH)" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-cas">CAS Number</Label>
        <Input id="ch-cas" placeholder="e.g., 1310-73-2" value={form.cas} onChange={(e) => updateField("cas", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-lot">Lot Number</Label>
        <Input id="ch-lot" placeholder="e.g., LOT-2024-A1" value={form.lotNumber} onChange={(e) => updateField("lotNumber", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const PropertiesSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <FlaskConical className="h-4 w-4 text-muted-foreground/60" /> Chemical Properties
    </legend>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ch-conc">Concentration</Label>
        <Input id="ch-conc" placeholder="e.g., 1 M, 95%" value={form.concentration} onChange={(e) => updateField("concentration", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-mw">Molecular Weight</Label>
        <Input id="ch-mw" placeholder="e.g., 40.00 g/mol" value={form.molecularWeight} onChange={(e) => updateField("molecularWeight", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-purity">Purity</Label>
        <Input id="ch-purity" placeholder="e.g., ≥97%" value={form.purity} onChange={(e) => updateField("purity", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const StorageSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Thermometer className="h-4 w-4 text-muted-foreground/60" /> Quantity &amp; Storage
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ch-qty">Quantity *</Label>
        <Input id="ch-qty" placeholder="e.g., 2.5L, 500g" value={form.quantity} onChange={(e) => updateField("quantity", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-loc">Storage Location *</Label>
        <Input id="ch-loc" placeholder="e.g., Cabinet A-1" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-stemp">Storage Temperature</Label>
        <Input id="ch-stemp" placeholder="e.g., 15–25°C (RT)" value={form.storageTemp} onChange={(e) => updateField("storageTemp", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-scond">Storage Conditions</Label>
        <Input id="ch-scond" placeholder="e.g., Keep sealed, dry" value={form.storageConditions} onChange={(e) => updateField("storageConditions", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const SafetySection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Shield className="h-4 w-4 text-destructive" /> Safety &amp; Hazard
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ch-hazard">Hazard Level *</Label>
        <Select value={form.hazard} onValueChange={(v) => updateField("hazard", v)}>
          <SelectTrigger id="ch-hazard"><SelectValue placeholder="Select hazard" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-safety">Safety Classification</Label>
        <Input id="ch-safety" placeholder="e.g., Corrosive" value={form.safetyClass} onChange={(e) => updateField("safetyClass", e.target.value)} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="ch-ghs">GHS Pictograms (comma-separated)</Label>
        <Input id="ch-ghs" placeholder="e.g., GHS05, GHS07" value={form.ghs} onChange={(e) => updateField("ghs", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const SupplierSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Truck className="h-4 w-4 text-muted-foreground/60" /> Supplier Information
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ch-supplier">Supplier</Label>
        <Input id="ch-supplier" placeholder="e.g., Sigma-Aldrich" value={form.supplier} onChange={(e) => updateField("supplier", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-catalog">Supplier Catalog #</Label>
        <Input id="ch-catalog" placeholder="e.g., S8045-500G" value={form.supplierCatalog} onChange={(e) => updateField("supplierCatalog", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const DatesSection = ({ form, updateField }: SectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <AlertTriangle className="h-4 w-4 text-warning" /> Dates
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="ch-received">Date Received</Label>
        <Input id="ch-received" type="date" value={form.dateReceived} onChange={(e) => updateField("dateReceived", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ch-expiry">Expiry Date *</Label>
        <Input id="ch-expiry" type="date" value={form.expiry} onChange={(e) => updateField("expiry", e.target.value)} />
      </div>
    </div>
  </fieldset>
);
