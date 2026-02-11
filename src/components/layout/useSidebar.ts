/* ═══════════════════════════════════════════════════════════════════════════
 * useSidebar — State + derived data for the sidebar navigation.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Leaf, Sprout, FlaskConical, Wrench,
  ArrowLeftRight, Users, Microscope, TestTubes, BookOpen,
  FileText, TrendingUp, BarChart3, DollarSign, Package,
  Handshake, Receipt,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  matchPaths: string[];
}

// ─── Nav Constants ─────────────────────────────────────────────────────────

const INVENTORY_NAV: NavItem[] = [
  { title: "Dashboard", url: "/inventory", icon: LayoutDashboard, matchPaths: ["/inventory"] },
  { title: "Plant Species", url: "/inventory/plant-species", icon: Leaf, matchPaths: ["/inventory/plant-species", "/inventory/products/species"] },
  { title: "Plant Batches", url: "/inventory/plant-batches", icon: Sprout, matchPaths: ["/inventory/plant-batches", "/inventory/products/batches"] },
  { title: "Chemicals", url: "/inventory/chemicals", icon: FlaskConical, matchPaths: ["/inventory/chemicals", "/inventory/products/chemicals"] },
  { title: "Equipment", url: "/inventory/equipment", icon: Wrench, matchPaths: ["/inventory/equipment", "/inventory/products/equipment"] },
  { title: "Transactions", url: "/inventory/transactions", icon: ArrowLeftRight, matchPaths: ["/inventory/transactions"] },
  { title: "Users", url: "/inventory/users", icon: Users, matchPaths: ["/inventory/users"] },
];

const RESEARCH_NAV: NavItem[] = [
  { title: "Overview", url: "/research", icon: Microscope, matchPaths: ["/research"] },
  { title: "Experiments", url: "/research/experiments", icon: TestTubes, matchPaths: ["/research/experiments"] },
  { title: "Protocols", url: "/research/protocols", icon: BookOpen, matchPaths: ["/research/protocols"] },
  { title: "Lab Notebooks", url: "/research/notebooks", icon: FileText, matchPaths: ["/research/notebooks"] },
  { title: "Data Analysis", url: "/research/analysis", icon: TrendingUp, matchPaths: ["/research/analysis"] },
  { title: "Sample Tracking", url: "/research/samples", icon: Sprout, matchPaths: ["/research/samples"] },
];

const BUSINESS_NAV: NavItem[] = [
  { title: "Overview", url: "/business", icon: BarChart3, matchPaths: ["/business"] },
  { title: "Production Planner", url: "/business/production", icon: Package, matchPaths: ["/business/production"] },
  { title: "Clients", url: "/business/clients", icon: Handshake, matchPaths: ["/business/clients"] },
  { title: "Contracts", url: "/business/contracts", icon: Receipt, matchPaths: ["/business/contracts"] },
  { title: "Payments", url: "/business/payments", icon: DollarSign, matchPaths: ["/business/payments"] },
];

const ROOT_URLS = new Set(["/inventory", "/research", "/business"]);

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const { navItems, sectionLabel } = useMemo(() => {
    if (location.pathname.startsWith("/research"))
      return { navItems: RESEARCH_NAV, sectionLabel: "Research" };
    if (location.pathname.startsWith("/business"))
      return { navItems: BUSINESS_NAV, sectionLabel: "Business" };
    return { navItems: INVENTORY_NAV, sectionLabel: "Inventory" };
  }, [location.pathname]);

  const isActive = useCallback(
    (item: NavItem) =>
      ROOT_URLS.has(item.url)
        ? location.pathname === item.url
        : item.matchPaths.some((p) => location.pathname.startsWith(p)),
    [location.pathname],
  );

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), []);

  return {
    collapsed,
    toggleCollapsed,
    navItems,
    sectionLabel,
    isActive,
  } as const;
}
