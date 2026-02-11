/* ═══════════════════════════════════════════════════════════════════════════
 * Users — Lab member management and access permissions.
 *
 * Single useState (search). Decomposed into named sub-components.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { useState } from "react";
import { Plus, Users as UsersIcon, Shield, User, GraduationCap } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

interface LabUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive";
  lastActive: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const USERS_DATA: LabUser[] = [
  { id: "U-001", name: "Dr. Sarah Chen", email: "sarah.chen@university.edu", role: "Lab Manager", department: "Agricultural Sciences", status: "Active", lastActive: "2 mins ago" },
  { id: "U-002", name: "Dr. Michael Park", email: "m.park@university.edu", role: "Professor", department: "Plant Biology", status: "Active", lastActive: "15 mins ago" },
  { id: "U-003", name: "Emily Rodriguez", email: "e.rodriguez@university.edu", role: "Research Assistant", department: "Agricultural Sciences", status: "Active", lastActive: "1 hour ago" },
  { id: "U-004", name: "James Wilson", email: "j.wilson@university.edu", role: "Lab Technician", department: "Chemistry", status: "Active", lastActive: "3 hours ago" },
  { id: "U-005", name: "Lisa Thompson", email: "l.thompson@university.edu", role: "PhD Student", department: "Plant Biology", status: "Active", lastActive: "Yesterday" },
  { id: "U-006", name: "Dr. Robert Kim", email: "r.kim@university.edu", role: "Professor", department: "Molecular Biology", status: "Inactive", lastActive: "2 weeks ago" },
];

const roleIcon = (role: string) => {
  if (role === "Lab Manager") return Shield;
  if (role === "Professor") return GraduationCap;
  return User;
};

const roleStyle = (role: string) => {
  if (role === "Lab Manager") return "bg-muted text-primary";
  if (role === "Professor") return "bg-accent text-accent-foreground";
  if (role === "PhD Student") return "bg-warning/10 text-warning";
  return "bg-muted text-muted-foreground";
};

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = USERS_DATA.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
  });

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={UsersIcon}
          title="User Management"
          description="Manage lab members and access permissions"
          actions={<Button className="gap-2"><Plus className="h-4 w-4" /> Add User</Button>}
        />

        <SearchFilter query={searchQuery} onQueryChange={setSearchQuery} placeholder="Search users...">
          <RoleFilter />
          <StatusFilter />
        </SearchFilter>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      </div>
    </AppLayout>
  );
};

export default Users;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Filters (static, non-functional — as in original) ─────────────────── */

const RoleFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Roles" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Roles</SelectItem>
      <SelectItem value="manager">Lab Manager</SelectItem>
      <SelectItem value="professor">Professor</SelectItem>
      <SelectItem value="assistant">Research Assistant</SelectItem>
      <SelectItem value="technician">Lab Technician</SelectItem>
      <SelectItem value="student">PhD Student</SelectItem>
    </SelectContent>
  </Select>
);

const StatusFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Status</SelectItem>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
    </SelectContent>
  </Select>
);

/* ─── User Card ─────────────────────────────────────────────────────────── */

const UserCard = ({ user }: { user: LabUser }) => {
  const initials = user.name.split(" ").map((n) => n[0]).join("");
  const RoleIcon = roleIcon(user.role);
  const isActive = user.status === "Active";

  return (
    <div className="bg-card rounded-xl p-5 border border-border/60 hover:bg-muted/30 transition-colors cursor-pointer">
      <div className="flex items-start gap-4">
        <AvatarCircle initials={initials} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{user.name}</h3>
            <StatusDot active={isActive} />
          </div>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <span className={cn("inline-flex items-center gap-2 px-2.5 py-0.5 text-xs font-medium border rounded-lg", roleStyle(user.role))}>
          <RoleIcon className="h-4 w-4" />
          {user.role}
        </span>
        <p className="text-sm text-muted-foreground">{user.department}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Last active: {user.lastActive}</span>
        <Button variant="ghost" size="sm" className="text-xs">View Profile</Button>
      </div>
    </div>
  );
};

const AvatarCircle = ({ initials }: { initials: string }) => (
  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center shrink-0">
    <span className="text-lg font-medium text-muted-foreground">{initials}</span>
  </div>
);

const StatusDot = ({ active }: { active: boolean }) => (
  <span className={cn("w-2.5 h-2.5 shrink-0 rounded-full", active ? "bg-primary" : "bg-muted-foreground/30")} />
);
