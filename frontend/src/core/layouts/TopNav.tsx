import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/core/auth/useAuth";
import ThemeToggle from "@/core/theme/ThemeToggle";
import { NotificationPanel } from "@/shared/components/NotificationPanel";
import { cn } from "@/shared/lib/utils";
import {
    BarChart3,
    FlaskConical,
    Menu,
    Microscope,
    Package,
    Plus,
    Sprout,
    User,
    Wrench,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSidebarContext } from "./AppLayout";

const topSections = [
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
    matchPrefix: "/inventory",
  },
  {
    title: "Research",
    url: "/research",
    icon: Microscope,
    matchPrefix: "/research",
  },
  {
    title: "Business",
    url: "/business",
    icon: BarChart3,
    matchPrefix: "/business",
  },
];

const TopNav = () => {
  const { mobileOpen, setMobileOpen } = useSidebarContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-card/90 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 shadow-md">
      {/* Left: Logo + Hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <NavLink to="/" className="flex items-center gap-2.5">
          <img
            src="/favicon.svg"
            alt="Plant Lap Laboratory logo"
            className="w-9 h-9 rounded-lg object-contain shadow-sm"
          />
          <div className="hidden sm:block">
            <span className="font-semibold text-foreground text-base">
              Plant Lap
            </span>
            <span className="font-normal text-muted-foreground text-base ml-1">
              Laboratory
            </span>
          </div>
        </NavLink>
      </div>

      {/* Right: Section Tabs + Actions */}
      <div className="flex items-center gap-4">
        {/* Desktop Section Tabs */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main sections"
        >
          {topSections.map((section) => {
            const isActive = location.pathname.startsWith(section.matchPrefix);
            const Icon = section.icon;
            return (
              <NavLink
                key={section.title}
                to={section.url}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {section.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Section Tabs */}
          <div className="flex md:hidden items-center gap-1">
            {topSections.map((section) => {
              const isActive = location.pathname.startsWith(
                section.matchPrefix,
              );
              const Icon = section.icon;
              return (
                <NavLink
                  key={section.title}
                  to={section.url}
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-lg transition-colors duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-transparent hover:bg-muted text-muted-foreground",
                  )}
                  aria-label={section.title}
                >
                  <Icon className="h-5 w-5" />
                </NavLink>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Quick Create (Phase 3.4.1) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 h-8 hidden sm:inline-flex">
                <Plus className="h-3.5 w-3.5" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/inventory/equipment")}
              >
                <Wrench className="h-4 w-4 mr-2" /> Equipment
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/inventory/chemicals")}
              >
                <FlaskConical className="h-4 w-4 mr-2" /> Chemical
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/inventory/plant-species")}
              >
                <Sprout className="h-4 w-4 mr-2" /> Plant Species
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/research/experiments")}
              >
                <Microscope className="h-4 w-4 mr-2" /> Experiment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications (Phase 11.2 — Dynamic NotificationPanel) */}
          <NotificationPanel />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 px-2.5 h-10"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {user?.name ? (
                    <span className="text-xs font-semibold text-primary">
                      {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  ) : (
                    <User className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {user?.name ?? "Guest"}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {user?.role ?? ""}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name ?? "Guest"}</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    {user?.email ?? ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/inventory/profile")}>
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive font-medium"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
