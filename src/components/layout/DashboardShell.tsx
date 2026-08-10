import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import type { RoleConfig } from "@/lib/types";

export function DashboardShell({
  role,
  children,
}: {
  role: RoleConfig;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 overflow-x-hidden px-5 py-6 sm:px-8 sm:py-8">{children}</main>
        {/* <Footer compact /> */}
      </div>
    </div>
  );
}
