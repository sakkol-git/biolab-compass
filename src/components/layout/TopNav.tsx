import { Bell, Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopNav = () => {
  return (
    <header className="h-16 border-b-2 border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Logo & System Name */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary border-2 border-border flex items-center justify-center shadow-xs">
          <span className="text-primary-foreground font-bold text-sm tracking-tight">BL</span>
        </div>
        <div className="hidden sm:block">
          <span className="font-bold text-foreground text-lg tracking-tight">Bio-Lab</span>
          <span className="font-medium text-muted-foreground text-lg ml-1">Inventory</span>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-lg mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory, chemicals, equipment..."
            className="pl-11 h-11 bg-background border-2 border-border focus:border-primary focus:shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Search */}
        <Button variant="outline" size="icon" className="md:hidden border-2 h-10 w-10">
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="relative border-2 h-10 w-10">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive border-2 border-card text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-3 px-3 h-10 border-2 hover:shadow-xs transition-shadow">
              <div className="w-7 h-7 bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-foreground leading-tight">Dr. Sarah Chen</p>
                <p className="text-xs text-muted-foreground leading-tight">Lab Manager</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-2 shadow-md">
            <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-medium">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="font-medium">Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive font-semibold">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNav;