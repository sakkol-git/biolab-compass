// ═══════════════════════════════════════════════════════════════════════════
// CLIENT RANKING WIDGET
// A ranked list of top clients by value.
// ═══════════════════════════════════════════════════════════════════════════

import { formatCurrency } from "@/lib/calculator";
import type { ClientRankingWidget } from "../types";

interface ClientRankingRendererProps {
  config: ClientRankingWidget;
}

const ClientRankingRenderer = ({ config }: ClientRankingRendererProps) => (
  <div className="bg-card border border-border shadow-sm p-5 rounded-xl">
    <h3 className="text-sm font-medium text-muted-foreground mb-4">
      {config.title}
    </h3>
    <div className="space-y-3">
      {config.clients.map((client, rank) => (
        <div
          key={client.id}
          className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground w-4">
              #{rank + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {client.companyName}
              </p>
              <p className="text-xs text-muted-foreground">
                {client.clientType} · {client.totalContracts} contracts
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-primary tabular-nums">
            {formatCurrency(client.totalValue)}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default ClientRankingRenderer;
