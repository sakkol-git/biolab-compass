/**
 * QuickStats — A row of colored stat boxes (used across inventory pages).
 * Each stat is a label/value/color tuple rendered as a compact card.
 */

import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: number | string;
  color: "primary" | "warning" | "destructive" | "muted";
}

interface QuickStatsProps {
  stats: Stat[];
}

const colorMap: Record<Stat["color"], string> = {
  primary: "bg-primary/5 border-primary/10 text-primary",
  warning: "bg-warning/5 border-warning/10 text-warning",
  destructive: "bg-destructive/5 border-destructive/10 text-destructive",
  muted: "bg-muted/30 border-border/50 text-muted-foreground",
};

const QuickStats = ({ stats }: QuickStatsProps) => (
  <div className="flex flex-row gap-4">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className={cn("border rounded-xl p-4 text-center flex-1", colorMap[stat.color])}
      >
        <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
        <p className="text-xs text-muted-foreground/70 mt-1">{stat.label}</p>
      </div>
    ))}
  </div>
);

export { QuickStats, type Stat };
