import { DashboardShell } from "@/components/layout/DashboardShell";
import { roles } from "@/lib/data/roles";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role={roles.admin}>{children}</DashboardShell>;
}
