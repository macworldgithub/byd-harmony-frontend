import { DashboardShell } from "@/components/layout/DashboardShell";
import { roles } from "@/lib/data/roles";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role={roles.sales}>{children}</DashboardShell>;
}
