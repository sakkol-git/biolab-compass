import { useState } from "react";
import { Plus, Search, Wrench, Check, Clock, AlertCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const equipmentData = [
  { id: "EQ-001", name: "Compound Microscope", category: "Optics", status: "Available", location: "Lab Room 1", lastMaintenance: "Jan 15, 2026" },
  { id: "EQ-002", name: "Autoclave (Large)", category: "Sterilization", status: "Borrowed", location: "Lab Room 2", borrowedBy: "Dr. Park", returnDate: "Feb 10, 2026" },
  { id: "EQ-003", name: "pH Meter", category: "Measurement", status: "Available", location: "Chemistry Lab", lastMaintenance: "Dec 20, 2025" },
  { id: "EQ-004", name: "Centrifuge (High-Speed)", category: "Processing", status: "Maintenance", location: "Service Dept", issue: "Rotor replacement" },
  { id: "EQ-005", name: "Spectrophotometer", category: "Analysis", status: "Available", location: "Lab Room 1", lastMaintenance: "Jan 28, 2026" },
  { id: "EQ-006", name: "Laminar Flow Hood", category: "Sterile Work", status: "Borrowed", location: "Tissue Culture", borrowedBy: "Emily Rodriguez", returnDate: "Feb 08, 2026" },
  { id: "EQ-007", name: "Growth Chamber", category: "Plant Growth", status: "Available", location: "Plant Lab", lastMaintenance: "Feb 01, 2026" },
  { id: "EQ-008", name: "PCR Thermocycler", category: "Molecular Biology", status: "Available", location: "Molecular Lab", lastMaintenance: "Jan 10, 2026" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Available":
      return <Check className="h-4 w-4 text-primary" />;
    case "Borrowed":
      return <Clock className="h-4 w-4 text-warning" />;
    case "Maintenance":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Available":
      return "bg-primary/10 text-primary";
    case "Borrowed":
      return "bg-warning/10 text-warning";
    case "Maintenance":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Equipment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<typeof equipmentData[0] | null>(null);

  const filteredEquipment = equipmentData.filter(
    (eq) =>
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = (equipment: typeof equipmentData[0]) => {
    setSelectedEquipment(equipment);
    setCheckoutOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Equipment Inventory</h1>
              <p className="text-sm text-muted-foreground">
                Track lab equipment and manage checkouts
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Equipment
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-primary">67</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-warning">18</p>
            <p className="text-sm text-muted-foreground">Borrowed</p>
          </div>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold text-destructive">4</p>
            <p className="text-sm text-muted-foreground">Maintenance</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
        </div>

        {/* Data Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Equipment ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((eq) => (
                <TableRow key={eq.id} className="data-table-row">
                  <TableCell className="font-medium text-primary">{eq.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{eq.name}</p>
                      {eq.borrowedBy && (
                        <p className="text-xs text-muted-foreground">
                          Borrowed by {eq.borrowedBy} · Due {eq.returnDate}
                        </p>
                      )}
                      {eq.issue && (
                        <p className="text-xs text-destructive">{eq.issue}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{eq.category}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getStatusStyle(eq.status)
                    )}>
                      {getStatusIcon(eq.status)}
                      {eq.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{eq.location}</TableCell>
                  <TableCell className="text-right">
                    {eq.status === "Available" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCheckout(eq)}
                      >
                        Checkout
                      </Button>
                    )}
                    {eq.status === "Borrowed" && (
                      <Button size="sm" variant="outline">
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout Equipment</DialogTitle>
            <DialogDescription>
              {selectedEquipment && `Reserve ${selectedEquipment.name} for your use.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select User</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
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
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCheckoutOpen(false)}>
              Confirm Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Equipment;
