/* ═══════════════════════════════════════════════════════════════════════════
 * LabServiceGrid — Card-based grid view for lab services.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Calendar, DollarSign, Pencil, Trash2, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/shared/lib/utils";
import type { LabServiceApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

import { PAYMENT_COLORS, STATUS_COLORS } from "../pages/useLabServicesView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface LabServiceGridProps {
  items: LabServiceApi[];
  onEdit: (item: LabServiceApi) => void;
  onDelete: (item: LabServiceApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const LabServiceGrid = ({ items, onEdit, onDelete }: LabServiceGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
    {items.map((item) => (
      <Card
        key={item.id}
        className="group hover-lift hover:shadow-lg transition-all"
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">
                {item.service_title}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {item.service_code}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge
                className={cn("text-xs", STATUS_COLORS[item.status] ?? "")}
              >
                {formatEnumLabel(item.status)}
              </Badge>
              <Badge
                className={cn(
                  "text-xs",
                  PAYMENT_COLORS[item.payment_status] ?? "",
                )}
              >
                {formatEnumLabel(item.payment_status)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{item.client_name}</span>
          </div>
          {item.assigned_staff && item.assigned_staff.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              Staff: {item.assigned_staff.join(", ")}
            </div>
          )}
          {(item.start_date || item.end_date) && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {item.start_date ?? "TBD"} → {item.end_date ?? "Ongoing"}
            </div>
          )}
          {item.service_fee != null && (
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />$
              {item.service_fee.toLocaleString()}
            </div>
          )}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.service_description}
          </p>
          <div className="flex justify-end gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(item)}
              aria-label={`Edit ${item.service_title}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive"
              onClick={() => onDelete(item)}
              aria-label={`Delete ${item.service_title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default LabServiceGrid;
