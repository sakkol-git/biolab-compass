import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, subtitle, icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn(
      "bg-card border-2 border-border p-5 shadow-sm hover:shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150",
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground tracking-tight tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1 font-medium">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 mt-3 px-2 py-1 text-xs font-bold border-2",
              trend.positive 
                ? "bg-primary/10 text-primary border-primary/30" 
                : "bg-destructive/10 text-destructive border-destructive/30"
            )}>
              {trend.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.positive ? "+" : "-"}{trend.value}% {trend.label}
            </div>
          )}
        </div>
        <div className="icon-badge-primary shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;