import { useNavigate } from "react-router-dom";
import type { QuickLinksWidget } from "../types";

interface QuickLinksRendererProps {
  config: QuickLinksWidget;
}

const QuickLinksRenderer = ({ config }: QuickLinksRendererProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          className="bg-card rounded-xl p-5 border border-border shadow-sm hover:bg-muted/40 transition-all cursor-pointer"
        >
          <link.icon className="h-8 w-8 text-primary mb-3" strokeWidth={1.5} />
          <h4 className="font-medium text-foreground">{link.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
          {link.count !== undefined && (
            <p className="text-lg font-medium text-primary mt-2 tabular-nums">{link.count}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuickLinksRenderer;
