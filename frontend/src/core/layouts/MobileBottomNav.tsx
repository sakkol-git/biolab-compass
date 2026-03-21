import { cn } from "@/shared/lib/utils";
import {
    Briefcase,
    FlaskConical,
    LayoutDashboard,
    type LucideIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

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
 * Phase 3.2.1 — Uses React Router NavLink instead of <a> tags.
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
        "safe-area-inset-bottom",
      )}
      role="navigation"
      aria-label="Mobile navigation"
      data-mobile-nav
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors press-effect relative",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("h-5 w-5", active && "drop-shadow-sm")} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {active && (
              <span className="absolute top-0 h-0.5 w-8 bg-primary rounded-full" />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;
