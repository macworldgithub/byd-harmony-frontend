import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Activity } from "lucide-react";

export default function AdminAuditLogPage() {
  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="System-wide activity log across all customers and operations."
      />

      <Panel>
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <Activity className="h-7 w-7 text-neutral-300" />
          </div>
          <p className="text-sm text-neutral-400">No activity recorded yet</p>
        </div>
      </Panel>
    </div>
  );
}
