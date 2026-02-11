/* ═══════════════════════════════════════════════════════════════════════════
 * PlantSpecies — Plant species catalog page.
 *
 * All state lives in usePlantSpeciesView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { Plus, Leaf, ExternalLink, Thermometer, Sprout, Pencil, Ruler, Sun, Droplets } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
import { QuickStats } from "@/components/shared/QuickStats";
import { ViewToggle } from "@/components/shared/ViewToggle";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { ProductCard } from "@/components/ui/ProductCard";
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
  usePlantSpeciesView,
  FAMILY_ICONS,
  type SpeciesItem,
  type SpeciesForm,
} from "./usePlantSpeciesView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const PlantSpecies = () => {
  const view = usePlantSpeciesView();
  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={Leaf}
          title="Plant Species"
          description="Catalog of plant species used in the lab"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> Add Species
            </Button>
          }
        />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search by scientific name, common name, or ID..."
        >
          <FamilyFilter families={view.families} value={view.familyFilter} onChange={view.updateFamilyFilter} />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && <EmptyState icon={Leaf} title="No species found" description="Try adjusting your search query or family filter." />}

        {hasResults && view.viewMode === "grid" && (
          <SpeciesGrid items={view.filteredItems} onNavigate={view.navigateToDetail} onEdit={view.openEditForm} onViewBatches={view.navigateToBatches} />
        )}

        {hasResults && view.viewMode === "list" && (
          <SpeciesTable items={view.filteredItems} onNavigate={view.navigateToDetail} onEdit={view.openEditForm} onViewBatches={view.navigateToBatches} />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {view.filteredItems.length} of {view.totalCount} species</p>
        </footer>
      </div>

      <SpeciesFormDialog view={view} />
    </AppLayout>
  );
};

export default PlantSpecies;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Family Filter ─────────────────────────────────────────────────────── */

const FamilyFilter = ({ families, value, onChange }: { families: string[]; value: string; onChange: (v: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All Families" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Families</SelectItem>
      {families.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

interface SpeciesListProps {
  items: SpeciesItem[];
  onNavigate: (id: string) => void;
  onEdit: (sp: SpeciesItem) => void;
  onViewBatches: (name: string) => void;
}

const SpeciesGrid = ({ items, onNavigate, onEdit, onViewBatches }: SpeciesListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((sp) => <SpeciesCard key={sp.id} item={sp} onNavigate={onNavigate} onEdit={onEdit} onViewBatches={onViewBatches} />)}
  </div>
);

const SpeciesCard = ({ item, onNavigate, onEdit, onViewBatches }: { item: SpeciesItem; onNavigate: (id: string) => void; onEdit: (sp: SpeciesItem) => void; onViewBatches: (name: string) => void }) => {
  const Icon = item.icon;
  const hasActiveBatches = item.activeBatches > 0;

  return (
    <ProductCard
      image={item.imageUrl}
      fallbackImage={
        <>
          <Icon className="h-16 w-16 transition-transform duration-200 group-hover:scale-110" style={{ color: item.color }} strokeWidth={1.2} />
          <span className="mt-3 text-xs font-medium tracking-widest text-muted-foreground">{item.family}</span>
        </>
      }
      title={item.commonName}
      subtitle={item.scientificName}
      id={item.id}
      statusBadge={
        <span className={cn(
          "text-xs font-medium px-2 py-1 tracking-wide rounded-lg",
          hasActiveBatches ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {hasActiveBatches ? `${item.activeBatches} active` : "No batches"}
        </span>
      }
      meta={[
        { icon: Thermometer, value: item.optimalTemp },
        { icon: Sprout, value: item.growthType },
        { icon: Leaf, label: "plants total", value: item.totalPlants.toLocaleString() },
      ]}
      tags={[]}
      onClick={() => onNavigate(item.id)}
      onEdit={() => onEdit(item)}
      imageBackgroundColor={hasActiveBatches ? "bg-primary/5 border-primary/20" : "bg-muted/50"}
      className="aspect-square"
    />
  );
};

const MetaLine = ({ icon: Icon, text }: { icon: typeof Thermometer; text: string }) => (
  <div className="flex items-center gap-1">
    <Icon className="h-3 w-3 text-muted-foreground/50 shrink-0" />
    <span className="text-muted-foreground/70">{text}</span>
  </div>
);

/* ─── Table View ────────────────────────────────────────────────────────── */

const SpeciesTable = ({ items, onNavigate, onEdit, onViewBatches }: SpeciesListProps) => (
  <div className="rounded-lg overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead className="w-24">ID</TableHead>
          <TableHead>Common Name</TableHead>
          <TableHead>Scientific Name</TableHead>
          <TableHead>Family</TableHead>
          <TableHead className="text-center">Growth Type</TableHead>
          <TableHead className="text-center">Active Batches</TableHead>
          <TableHead className="text-center">Total Plants</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((sp) => (
          <SpeciesTableRow key={sp.id} item={sp} onNavigate={onNavigate} onEdit={onEdit} onViewBatches={onViewBatches} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const SpeciesTableRow = ({ item, onNavigate, onEdit, onViewBatches }: { item: SpeciesItem; onNavigate: (id: string) => void; onEdit: (sp: SpeciesItem) => void; onViewBatches: (name: string) => void }) => {
  const navigateToDetail = () => onNavigate(item.id);
  const stopAndEdit = (e: React.MouseEvent) => { e.stopPropagation(); onEdit(item); };
  const stopAndViewBatches = (e: React.MouseEvent) => { e.stopPropagation(); onViewBatches(item.commonName); };
  const hasActiveBatches = item.activeBatches > 0;

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={navigateToDetail} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateToDetail(); } }} role="link" tabIndex={0}>
      <TableCell>
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
          <ImageWithFallback src={item.imageUrl} alt={item.commonName} fallback={<Sprout className="h-4 w-4 text-muted-foreground/50" />} />
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground/70">{item.id}</TableCell>
      <TableCell className="font-medium">{item.commonName}</TableCell>
      <TableCell className="italic text-muted-foreground">{item.scientificName}</TableCell>
      <TableCell>{item.family}</TableCell>
      <TableCell className="text-center">{item.growthType}</TableCell>
      <TableCell className="text-center">
        <span className={cn("inline-block px-2 py-1 text-xs font-medium", hasActiveBatches ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{item.activeBatches}</span>
      </TableCell>
      <TableCell className="text-center font-medium tabular-nums">{item.totalPlants.toLocaleString()}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-xs h-7 px-2 font-medium" onClick={stopAndViewBatches}>
            <ExternalLink className="h-3 w-3" /> Batches
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0" aria-label={`Edit ${item.commonName}`} onClick={stopAndEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const SpeciesFormDialog = ({ view }: { view: ReturnType<typeof usePlantSpeciesView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <p className="text-xs text-muted-foreground"><span className="text-destructive">*</span> indicates a required field</p>

        <BasicInfoSection form={view.form} updateField={view.updateFormField} />
        <GrowthRequirementsSection form={view.form} updateField={view.updateFormField} />
        <PhysicalSection form={view.form} updateField={view.updateFormField} />

        <div className="space-y-2">
          <Label htmlFor="sp-tags">Tags (comma-separated)</Label>
          <Input id="sp-tags" placeholder="e.g., model organism, fruit development, solanaceae" value={view.form.tags} onChange={(e) => view.updateFormField("tags", e.target.value)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitSpeciesForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Add Species"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections ─────────────────────────────────────────────────────── */

type FormSectionProps = {
  form: SpeciesForm;
  updateField: <K extends keyof SpeciesForm>(field: K, value: SpeciesForm[K]) => void;
};

const BasicInfoSection = ({ form, updateField }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Leaf className="h-4 w-4 text-muted-foreground/60" /> Basic Information
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="sp-common">Common Name *</Label>
        <Input id="sp-common" placeholder="e.g., Tomato" value={form.commonName} onChange={(e) => updateField("commonName", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-sci">Scientific Name *</Label>
        <Input id="sp-sci" placeholder="e.g., Solanum lycopersicum" value={form.scientificName} onChange={(e) => updateField("scientificName", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-fam">Family *</Label>
        <Select value={form.family} onValueChange={(v) => updateField("family", v)}>
          <SelectTrigger id="sp-fam"><SelectValue placeholder="Select family" /></SelectTrigger>
          <SelectContent>
            {Object.keys(FAMILY_ICONS).map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-growth">Growth Type *</Label>
        <Select value={form.growthType} onValueChange={(v) => updateField("growthType", v)}>
          <SelectTrigger id="sp-growth"><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Annual">Annual</SelectItem>
            <SelectItem value="Perennial">Perennial</SelectItem>
            <SelectItem value="Biennial">Biennial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-region">Native Region</Label>
        <Input id="sp-region" placeholder="e.g., Western South America" value={form.nativeRegion} onChange={(e) => updateField("nativeRegion", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-prop">Propagation Method</Label>
        <Input id="sp-prop" placeholder="e.g., Seed, Stem Cuttings" value={form.propagation} onChange={(e) => updateField("propagation", e.target.value)} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="sp-desc">Description</Label>
        <Textarea id="sp-desc" placeholder="Brief description of the species and its research use..." value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={3} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Species Image</Label>
        <ImageUpload value={form.imageUrl} onChange={(url) => updateField("imageUrl", url)} />
      </div>
    </div>
  </fieldset>
);

const GrowthRequirementsSection = ({ form, updateField }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Sprout className="h-4 w-4 text-muted-foreground/60" /> Growth Requirements
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="sp-temp">Optimal Temperature *</Label>
        <Input id="sp-temp" placeholder="e.g., 20–25°C" value={form.optimalTemp} onChange={(e) => updateField("optimalTemp", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-hum">Humidity Range</Label>
        <Input id="sp-hum" placeholder="e.g., 50–70%" value={form.humidity} onChange={(e) => updateField("humidity", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-light">Light Requirement</Label>
        <Input id="sp-light" placeholder="e.g., Full Sun (6-8 hrs)" value={form.lightRequirement} onChange={(e) => updateField("lightRequirement", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-water">Water Requirement</Label>
        <Input id="sp-water" placeholder="e.g., Moderate — consistent moisture" value={form.waterRequirement} onChange={(e) => updateField("waterRequirement", e.target.value)} />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="sp-soil">Soil Type</Label>
        <Input id="sp-soil" placeholder="e.g., Well-drained loamy soil, pH 6.0–6.8" value={form.soilType} onChange={(e) => updateField("soilType", e.target.value)} />
      </div>
    </div>
  </fieldset>
);

const PhysicalSection = ({ form, updateField }: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Ruler className="h-4 w-4 text-muted-foreground/60" /> Physical Characteristics
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="sp-maturity">Maturity Days</Label>
        <Input id="sp-maturity" type="number" min="0" placeholder="e.g., 70" value={form.maturityDays} onChange={(e) => updateField("maturityDays", e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-height">Max Height</Label>
        <Input id="sp-height" placeholder="e.g., 1.5–3 m" value={form.maxHeight} onChange={(e) => updateField("maxHeight", e.target.value)} />
      </div>
    </div>
  </fieldset>
);
