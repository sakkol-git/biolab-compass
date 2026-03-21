/* ═══════════════════════════════════════════════════════════════════════════
 * ChartCard — Shared wrapper for chart panels in GrowthAnalysis.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface ChartCardProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, className, children }: ChartCardProps) => (
  <div
    className={`bg-card rounded-xl p-5 border border-border/60 ${className || ""}`}
  >
    {title && (
      <h3 className="text-sm font-normal text-muted-foreground/70 mb-4">
        {title}
      </h3>
    )}
    {children}
  </div>
);

export default ChartCard;
