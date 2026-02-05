import { Wrench } from "lucide-react";

const EquipmentAvailabilityCard = () => {
  const total = 89;
  const available = 67;
  const borrowed = 18;
  const maintenance = 4;

  const stats = [
    { label: "Available", value: available, color: "bg-primary", textColor: "text-primary", percent: (available / total) * 100 },
    { label: "Borrowed", value: borrowed, color: "bg-warning", textColor: "text-warning", percent: (borrowed / total) * 100 },
    { label: "Maintenance", value: maintenance, color: "bg-muted-foreground/50", textColor: "text-muted-foreground", percent: (maintenance / total) * 100 },
  ];

  return (
    <div className="bg-card border-2 border-border p-6 shadow-sm">
      {/* Header */}
      <div className="section-header">
        <div className="icon-badge-primary">
          <Wrench className="h-5 w-5 text-primary" />
        </div>
        <h3 className="section-title text-foreground">Equipment Availability</h3>
        <span className="ml-auto text-sm font-bold text-muted-foreground tabular-nums">
          {total} total
        </span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="mb-6">
        <div className="h-4 border-2 border-border overflow-hidden flex bg-muted">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`${stat.color} transition-all duration-500 relative group`}
              style={{ width: `${stat.percent}%` }}
            >
              {/* Separator line between segments */}
              {index > 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="border-2 border-border p-4 text-center hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-3 h-3 ${stat.color} border border-border`} />
            </div>
            <p className={`text-2xl font-bold tabular-nums ${stat.textColor}`}>
              {stat.value}
            </p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentAvailabilityCard;