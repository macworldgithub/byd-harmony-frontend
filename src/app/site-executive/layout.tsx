import { DashboardShell } from "@/components/layout/DashboardShell";
import { roles } from "@/lib/data/roles";

export default function SiteExecutiveLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role={roles["site-executive"]}>{children}</DashboardShell>;
}
