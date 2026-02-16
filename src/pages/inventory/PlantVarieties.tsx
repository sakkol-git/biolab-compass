/* ═══════════════════════════════════════════════════════════════════════════
 * PlantVarieties — Plant varieties listing page (sub-level of species).
 *
 * All state lives in usePlantVarietiesView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Leaf, MapPin, Pencil, Plus, Trash2, User } from "lucide-react";

import EmptyState from "@/components/EmptyState";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
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
import { cn } from "@/lib/utils";

import { STATUS_COLORS, usePlantVarietiesView } from "./usePlantVarietiesView";

const PlantVarieties = () => {
  const view = usePlantVarietiesView();
  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={Leaf}
          title="Plant Varieties"
          description="Plant varieties and cultivars under each species"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" />
              Add Variety
            </Button>
          }
        />

        <QuickStats stats={view.stats} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SearchFilter
            query={view.searchQuery}
            onQueryChange={view.setSearchQuery}
            placeholder="Search varieties by name, code, species, owner..."
          />
          <div className="flex items-center gap-2">
            <Select
              value={view.statusFilter}
              onValueChange={view.setStatusFilter}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
                <SelectItem value="Destroyed">Destroyed</SelectItem>
              </SelectContent>
            </Select>
            <ViewToggle current={view.viewMode} onChange={view.setViewMode} />
          </div>
        </div>

        {!hasResults ? (
          <EmptyState
            title="No varieties found"
            description="Try adjusting your search or add a new variety."
          />
        ) : view.viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {view.filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <ProductCard
                  key={item.id}
                  image={item.imageUrl}
                  fallbackImage={
                    <>
                      <Icon
                        className="h-16 w-16 transition-transform duration-200 group-hover:scale-110"
                        style={{ color: "hsl(142, 71%, 45%)" }}
                        strokeWidth={1.2}
                      />
                      <span className="mt-3 text-xs font-medium tracking-widest text-muted-foreground">
                        {item.speciesName}
                      </span>
                    </>
                  }
                  title={item.name}
                  subtitle={item.uniqueCode}
                  id={item.uniqueCode}
                  statusBadge={
                    <Badge
                      className={cn(
                        "text-xs shrink-0",
                        STATUS_COLORS[item.status] ?? "",
                      )}
                    >
                      {item.status}
                    </Badge>
                  }
                  meta={
                    [
                      { label: "Species:", value: item.speciesName },
                      item.ownershipUserName
                        ? {
                            icon: User,
                            value: item.ownershipUserName,
                          }
                        : null,
                      { icon: MapPin, value: item.originLocation },
                    ].filter(Boolean) as any
                  }
                  tags={[]}
                  onClick={() =>
                    view.navigate(`/inventory/plant-varieties/${item.id}`)
                  }
                  onEdit={() => view.openEditForm(item)}
                  imageBackgroundColor="bg-emerald-50 dark:bg-emerald-950/30"
                  className="aspect-square"
                />
              );
            })}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {view.filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">
                      {item.uniqueCode}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs italic">
                      {item.speciesName}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.ownershipUserName ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.originLocation}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          STATUS_COLORS[item.status] ?? "",
                        )}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => view.openEditForm(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => view.handleDelete(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={view.dialogOpen} onOpenChange={view.setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {view.editingId ? "Edit Variety" : "Add New Variety"}
            </DialogTitle>
            <DialogDescription>
              {view.editingId
                ? "Update variety information."
                : "Register a new plant variety."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name *</Label>
              <Input
                value={view.form.name}
                onChange={(e) =>
                  view.setForm({ ...view.form, name: e.target.value })
                }
                placeholder="e.g. Cherry Tomato - Sweet 100"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Species *</Label>
              <Select
                value={view.form.speciesId}
                onValueChange={(v) =>
                  view.setForm({ ...view.form, speciesId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {view.species.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.commonName} ({s.scientificName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Unique Code</Label>
              <Input
                value={view.form.uniqueCode}
                onChange={(e) =>
                  view.setForm({ ...view.form, uniqueCode: e.target.value })
                }
                placeholder="Auto-generated if left blank"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Owner Name</Label>
                <Input
                  value={view.form.ownershipUserName}
                  onChange={(e) =>
                    view.setForm({
                      ...view.form,
                      ownershipUserName: e.target.value,
                    })
                  }
                  placeholder="Owner name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input
                  value={view.form.ownershipDepartment}
                  onChange={(e) =>
                    view.setForm({
                      ...view.form,
                      ownershipDepartment: e.target.value,
                    })
                  }
                  placeholder="Department"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Origin Location *</Label>
              <Input
                value={view.form.originLocation}
                onChange={(e) =>
                  view.setForm({ ...view.form, originLocation: e.target.value })
                }
                placeholder="Province, Country"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date Brought to Lab</Label>
              <Input
                type="date"
                value={view.form.dateBrought}
                onChange={(e) =>
                  view.setForm({ ...view.form, dateBrought: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={view.form.status}
                onValueChange={(v) => view.setForm({ ...view.form, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                  <SelectItem value="Destroyed">Destroyed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={view.form.description}
                onChange={(e) =>
                  view.setForm({ ...view.form, description: e.target.value })
                }
                placeholder="Variety description..."
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={view.form.notes}
                onChange={(e) =>
                  view.setForm({ ...view.form, notes: e.target.value })
                }
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => view.setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={view.handleSave}>
              {view.editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default PlantVarieties;
