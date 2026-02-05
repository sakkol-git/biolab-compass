import { useState } from "react";
import { Plus, Search, FlaskConical, AlertTriangle } from "lucide-react";
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
import { cn } from "@/lib/utils";

const chemicalData = [
  { id: "CH-001", name: "Sodium Hydroxide (NaOH)", cas: "1310-73-2", quantity: "2.5L", expiry: "Feb 12, 2026", daysLeft: 7, hazard: "high", location: "Cabinet A-1" },
  { id: "CH-002", name: "Hydrochloric Acid (HCl)", cas: "7647-01-0", quantity: "1L", expiry: "Feb 18, 2026", daysLeft: 13, hazard: "high", location: "Acid Storage" },
  { id: "CH-003", name: "Ethanol 95%", cas: "64-17-5", quantity: "5L", expiry: "Feb 25, 2026", daysLeft: 20, hazard: "medium", location: "Flammable Cabinet" },
  { id: "CH-004", name: "Agar Powder", cas: "9002-18-0", quantity: "500g", expiry: "Dec 15, 2026", daysLeft: 313, hazard: "low", location: "Dry Storage" },
  { id: "CH-005", name: "Murashige-Skoog Medium", cas: "N/A", quantity: "1kg", expiry: "Aug 30, 2026", daysLeft: 206, hazard: "low", location: "Cold Room" },
  { id: "CH-006", name: "Phosphoric Acid", cas: "7664-38-2", quantity: "500mL", expiry: "Jan 05, 2026", daysLeft: -31, hazard: "high", location: "Acid Storage" },
  { id: "CH-007", name: "Potassium Nitrate", cas: "7757-79-1", quantity: "2kg", expiry: "Oct 20, 2026", daysLeft: 257, hazard: "medium", location: "Chemical Store" },
];

const getHazardStyle = (hazard: string) => {
  switch (hazard) {
    case "high":
      return "hazard-high";
    case "medium":
      return "hazard-medium";
    case "low":
      return "hazard-low";
    default:
      return "";
  }
};

const getExpiryStatus = (daysLeft: number) => {
  if (daysLeft < 0) return { label: "Expired", class: "bg-destructive text-destructive-foreground" };
  if (daysLeft <= 14) return { label: `${daysLeft}d left`, class: "bg-destructive/10 text-destructive" };
  if (daysLeft <= 30) return { label: `${daysLeft}d left`, class: "bg-warning/10 text-warning" };
  return { label: "OK", class: "bg-primary/10 text-primary" };
};

const Chemicals = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChemicals = chemicalData.filter(
    (chem) =>
      chem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chem.cas.includes(searchQuery) ||
      chem.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <FlaskConical className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Chemical Inventory</h1>
              <p className="text-sm text-muted-foreground">
                Track chemicals, reagents, and hazardous materials
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Chemical
          </Button>
        </div>

        {/* Alert Banner */}
        <div className="flex items-center gap-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">Safety Alert</p>
            <p className="text-sm text-muted-foreground">
              1 expired chemical and 2 items expiring within 14 days require attention.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, CAS number, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Hazard Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High Hazard</SelectItem>
              <SelectItem value="medium">Medium Hazard</SelectItem>
              <SelectItem value="low">Low Hazard</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Expiry Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="ok">OK</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chemical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChemicals.map((chemical) => {
            const expiryStatus = getExpiryStatus(chemical.daysLeft);
            return (
              <div
                key={chemical.id}
                className={cn(
                  "bg-background border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer",
                  getHazardStyle(chemical.hazard)
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">{chemical.id}</span>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", expiryStatus.class)}>
                    {expiryStatus.label}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{chemical.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">CAS: {chemical.cas}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">{chemical.quantity}</span>
                  <span className="text-muted-foreground">{chemical.location}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Expires: {chemical.expiry}</span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                    chemical.hazard === "high" && "bg-destructive/10 text-destructive",
                    chemical.hazard === "medium" && "bg-warning/10 text-warning",
                    chemical.hazard === "low" && "bg-primary/10 text-primary"
                  )}>
                    {chemical.hazard} hazard
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Chemicals;
