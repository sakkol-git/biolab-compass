import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FlaskConical,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Inventory", path: "/inventory" },
  { icon: FlaskConical, label: "Research", path: "/research" },
  { icon: Briefcase, label: "Business", path: "/business" },
];

/**
 * Bottom navigation bar for mobile screens.
 * Hidden on md+ breakpoints.
 */
const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 md:hidden",
        "flex items-center justify-around",
        "h-16 border-t bg-card/95 backdrop-blur-md",
        "safe-area-inset-bottom"
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <a
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", active && "drop-shadow-sm")} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {active && (
              <span className="absolute top-0 h-0.5 w-8 bg-primary rounded-full" />
            )}
          </a>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
