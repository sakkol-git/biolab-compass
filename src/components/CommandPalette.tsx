/**
 * CommandPalette — Global Cmd+K / Ctrl+K command palette.
 * Provides quick navigation, actions, and theme switching.
 */

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    ArrowLeftRight,
    BarChart3,
    BookOpen,
    DollarSign,
    FileText,
    FlaskConical,
    Handshake,
    LayoutDashboard,
    Leaf,
    Microscope,
    Monitor,
    Moon,
    Package,
    Plus,
    Receipt,
    Sprout,
    Sun,
    TestTubes,
    TrendingUp,
    Users,
    Wrench
} from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CommandAction {
  label: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string;
}

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  // Open with Cmd+K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = useCallback(
    (url: string) => {
      navigate(url);
      setOpen(false);
    },
    [navigate],
  );

  const inventoryPages: CommandAction[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      action: () => go("/inventory"),
      keywords: "home overview",
    },
    {
      label: "Plant Species",
      icon: Leaf,
      action: () => go("/inventory/plant-species"),
      keywords: "plants catalog",
    },
    {
      label: "Plant Stock",
      icon: Sprout,
      action: () => go("/inventory/plant-stock"),
      keywords: "stock batches inventory lots",
    },
    {
      label: "Chemicals",
      icon: FlaskConical,
      action: () => go("/inventory/chemicals"),
      keywords: "reagents media",
    },
    {
      label: "Equipment",
      icon: Wrench,
      action: () => go("/inventory/equipment"),
      keywords: "tools devices",
    },
    {
      label: "Transactions",
      icon: ArrowLeftRight,
      action: () => go("/inventory/transactions"),
      keywords: "history log",
    },
    {
      label: "Users",
      icon: Users,
      action: () => go("/inventory/users"),
      keywords: "team members",
    },
  ];

  const researchPages: CommandAction[] = [
    {
      label: "Research Overview",
      icon: Microscope,
      action: () => go("/research"),
      keywords: "lab",
    },
    {
      label: "Experiments",
      icon: TestTubes,
      action: () => go("/research/experiments"),
      keywords: "trials studies",
    },
    {
      label: "Protocols",
      icon: BookOpen,
      action: () => go("/research/protocols"),
      keywords: "procedures methods",
    },
    {
      label: "Lab Notebooks",
      icon: FileText,
      action: () => go("/research/notebooks"),
      keywords: "notes journal",
    },
    {
      label: "Data Analysis",
      icon: TrendingUp,
      action: () => go("/research/analysis"),
      keywords: "charts graphs",
    },
    {
      label: "Sample Tracking",
      icon: Sprout,
      action: () => go("/research/samples"),
      keywords: "specimens",
    },
  ];

  const businessPages: CommandAction[] = [
    {
      label: "Business Overview",
      icon: BarChart3,
      action: () => go("/business"),
      keywords: "sales revenue",
    },
    {
      label: "Production Planner",
      icon: Package,
      action: () => go("/business/production"),
      keywords: "forecast plan",
    },
    {
      label: "Clients",
      icon: Handshake,
      action: () => go("/business/clients"),
      keywords: "customers contacts",
    },
    {
      label: "Contracts",
      icon: Receipt,
      action: () => go("/business/contracts"),
      keywords: "agreements deals",
    },
    {
      label: "Payments",
      icon: DollarSign,
      action: () => go("/business/payments"),
      keywords: "invoices billing",
    },
  ];

  const themeActions: CommandAction[] = [
    {
      label: "Light Mode",
      icon: Sun,
      action: () => {
        setTheme("light");
        setOpen(false);
      },
      keywords: "theme bright",
    },
    {
      label: "Dark Mode",
      icon: Moon,
      action: () => {
        setTheme("dark");
        setOpen(false);
      },
      keywords: "theme night",
    },
    {
      label: "System Theme",
      icon: Monitor,
      action: () => {
        setTheme("system");
        setOpen(false);
      },
      keywords: "theme auto",
    },
  ];

  const quickActions: CommandAction[] = [
    {
      label: "New Experiment",
      icon: Plus,
      action: () => go("/research/experiments"),
      keywords: "create add",
    },
    {
      label: "Add Species",
      icon: Plus,
      action: () => go("/inventory/plant-species"),
      keywords: "create add plant",
    },
    {
      label: "Add Chemical",
      icon: Plus,
      action: () => go("/inventory/chemicals"),
      keywords: "create add reagent",
    },
    {
      label: "Add Equipment",
      icon: Plus,
      action: () => go("/inventory/equipment"),
      keywords: "create add device",
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          {quickActions.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={item.action}
              keywords={[item.keywords ?? ""]}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Inventory">
          {inventoryPages.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={item.action}
              keywords={[item.keywords ?? ""]}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Research">
          {researchPages.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={item.action}
              keywords={[item.keywords ?? ""]}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Business">
          {businessPages.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={item.action}
              keywords={[item.keywords ?? ""]}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Appearance">
          {themeActions.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={item.action}
              keywords={[item.keywords ?? ""]}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
