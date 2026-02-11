/**
 * SearchFilter — The search bar + optional selects pattern used on every
 * listing page. Accepts children so each page can slot in its own selects.
 */

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

const SearchFilter = ({
  query,
  onQueryChange,
  placeholder = "Search...",
  children,
}: SearchFilterProps) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="pl-10"
      />
    </div>
    {children}
  </div>
);

export default SearchFilter;
