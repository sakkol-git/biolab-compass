/* ═══════════════════════════════════════════════════════════════════════════
 * PlantSpecies — Plant species catalog page.
 *
 * All state lives in usePlantSpeciesView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import {
    ExternalLink,
    Leaf,
    Pencil,
    Plus,
    Sprout,
    TestTube,
} from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import EmptyState from "@/components/EmptyState";
import ImageUpload from "@/components/ImageUpload";
import AppLayout from "@/components/layout/AppLayout";
import { LoadingState } from "@/components/LoadingState";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import PageHeader from "@/components/shared/PageHeader";
import QuantityBadge from "@/components/shared/QuantityBadge";
import { QuickStats } from "@/components/shared/QuickStats";
import SearchFilter from "@/components/shared/SearchFilter";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { Badge } from "@/components/ui/badge";
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

// ─── Hook & Types ──────────────────────────────────────────────────────────
import {
    FAMILY_ICONS,
    usePlantSpeciesView,
    type SpeciesForm,
    type SpeciesItem,
} from "./usePlantSpeciesView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const PlantSpecies = () => {
  const view = usePlantSpeciesView();
  const hasResults = view.filteredItems.length > 0;

  if (view.isLoading) {
    return (
      <AppLayout>
        <LoadingState text="Loading plant species..." />
      </AppLayout>
    );
  }

  if (view.isError) {
    return (
      <AppLayout>
        <EmptyState
          icon={Leaf}
          title="Failed to load species"
          description="Could not connect to the server. Make sure the backend is running."
        />
      </AppLayout>
    );
  }

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
          <FamilyFilter
            families={view.families}
            value={view.familyFilter}
            onChange={view.updateFamilyFilter}
          />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && (
          <EmptyState
            icon={Leaf}
            title="No species found"
            description="Try adjusting your search query or family filter."
          />
        )}

        {hasResults && view.viewMode === "grid" && (
          <SpeciesGrid
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
            onViewBatches={view.navigateToBatches}
          />
        )}

        {hasResults && view.viewMode === "list" && (
          <SpeciesTable
            items={view.filteredItems}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
            onViewBatches={view.navigateToBatches}
          />
        )}

        <footer className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {view.filteredItems.length} of {view.totalCount} species
          </p>
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

const FamilyFilter = ({
  families,
  value,
  onChange,
}: {
  families: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-48">
      <SelectValue placeholder="All Families" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Families</SelectItem>
      {families.map((f) => (
        <SelectItem key={f} value={f}>
          {f}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

interface SpeciesListProps {
  items: SpeciesItem[];
  onNavigate: (id: number) => void;
  onEdit: (sp: SpeciesItem) => void;
  onViewBatches: (name: string) => void;
}

const SpeciesGrid = ({
  items,
  onNavigate,
  onEdit,
  onViewBatches,
}: SpeciesListProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((sp) => (
      <SpeciesCard
        key={sp.id}
        item={sp}
        onNavigate={onNavigate}
        onEdit={onEdit}
        onViewBatches={onViewBatches}
      />
    ))}
  </div>
);

const SpeciesCard = ({
  item,
  onNavigate,
  onEdit,
  onViewBatches,
}: {
  item: SpeciesItem;
  onNavigate: (id: number) => void;
  onEdit: (sp: SpeciesItem) => void;
  onViewBatches: (name: string) => void;
}) => {
  const Icon = item.icon;
  const varietyCount = item.variety_count ?? 0;
  const sampleCount = item.sample_count ?? 0;
  const hasVarieties = varietyCount > 0;
  const imageUrl = item.image_url;

  return (
    <ProductCard
      image={imageUrl}
      fallbackImage={
        <>
          <Icon
            className="h-16 w-16 transition-transform duration-200 group-hover:scale-110"
            style={{ color: item.color }}
            strokeWidth={1.2}
          />
          <span className="mt-3 text-xs font-medium tracking-widest text-muted-foreground">
            {item.family}
          </span>
        </>
      }
      title={
        item.khmer_name
          ? `${item.common_name} (${item.khmer_name})`
          : item.common_name
      }
      subtitle={item.scientific_name}
      id={String(item.id)}
      statusBadge={
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={hasVarieties ? "default" : "secondary"}
            className="text-xs"
          >
            {varietyCount} {varietyCount === 1 ? "variety" : "varieties"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {sampleCount} {sampleCount === 1 ? "sample" : "samples"}
          </Badge>
        </div>
      }
      meta={[
        { icon: Sprout, value: item.growth_type || "N/A" },
        {
          icon: TestTube,
          label: "units",
          value: (item.total_quantity ?? 0).toLocaleString(),
        },
      ]}
      tags={[]}
      onClick={() => onNavigate(item.id)}
      onEdit={() => onEdit(item)}
      imageBackgroundColor={
        hasVarieties ? "bg-primary/5 border-primary/20" : "bg-muted/50"
      }
      className="aspect-square"
    />
  );
};

/* ─── Table View ────────────────────────────────────────────────────────── */

const SpeciesTable = ({
  items,
  onNavigate,
  onEdit,
  onViewBatches,
}: SpeciesListProps) => (
  <div className="rounded-lg overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Image</TableHead>
          <TableHead className="w-24">Code</TableHead>
          <TableHead>Common Name</TableHead>
          <TableHead>Scientific Name</TableHead>
          <TableHead>Family</TableHead>
          <TableHead className="text-center">Varieties</TableHead>
          <TableHead className="text-center">Samples</TableHead>
          <TableHead className="text-right">Total Qty</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((sp) => (
          <SpeciesTableRow
            key={sp.id}
            item={sp}
            onNavigate={onNavigate}
            onEdit={onEdit}
            onViewBatches={onViewBatches}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

const SpeciesTableRow = ({
  item,
  onNavigate,
  onEdit,
  onViewBatches,
}: {
  item: SpeciesItem;
  onNavigate: (id: number) => void;
  onEdit: (sp: SpeciesItem) => void;
  onViewBatches: (name: string) => void;
}) => {
  const navigateToDetail = () => onNavigate(item.id);
  const stopAndEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };
  const stopAndViewBatches = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewBatches(item.common_name);
  };
  const varietyCount = item.variety_count ?? 0;
  const sampleCount = item.sample_count ?? 0;
  const hasVarieties = varietyCount > 0;
  const imageUrl = item.image_url;

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
            src={imageUrl}
            alt={item.commonName}
            fallback={<Sprout className="h-4 w-4 text-muted-foreground/50" />}
          />
        </div>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground/70">
        #{item.id}
      </TableCell>
      <TableCell className="font-medium">
        {item.common_name}
        {item.khmer_name && (
          <span className="ml-1 text-xs text-muted-foreground">
            ({item.khmer_name})
          </span>
        )}
      </TableCell>
      <TableCell className="italic text-muted-foreground">
        {item.scientific_name}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {item.family}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant={hasVarieties ? "default" : "secondary"}
          className="text-xs"
        >
          {varietyCount}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="outline" className="text-xs">
          {sampleCount}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {(item.total_quantity ?? 0) > 0 ? (
          <QuantityBadge
            quantity={item.total_quantity ?? 0}
            unit="units"
            variant="default"
            showIcon={false}
          />
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        `
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-xs h-7 px-2 font-medium"
            onClick={stopAndViewBatches}
          >
            <ExternalLink className="h-3 w-3" /> Batches
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            aria-label={`Edit ${item.common_name}`}
            onClick={stopAndEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const SpeciesFormDialog = ({
  view,
}: {
  view: ReturnType<typeof usePlantSpeciesView>;
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
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitSpeciesForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isSubmitting
            ? "Saving..."
            : view.isEditing
              ? "Save Changes"
              : "Add Species"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections ─────────────────────────────────────────────────────── */

type FormErrors = Partial<Record<keyof SpeciesForm, string>>;

type FormSectionProps = {
  form: SpeciesForm;
  updateField: <K extends keyof SpeciesForm>(
    field: K,
    value: SpeciesForm[K],
  ) => void;
  errors?: FormErrors;
};

const BasicInfoSection = ({
  form,
  updateField,
  errors = {},
}: FormSectionProps) => (
  <fieldset>
    <legend className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
      <Leaf className="h-4 w-4 text-muted-foreground/60" /> Basic Information
    </legend>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="sp-common">
          Common Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sp-common"
          placeholder="e.g., Tomato"
          value={form.commonName}
          onChange={(e) => updateField("commonName", e.target.value)}
          maxLength={255}
          aria-invalid={!!errors.commonName}
          className={errors.commonName ? "border-destructive" : ""}
        />
        {errors.commonName && (
          <p className="text-xs text-destructive">{errors.commonName}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-khmer">Khmer Name</Label>
        <Input
          id="sp-khmer"
          placeholder="e.g., បេកប៉ោះ"
          value={form.khmerName}
          onChange={(e) => updateField("khmerName", e.target.value)}
          maxLength={255}
          aria-invalid={!!errors.khmerName}
          className={errors.khmerName ? "border-destructive" : ""}
        />
        {errors.khmerName && (
          <p className="text-xs text-destructive">{errors.khmerName}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-sci">
          Scientific Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="sp-sci"
          placeholder="e.g., Solanum lycopersicum"
          value={form.scientificName}
          onChange={(e) => updateField("scientificName", e.target.value)}
          maxLength={255}
          aria-invalid={!!errors.scientificName}
          className={errors.scientificName ? "border-destructive" : ""}
        />
        {errors.scientificName && (
          <p className="text-xs text-destructive">{errors.scientificName}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-fam">Family</Label>
        <Select
          value={form.family}
          onValueChange={(v) => updateField("family", v)}
        >
          <SelectTrigger
            id="sp-fam"
            className={errors.family ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select family" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(FAMILY_ICONS).map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.family && (
          <p className="text-xs text-destructive">{errors.family}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-growth">
          Growth Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.growthType}
          onValueChange={(v) => updateField("growthType", v)}
        >
          <SelectTrigger
            id="sp-growth"
            className={errors.growthType ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="herb">Herb</SelectItem>
            <SelectItem value="shrub">Shrub</SelectItem>
            <SelectItem value="tree">Tree</SelectItem>
            <SelectItem value="vine">Vine</SelectItem>
            <SelectItem value="grass">Grass</SelectItem>
            <SelectItem value="aquatic">Aquatic</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.growthType && (
          <p className="text-xs text-destructive">{errors.growthType}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-region">Native Region</Label>
        <Input
          id="sp-region"
          placeholder="e.g., Western South America"
          value={form.nativeRegion}
          onChange={(e) => updateField("nativeRegion", e.target.value)}
          maxLength={255}
          aria-invalid={!!errors.nativeRegion}
          className={errors.nativeRegion ? "border-destructive" : ""}
        />
        {errors.nativeRegion && (
          <p className="text-xs text-destructive">{errors.nativeRegion}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sp-prop">Propagation Method</Label>
        <Input
          id="sp-prop"
          placeholder="e.g., Seed, Stem Cuttings"
          value={form.propagationMethod}
          onChange={(e) => updateField("propagationMethod", e.target.value)}
          maxLength={255}
          aria-invalid={!!errors.propagationMethod}
          className={errors.propagationMethod ? "border-destructive" : ""}
        />
        {errors.propagationMethod && (
          <p className="text-xs text-destructive">{errors.propagationMethod}</p>
        )}
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="sp-desc">Description</Label>
        <Textarea
          id="sp-desc"
          placeholder="Brief description of the species and its research use..."
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={3}
          aria-invalid={!!errors.description}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>
      <div className="space-y-2 col-span-2">
        <Label>Species Image URL</Label>
        <Input
          id="sp-image-url"
          placeholder="https://example.com/image.jpg"
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
          maxLength={255}
          aria-invalid={!!errors.imageUrl}
          className={errors.imageUrl ? "border-destructive" : ""}
        />
        {errors.imageUrl && (
          <p className="text-xs text-destructive">{errors.imageUrl}</p>
        )}
        {form.imageUrl && !errors.imageUrl && (
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => updateField("imageUrl", url)}
          />
        )}
      </div>
    </div>
  </fieldset>
);
