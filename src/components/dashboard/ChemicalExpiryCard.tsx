import { AlertTriangle, FlaskConical } from "lucide-react";

const expiringChemicals = [
  { name: "Sodium Hydroxide (NaOH)", expiry: "Feb 12, 2026", daysLeft: 7, quantity: "2.5L" },
  { name: "Hydrochloric Acid (HCl)", expiry: "Feb 18, 2026", daysLeft: 13, quantity: "1L" },
  { name: "Ethanol 95%", expiry: "Feb 25, 2026", daysLeft: 20, quantity: "5L" },
];

const ChemicalExpiryCard = () => {
  return (
    <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <FlaskConical className="h-4 w-4 text-destructive" />
          </div>
          <h3 className="font-semibold text-foreground">Chemical Expiry Alerts</h3>
        </div>
        <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
          {expiringChemicals.length} items
        </span>
      </div>

      <div className="space-y-3">
        {expiringChemicals.map((chemical, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border-l-4 border-warning"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{chemical.name}</p>
                <p className="text-xs text-muted-foreground">{chemical.quantity}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-foreground">{chemical.expiry}</p>
              <p className="text-xs text-warning">{chemical.daysLeft} days left</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChemicalExpiryCard;
