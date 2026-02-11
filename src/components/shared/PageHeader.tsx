/**
 * PageHeader — The icon + title + description + action button header
 * used on every listing page.
 */

import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

const PageHeader = ({ icon: Icon, title, description, actions }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-muted/60 rounded-lg">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-medium text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground/80">{description}</p>
      </div>
    </div>
    {actions}
  </div>
);

export default PageHeader;
