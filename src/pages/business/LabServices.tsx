/* ═══════════════════════════════════════════════════════════════════════════
 * LabServices — Lab service requests listing page (Business Module).
 *
 * All state lives in useLabServicesView().
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    Calendar,
    DollarSign,
    Microscope,
    Pencil,
    Plus,
    Trash2,
    User,
} from "lucide-react";

import EmptyState from "@/components/EmptyState";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { QuickStats } from "@/components/shared/QuickStats";
import SearchFilter from "@/components/shared/SearchFilter";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

import {
    PAYMENT_COLORS,
    STATUS_COLORS,
    useLabServicesView,
} from "./useLabServicesView";

const LabServices = () => {
  const view = useLabServicesView();
  const hasResults = view.filteredItems.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={Microscope}
          title="Lab Services"
          description="Manage laboratory service requests from external clients"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" />
              New Service
            </Button>
          }
        />

        <QuickStats stats={view.stats} />

        {/* Revenue Summary */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-lg">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              Total: <strong>${view.totalRevenue.toLocaleString()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-700 dark:text-emerald-300">
              Paid: <strong>${view.paidRevenue.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <SearchFilter
            query={view.searchQuery}
            onQueryChange={view.setSearchQuery}
            placeholder="Search services, clients..."
          />
          <div className="flex items-center gap-2">
            <Select
              value={view.statusFilter}
              onValueChange={view.setStatusFilter}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <ViewToggle current={view.viewMode} onChange={view.setViewMode} />
          </div>
        </div>

        {!hasResults ? (
          <EmptyState
            title="No lab services found"
            description="Try adjusting your search or create a new service."
          />
        ) : view.viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {view.filteredItems.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-semibold">
                        {item.serviceTitle}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {item.serviceCode}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge
                        className={cn(
                          "text-xs",
                          STATUS_COLORS[item.status] ?? "",
                        )}
                      >
                        {item.status}
                      </Badge>
                      <Badge
                        className={cn(
                          "text-xs",
                          PAYMENT_COLORS[item.paymentStatus] ?? "",
                        )}
                      >
                        {item.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{item.clientName}</span>
                  </div>
                  {item.assignedStaff.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      Staff: {item.assignedStaff.join(", ")}
                    </div>
                  )}
                  {(item.startDate || item.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.startDate ?? "TBD"} → {item.endDate ?? "Ongoing"}
                    </div>
                  )}
                  {item.serviceFee != null && (
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      ${item.serviceFee.toLocaleString()}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.serviceDescription}
                  </p>
                  <div className="flex justify-end gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {view.filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">
                      {item.serviceCode}
                    </TableCell>
                    <TableCell className="font-medium text-sm max-w-[200px] truncate">
                      {item.serviceTitle}
                    </TableCell>
                    <TableCell className="text-sm">{item.clientName}</TableCell>
                    <TableCell className="text-xs">
                      {item.assignedStaff.join(", ") || "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.serviceFee != null
                        ? `$${item.serviceFee.toLocaleString()}`
                        : "—"}
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
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs",
                          PAYMENT_COLORS[item.paymentStatus] ?? "",
                        )}
                      >
                        {item.paymentStatus}
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
              {view.editingId ? "Edit Lab Service" : "New Lab Service"}
            </DialogTitle>
            <DialogDescription>
              {view.editingId
                ? "Update service details."
                : "Create a new lab service request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Service Title *</Label>
              <Input
                value={view.form.serviceTitle}
                onChange={(e) =>
                  view.setForm({ ...view.form, serviceTitle: e.target.value })
                }
                placeholder="e.g. Rice Disease Analysis"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Client Name *</Label>
                <Input
                  value={view.form.clientName}
                  onChange={(e) =>
                    view.setForm({ ...view.form, clientName: e.target.value })
                  }
                  placeholder="Client name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Client Contact</Label>
                <Input
                  value={view.form.clientContact}
                  onChange={(e) =>
                    view.setForm({
                      ...view.form,
                      clientContact: e.target.value,
                    })
                  }
                  placeholder="Phone or email"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Service Description *</Label>
              <Textarea
                value={view.form.serviceDescription}
                onChange={(e) =>
                  view.setForm({
                    ...view.form,
                    serviceDescription: e.target.value,
                  })
                }
                rows={3}
                placeholder="Describe what the client needs..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Assigned Staff</Label>
              <Input
                value={view.form.assignedStaff}
                onChange={(e) =>
                  view.setForm({ ...view.form, assignedStaff: e.target.value })
                }
                placeholder="Comma-separated names"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={view.form.startDate}
                  onChange={(e) =>
                    view.setForm({ ...view.form, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={view.form.endDate}
                  onChange={(e) =>
                    view.setForm({ ...view.form, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={view.form.status}
                  onValueChange={(v) =>
                    view.setForm({ ...view.form, status: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Payment Status</Label>
                <Select
                  value={view.form.paymentStatus}
                  onValueChange={(v) =>
                    view.setForm({ ...view.form, paymentStatus: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Service Fee ($)</Label>
              <Input
                type="number"
                value={view.form.serviceFee}
                onChange={(e) =>
                  view.setForm({ ...view.form, serviceFee: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Result Summary</Label>
              <Textarea
                value={view.form.resultSummary}
                onChange={(e) =>
                  view.setForm({ ...view.form, resultSummary: e.target.value })
                }
                rows={2}
                placeholder="Summary of findings (fill after completion)"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea
                value={view.form.notes}
                onChange={(e) =>
                  view.setForm({ ...view.form, notes: e.target.value })
                }
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

export default LabServices;
