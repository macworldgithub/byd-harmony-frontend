import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { recentActivity } from "@/lib/data/dashboards";
import { Activity } from "lucide-react";

export default function ExecutiveActivityFeedPage() {
  const extendedActivity = [
    { id: "e1", message: "Customer profile created for Lee Atkinson", timestamp: "10 Aug, 11:55 am", source: "System" },
    { id: "e2", message: "Booking status updated to: confirmed", timestamp: "10 Aug, 09:51 am", source: "System" },
    { id: "e3", message: "Booking status updated to: confirmed", timestamp: "10 Aug, 09:51 am", source: "System" },
    { id: "e4", message: "Booking status updated to: confirmed", timestamp: "10 Aug, 09:51 am", source: "System" },
    { id: "e5", message: "Booking status updated to: confirmed", timestamp: "10 Aug, 09:51 am", source: "System" },
    { id: "e6", message: "Booking status updated to: confirmed", timestamp: "7 Aug, 11:03 pm", source: "System" },
    { id: "e7", message: "Booking status updated to: confirmed", timestamp: "7 Aug, 11:03 pm", source: "System" },
    { id: "e8", message: "Service booking created for 07/08/2026 — pre_delivery", timestamp: "7 Aug, 11:03 pm", source: "System" },
    { id: "e9", message: "Customer called to confirm service appointment", timestamp: "6 Aug, 03:07 am", source: "Note" },
    { id: "e10", message: "Job BYD-00016 status: in_progress", timestamp: "6 Aug, 03:07 am", source: "System" },
    { id: "e11", message: "Job card BYD-00016 created — normal priority", timestamp: "6 Aug, 03:07 am", source: "System" },
    { id: "e12", message: "Booking status updated to: confirmed", timestamp: "6 Aug, 03:07 am", source: "System" },
    { id: "e13", message: "Service booking created for 10/08/2026 — routine", timestamp: "6 Aug, 03:07 am", source: "System" },
  ];

  return (
    <div>
      <PageHeader
        title="Activity Feed"
        subtitle="Live cross-site activity across all departments."
      />

      <Panel padded={false}>
        <div className="divide-y divide-neutral-100">
          {extendedActivity.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-neutral-50 transition-colors">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-neutral-900">{item.message}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {item.source === "Note" ? "Note · Note" : "Booking Updated · System"}
                </p>
              </div>
              <span className="shrink-0 text-xs text-neutral-400">{item.timestamp}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
