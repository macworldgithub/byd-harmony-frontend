import { DashboardShell } from "@/components/layout/DashboardShell";
import { roles } from "@/lib/data/roles";

export default function OperationsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role={roles["operations"]}>{children}</DashboardShell>;
}
