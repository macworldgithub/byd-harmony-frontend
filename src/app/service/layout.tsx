import { DashboardShell } from "@/components/layout/DashboardShell";
import { roles } from "@/lib/data/roles";

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role={roles.service}>{children}</DashboardShell>;
}
