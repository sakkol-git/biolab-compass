/* ═══════════════════════════════════════════════════════════════════════════
 * ProtectedRoute — Route guard based on RBAC permissions.
 *
 * Addresses: BL-003 (RBAC permissions not enforced in UI)
 *
 * Usage in App.tsx:
 *   <Route path="/inventory/users" element={
 *     <ProtectedRoute permission="canManageUsers">
 *       <Users />
 *     </ProtectedRoute>
 *   } />
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useAuth } from "@/hooks/useAuth";
import type { RolePermissions, UserRole } from "@/types/user";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Permission key required to access this route */
  permission?: keyof RolePermissions;
  /** Alternatively, require a specific role */
  requiredRole?: UserRole;
  /** Where to redirect unauthorized users (defaults to /inventory) */
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  permission,
  requiredRole,
  redirectTo = "/inventory",
}: ProtectedRouteProps) {
  const { hasPermission, isRole } = useAuth();

  if (permission && !hasPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && !isRole(requiredRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
