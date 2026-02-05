import { useState } from "react";
import { Plus, Search, Users as UsersIcon, Shield, User, GraduationCap } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const usersData = [
  { id: "U-001", name: "Dr. Sarah Chen", email: "sarah.chen@university.edu", role: "Lab Manager", department: "Agricultural Sciences", status: "Active", lastActive: "2 mins ago" },
  { id: "U-002", name: "Dr. Michael Park", email: "m.park@university.edu", role: "Professor", department: "Plant Biology", status: "Active", lastActive: "15 mins ago" },
  { id: "U-003", name: "Emily Rodriguez", email: "e.rodriguez@university.edu", role: "Research Assistant", department: "Agricultural Sciences", status: "Active", lastActive: "1 hour ago" },
  { id: "U-004", name: "James Wilson", email: "j.wilson@university.edu", role: "Lab Technician", department: "Chemistry", status: "Active", lastActive: "3 hours ago" },
  { id: "U-005", name: "Lisa Thompson", email: "l.thompson@university.edu", role: "PhD Student", department: "Plant Biology", status: "Active", lastActive: "Yesterday" },
  { id: "U-006", name: "Dr. Robert Kim", email: "r.kim@university.edu", role: "Professor", department: "Molecular Biology", status: "Inactive", lastActive: "2 weeks ago" },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "Lab Manager":
      return <Shield className="h-4 w-4" />;
    case "Professor":
      return <GraduationCap className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const getRoleStyle = (role: string) => {
  switch (role) {
    case "Lab Manager":
      return "bg-primary/10 text-primary";
    case "Professor":
      return "bg-accent text-accent-foreground";
    case "Research Assistant":
    case "Lab Technician":
      return "bg-muted text-muted-foreground";
    case "PhD Student":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage lab members and access permissions
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="manager">Lab Manager</SelectItem>
              <SelectItem value="professor">Professor</SelectItem>
              <SelectItem value="assistant">Research Assistant</SelectItem>
              <SelectItem value="technician">Lab Technician</SelectItem>
              <SelectItem value="student">PhD Student</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-background border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-primary">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">{user.name}</h3>
                    {user.status === "Active" ? (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-muted-foreground shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getRoleStyle(user.role)
                  )}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{user.department}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last active: {user.lastActive}</span>
                <Button variant="ghost" size="sm" className="text-xs">
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Users;
