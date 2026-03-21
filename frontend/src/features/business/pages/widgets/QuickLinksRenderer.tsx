// ═══════════════════════════════════════════════════════════════════════════
// QUICK LINKS WIDGET
// Navigational cards that link to other business pages.
// ═══════════════════════════════════════════════════════════════════════════

import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { QuickLinksWidget } from "../types";

interface QuickLinksRendererProps {
  config: QuickLinksWidget;
}

const QuickLinksRenderer = ({ config }: QuickLinksRendererProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {config.links.map((link) => (
        <div
          key={link.title}
          onClick={() => navigate(link.url)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(link.url);
            }
          }}
          role="link"
          tabIndex={0}
          className="bg-card border border-border shadow-sm p-4 hover:bg-muted/40 rounded-xl transition-colors cursor-pointer flex items-center gap-3"
        >
          <link.icon className="h-6 w-6 text-primary shrink-0" />
          <div>
            <h4 className="font-medium text-foreground text-sm">{link.title}</h4>
            <p className="text-xs text-muted-foreground">{link.description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
        </div>
      ))}
    </div>
  );
};

export default QuickLinksRenderer;
