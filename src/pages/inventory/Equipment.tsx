/* ═══════════════════════════════════════════════════════════════════════════
 * Equipment — Inventory listing page.
 *
 * All state lives in useEquipmentView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { Plus, Wrench, MapPin, Clock, Pencil, Settings, DollarSign, Shield, AlertCircle } from "lucide-react";
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
  useEquipmentView,
  statusBadgeStyle,
  statusIconInfo,
  statusBackgroundStyle,
  CATEGORY_ICONS,
  type EquipmentItem,
  type EquipmentForm,
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
          description="Track lab equipment and manage checkouts"
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
          <StatusFilter />
          <CategoryFilter />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && (
          <EmptyState
            icon={Wrench}
            title="No equipment found"
            description="Try adjusting your search, status, or category filters."
          />
        )}

        {hasResults && view.viewMode === "grid" && (
          <EquipmentGrid
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onCheckout={view.openCheckoutDialog}
            onEdit={view.openEditForm}
          />
        )}

        {hasResults && view.viewMode === "list" && (
          <EquipmentTable
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
          />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {view.filteredItems.length} of {view.totalCount} equipment</p>
        </footer>
      </div>

      <EquipmentFormDialog view={view} />
      <CheckoutDialog view={view} />
    </AppLayout>
  );
};

export default Equipment;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS — Small enough to keep in-file, defined below the fold.
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Filter Selects ────────────────────────────────────────────────────── */

const StatusFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40">
      <SelectValue placeholder="All Status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="available">Available</SelectItem>
      <SelectItem value="borrowed">Borrowed</SelectItem>
      <SelectItem value="maintenance">Maintenance</SelectItem>
    </SelectContent>
  </Select>
);

const CategoryFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40">
      <SelectValue placeholder="Category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Categories</SelectItem>
      <SelectItem value="optics">Optics</SelectItem>
      <SelectItem value="measurement">Measurement</SelectItem>
      <SelectItem value="processing">Processing</SelectItem>
      <SelectItem value="analysis">Analysis</SelectItem>
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

interface EquipmentGridProps {
  items: EquipmentItem[];
  onNavigate: (id: string) => void;
  onCheckout: (eq: EquipmentItem) => void;
  onEdit: (eq: EquipmentItem) => void;
}

const EquipmentGrid = ({ items, onNavigate, onCheckout, onEdit }: EquipmentGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((eq) => (
      <EquipmentCard
        key={eq.id}
        item={eq}
        onNavigate={onNavigate}
        onCheckout={onCheckout}
        onEdit={onEdit}
      />
    ))}
  </div>
);

/* ─── Single Equipment Card ─────────────────────────────────────────────── */

interface EquipmentCardProps {
  item: EquipmentItem;
  onNavigate: (id: string) => void;
  onCheckout: (eq: EquipmentItem) => void;
  onEdit: (eq: EquipmentItem) => void;
}

const EquipmentCard = ({ item, onNavigate, onCheckout, onEdit }: EquipmentCardProps) => {
  const Icon = item.icon;
  const status = statusIconInfo(item.status);
  const StatusIcon = status.icon;

  const isAvailable = item.status === "Available";
  const isBorrowed = item.status === "Borrowed";
  const isUnderRepair = item.status === "Maintenance";

  const navigateToDetail = () => onNavigate(item.id);
  const stopAndCheckout = (e: React.MouseEvent) => { e.stopPropagation(); onCheckout(item); };

  // Build subtitle with borrower/issue info
  const subtitle = item.borrowedBy ? `Borrowed by ${item.borrowedBy}` : item.issue || undefined;

  // Build metadata rows
  const meta = [
    { icon: MapPin, value: item.location },
    item.lastMaintenance && { icon: Wrench, value: `Serviced ${item.lastMaintenance}` },
    item.returnDate && { icon: Clock, value: `Due ${item.returnDate}` },
  ].filter(Boolean) as any[];

  // Status badge
  const statusBadge = (
    <span className={cn("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg", statusBadgeStyle(item.status))}>
      <StatusIcon className="h-3.5 w-3.5" />
      {item.status}
    </span>
  );

  // Fallback image content
  const fallbackImage = (
    <>
      <Icon className="h-16 w-16 transition-transform duration-200 group-hover:scale-110" style={{ color: item.color }} strokeWidth={1.2} />
      <span className="mt-3 text-xs font-medium tracking-wide text-muted-foreground">{item.category}</span>
    </>
  );

  return (
    <div className="relative">
      <ProductCard
        image={item.imageUrl}
        fallbackImage={fallbackImage}
        title={item.name}
        subtitle={subtitle}
        id={item.id}
        statusBadge={statusBadge}
        meta={meta}
        onClick={navigateToDetail}
        className="aspect-square"
        imageBackgroundColor={statusBackgroundStyle(item.status)}
      />
      {/* Custom action buttons footer - overlaid over ProductCard footer */}
      <div 
        className="absolute bottom-5 left-5 right-5 pt-3 border-t border-border/40 flex items-center gap-2 bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {isAvailable && <Button size="sm" className="flex-1 text-xs font-medium" onClick={stopAndCheckout}>Checkout</Button>}
        {isBorrowed && <Button size="sm" variant="outline" className="flex-1 text-xs font-medium">Return</Button>}
        {isUnderRepair && <Button size="sm" variant="outline" disabled className="flex-1 text-xs font-medium">Under Repair</Button>}
        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 shrink-0" aria-label={`Edit ${item.name}`} onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

/* ─── Table View ────────────────────────────────────────────────────────── */

interface EquipmentTableProps {
  items: EquipmentItem[];
  onNavigate: (id: string) => void;
  onEdit: (eq: EquipmentItem) => void;
}

const EquipmentTable = ({ items, onNavigate, onEdit }: EquipmentTableProps) => (
  <div className="rounded-xl overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead className="w-24">ID</TableHead>
          <TableHead>Equipment Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Last Maintenance</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((eq) => (
          <EquipmentTableRow key={eq.id} item={eq} onNavigate={onNavigate} onEdit={onEdit} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const EquipmentTableRow = ({ item, onNavigate, onEdit }: { item: EquipmentItem; onNavigate: (id: string) => void; onEdit: (eq: EquipmentItem) => void }) => {
  const { icon: StatusIcon, className: statusClass } = statusIconInfo(item.status);
  const navigateToDetail = () => onNavigate(item.id);
  const stopAndEdit = (e: React.MouseEvent) => { e.stopPropagation(); onEdit(item); };

  const maintenanceDisplay =
    item.status === "Available" || item.status === "Borrowed"
      ? item.lastMaintenance
      : "—";

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={navigateToDetail}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateToDetail(); } }}
      role="link"
      tabIndex={0}
    >
      <TableCell>
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.name}
            fallback={<Wrench className="h-4 w-4 text-muted-foreground/50" />}
          />
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground/70">{item.id}</TableCell>
      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
      <TableCell className="text-muted-foreground/70 text-sm">{item.category}</TableCell>
      <TableCell className="text-center">
        <span className={cn("inline-flex items-center gap-2 px-2 py-1 text-xs font-medium", statusClass)}>
          <StatusIcon className="h-3 w-3" />
          {item.status}
        </span>
      </TableCell>
      <TableCell className="text-sm">{item.location}</TableCell>
      <TableCell className="text-sm">{maintenanceDisplay}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label={`Edit ${item.name}`} onClick={stopAndEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const EquipmentFormDialog = ({ view }: { view: ReturnType<typeof useEquipmentView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> indicates a required field
        </p>

        <BasicInfoSection form={view.form} updateField={view.updateFormField} />
        <SpecificationsSection form={view.form} updateField={view.updateFormField} />
        <FinancialSection form={view.form} updateField={view.updateFormField} />
        <MaintenanceSection form={view.form} updateField={view.updateFormField} />

        {view.showConditionalFields && (
          <ConditionalStatusSection form={view.form} updateField={view.updateFormField} />
        )}

        <div className="space-y-2">
          <Label htmlFor="eq-notes">Notes</Label>
          <Textarea
            id="eq-notes"
            placeholder="Optional notes about this equipment..."
            value={view.form.notes}
            onChange={(e) => view.updateFormField("notes", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Equipment Image</Label>
          <ImageUpload value={view.form.imageUrl} onChange={(url) => view.updateFormField("imageUrl", url)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitEquipmentForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Add Equipment"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections — Each is a self-contained fieldset ─────────────────── */

type FormSectionProps = {
  form: EquipmentForm;
  updateField: <K extends keyof EquipmentForm>(field: K, value: EquipmentForm[K]) => void;
};

const BasicInfoSection = ({ form, updateField }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Wrench className="h-4 w-4 text-muted-foreground/60" />
      Basic Information
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 col-span-2">
        <Label htmlFor="eq-name">Equipment Name *</Label>
        <Input id="eq-name" placeholder="e.g., Compound Microscope" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-category">Category *</Label>
        <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
          <SelectTrigger id="eq-category"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {Object.keys(CATEGORY_ICONS).map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-status">Status *</Label>
        <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
          <SelectTrigger id="eq-status"><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Borrowed">Borrowed</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="eq-location">Location *</Label>
        <Input id="eq-location" placeholder="e.g., Lab Room 1" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const SpecificationsSection = ({ form, updateField }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Settings className="h-4 w-4 text-muted-foreground/60" />
      Specifications
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="eq-manufacturer">Manufacturer</Label>
        <Input id="eq-manufacturer" placeholder="e.g., Nikon" value={form.manufacturer} onChange={(e) => updateField("manufacturer", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-model">Model</Label>
        <Input id="eq-model" placeholder="e.g., Eclipse Ei" value={form.model} onChange={(e) => updateField("model", e.target.value)} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="eq-serial">Serial Number</Label>
        <Input id="eq-serial" placeholder="e.g., NKN-2024-08812" value={form.serialNumber} onChange={(e) => updateField("serialNumber", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const FinancialSection = ({ form, updateField }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <DollarSign className="h-4 w-4 text-muted-foreground/60" />
      Financial Information
    </legend>
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="eq-price">Purchase Price</Label>
        <Input id="eq-price" placeholder="e.g., $4,200" value={form.purchasePrice} onChange={(e) => updateField("purchasePrice", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-purchasedate">Purchase Date</Label>
        <Input id="eq-purchasedate" type="date" value={form.purchaseDate} onChange={(e) => updateField("purchaseDate", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-depreciation">Depreciation Rate</Label>
        <Input id="eq-depreciation" placeholder="e.g., 10%/yr" value={form.depreciationRate} onChange={(e) => updateField("depreciationRate", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const MaintenanceSection = ({ form, updateField }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Shield className="h-4 w-4 text-muted-foreground/60" />
      Maintenance &amp; Warranty
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="eq-maintenance">Last Maintenance</Label>
        <Input id="eq-maintenance" type="date" value={form.lastMaintenance} onChange={(e) => updateField("lastMaintenance", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eq-warranty">Warranty Expiry</Label>
        <Input id="eq-warranty" type="date" value={form.warrantyExpiry} onChange={(e) => updateField("warrantyExpiry", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const ConditionalStatusSection = ({ form, updateField }: FormSectionProps) => {
  const isBorrowed = form.status === "Borrowed";

  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        {isBorrowed
          ? <Clock className="h-4 w-4 text-warning" />
          : <AlertCircle className="h-4 w-4 text-destructive" />}
        {isBorrowed ? "Checkout Details" : "Maintenance Details"}
      </legend>
      <div className="grid grid-cols-2 gap-4">
        {isBorrowed && (
          <>
            <div className="space-y-2">
              <Label htmlFor="eq-borrower">Borrowed By</Label>
              <Input id="eq-borrower" placeholder="e.g., Dr. Park" value={form.borrowedBy} onChange={(e) => updateField("borrowedBy", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eq-return">Return Date</Label>
              <Input id="eq-return" type="date" value={form.returnDate} onChange={(e) => updateField("returnDate", e.target.value)} />
            </div>
          </>
        )}
        {!isBorrowed && (
          <div className="space-y-2 col-span-2">
            <Label htmlFor="eq-issue">Issue Description</Label>
            <Input id="eq-issue" placeholder="e.g., Rotor replacement" value={form.issue} onChange={(e) => updateField("issue", e.target.value)} />
          </div>
        )}
      </div>
    </fieldset>
  );
};

/* ─── Checkout Dialog ───────────────────────────────────────────────────── */

const CheckoutDialog = ({ view }: { view: ReturnType<typeof useEquipmentView> }) => (
  <Dialog open={view.isCheckoutOpen} onOpenChange={(open) => { if (!open) view.closeCheckoutDialog(); }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Checkout Equipment</DialogTitle>
        <DialogDescription>
          {view.checkoutTarget && `Reserve ${view.checkoutTarget.name} for your use.`}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Select User</Label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sarah">Dr. Sarah Chen</SelectItem>
              <SelectItem value="michael">Dr. Michael Park</SelectItem>
              <SelectItem value="emily">Emily Rodriguez</SelectItem>
              <SelectItem value="james">James Wilson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Return Date</Label>
          <Input type="date" />
        </div>
        <div className="space-y-2">
          <Label>Purpose (Optional)</Label>
          <Input placeholder="e.g., Research project, Teaching lab" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeCheckoutDialog}>Cancel</Button>
        <Button onClick={view.closeCheckoutDialog}>Confirm Checkout</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
