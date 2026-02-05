import { Wrench } from "lucide-react";

const EquipmentAvailabilityCard = () => {
  const total = 89;
  const available = 67;
  const borrowed = 18;
  const maintenance = 4;

  const availablePercent = (available / total) * 100;
  const borrowedPercent = (borrowed / total) * 100;
  const maintenancePercent = (maintenance / total) * 100;

  return (
    <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Wrench className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Equipment Availability</h3>
      </div>

      {/* Stacked Bar */}
      <div className="mb-4">
        <div className="h-4 rounded-full overflow-hidden flex bg-muted">
          <div
            className="bg-primary transition-all duration-500"
            style={{ width: `${availablePercent}%` }}
          />
          <div
            className="bg-warning transition-all duration-500"
            style={{ width: `${borrowedPercent}%` }}
          />
          <div
            className="bg-muted-foreground/30 transition-all duration-500"
            style={{ width: `${maintenancePercent}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xl font-semibold text-primary">{available}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-warning">{borrowed}</p>
          <p className="text-xs text-muted-foreground">Borrowed</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-muted-foreground">{maintenance}</p>
          <p className="text-xs text-muted-foreground">Maintenance</p>
        </div>
      </div>
    </div>
  );
};

export default EquipmentAvailabilityCard;
