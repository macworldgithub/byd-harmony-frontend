import { DashboardShell } from "@/components/layout/DashboardShell";
import { roles } from "@/lib/data/roles";

export default function ExecutiveLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role={roles.executive}>{children}</DashboardShell>;
}
