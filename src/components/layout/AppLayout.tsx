import { ReactNode, useState, createContext, useContext } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import CommandPalette from "@/components/CommandPalette";
import PageTransition from "@/components/PageTransition";
import MobileBottomNav from "@/components/MobileBottomNav";
import KeyboardShortcutsPanel from "@/components/KeyboardShortcutsPanel";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "next-themes";

interface AppLayoutProps {
  children: ReactNode;
}

// Context to share mobile sidebar state between TopNav and AppLayout
export const SidebarContext = createContext<{
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}>({ mobileOpen: false, setMobileOpen: () => {} });

export const useSidebarContext = () => useContext(SidebarContext);

const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      combo: { key: "b", ctrl: true },
      handler: () => setMobileOpen((prev) => !prev),
      description: "Toggle sidebar",
      group: "View",
    },
    {
      combo: { key: "\\", ctrl: true },
      handler: () => setTheme(theme === "dark" ? "light" : "dark"),
      description: "Toggle dark mode",
      group: "View",
    },
    {
      combo: { key: "?" },
      handler: () => setShortcutsOpen(true),
      description: "Show keyboard shortcuts",
      group: "Navigation",
    },
  ]);

  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className="min-h-screen bg-background">
        {/* Skip link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <CommandPalette />
        <KeyboardShortcutsPanel open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        <TopNav />
        <div className="flex">
          {/* Mobile overlay */}
          {mobileOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar — hidden on mobile unless open */}
          <div
            className={`
              fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] transition-transform duration-200
              lg:relative lg:top-0 lg:z-auto lg:translate-x-0
              ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <Sidebar />
          </div>

          <main
            id="main-content"
            className="flex-1 min-w-0 p-4 sm:p-6 overflow-y-auto h-[calc(100vh-4rem)] pb-20 md:pb-6"
            role="main"
          >
            <PageTransition>{children}</PageTransition>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </SidebarContext.Provider>
  );
};

export default AppLayout;
