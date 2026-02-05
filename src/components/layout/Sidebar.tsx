import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  FlaskConical,
  Wrench,
  ArrowLeftRight,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Plants", url: "/plants", icon: Leaf },
  { title: "Chemicals", url: "/chemicals", icon: FlaskConical },
  { title: "Equipment", url: "/equipment", icon: Wrench },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Users", url: "/users", icon: Users },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] bg-card border-r-2 border-border transition-all duration-200 flex flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.url;
          const Icon = item.icon;

          const linkContent = (
            <NavLink
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-3 border-2 transition-all duration-150 group",
                "animate-slide-in",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-transparent border-transparent hover:border-border hover:bg-muted"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}
              />
              {!collapsed && (
                <span className={cn(
                  "text-sm font-semibold tracking-tight",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}>
                  {item.title}
                </span>
              )}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" className="font-semibold border-2 shadow-sm">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.title}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t-2 border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full justify-center border-2 font-semibold hover:shadow-xs transition-shadow",
            !collapsed && "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs uppercase tracking-wide">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;