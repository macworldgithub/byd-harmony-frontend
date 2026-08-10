import { DashboardShell } from "@/components/layout/DashboardShell";
import { roles } from "@/lib/data/roles";

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role={roles.delivery}>{children}</DashboardShell>;
}
