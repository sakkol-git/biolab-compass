// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY — Pass-through (uses system default error display)
// ═══════════════════════════════════════════════════════════════════════════

import { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Error Boundary Component (Pass-through)
 * Does not catch errors - allows system default error display to show
 *
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return <>{children}</>;
};

export default ErrorBoundary;
