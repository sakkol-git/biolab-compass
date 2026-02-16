/* ═══════════════════════════════════════════════════════════════════════════
 * QuantityBadge — Display quantity/amount with units
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

export interface QuantityBadgeProps {
  quantity: number;
  unit: string;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
  showIcon?: boolean;
}

export function QuantityBadge({
  quantity,
  unit,
  className,
  variant = "secondary",
  showIcon = true,
}: QuantityBadgeProps) {
  // Determine variant based on quantity level
  let displayVariant = variant;
  if (variant === "default") {
    if (quantity === 0) {
      displayVariant = "outline";
    } else if (quantity < 10) {
      displayVariant = "warning";
    } else {
      displayVariant = "success";
    }
  }

  const badgeClassName = cn("font-mono font-semibold gap-1", className);

  const variantStyles = {
    default: "",
    secondary: "",
    outline: "border-muted-foreground/20 text-muted-foreground",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700",
    warning:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700",
  };

  return (
    <Badge
      variant={
        displayVariant === "outline"
          ? "outline"
          : displayVariant === "success" || displayVariant === "warning"
            ? "outline"
            : "secondary"
      }
      className={cn(badgeClassName, variantStyles[displayVariant])}
    >
      {showIcon && <Package className="h-3 w-3" />}
      <span>
        {quantity.toLocaleString()} {unit}
      </span>
    </Badge>
  );
}

export default QuantityBadge;
