/* ═══════════════════════════════════════════════════════════════════════════
 * Sidebar — Collapsible side navigation scoped to the active section.
 *
 * All state and route logic lives in useSidebar().
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ─── Hook ──────────────────────────────────────────────────────────────────
import { useSidebar, type NavItem } from "./useSidebar";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Sidebar = () => {
  const { collapsed, toggleCollapsed, navItems, sectionLabel, isActive } = useSidebar();

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] bg-card border-r border-border shadow-md transition-all duration-200 flex flex-col shrink-0",
        collapsed ? "w-[72px]" : "w-60",
      )}
    >
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin" aria-label="Main navigation">
        <SectionLabel label={sectionLabel} collapsed={collapsed} />

        {navItems.map((item) => (
          <SidebarLink
            key={item.title}
            item={item}
            active={isActive(item)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <CollapseToggle collapsed={collapsed} onToggle={toggleCollapsed} />
    </aside>
  );
};

export default Sidebar;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Section Label ─────────────────────────────────────────────────────── */

const SectionLabel = ({ label, collapsed }: { label: string; collapsed: boolean }) => {
  if (collapsed) return null;

  return (
    <div className="px-3 py-2 mb-1">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

/* ─── Sidebar Link ──────────────────────────────────────────────────────── */

const SidebarLink = ({ item, active, collapsed }: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) => {
  const Icon = item.icon;

  const link = (
    <NavLink
      to={item.url}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 group",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon
        className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-muted-foreground")}
        aria-hidden="true"
      />
      {!collapsed && (
        <span className={cn("text-sm", active ? "font-medium text-primary" : "font-normal text-muted-foreground")}>
          {item.title}
        </span>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    );
  }

  return <div>{link}</div>;
};

/* ─── Collapse Toggle ───────────────────────────────────────────────────── */

const CollapseToggle = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => (
  <div className="p-3 border-t border-border/40">
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn("w-full justify-center text-sm", !collapsed && "justify-start")}
    >
      {collapsed
        ? <ChevronRight className="h-4 w-4" />
        : <><ChevronLeft className="h-4 w-4 mr-2" /><span>Collapse</span></>}
    </Button>
  </div>
);
