import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Download } from "lucide-react";

export default function ExecutiveCustomScreenPage() {
  return (
    <div>
      <PageHeader
        title="Custom Screen"
        subtitle="Select and drag widgets to build your own dashboard view."
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        }
      />

      <Panel className="mb-6" padded={true}>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Available Widgets — Click to Toggle · Drag to Reorder
        </p>
        <div className="flex flex-wrap gap-2">
          {["Customers KPI", "Vehicles KPI", "Bookings Today", "Open Jobs KPI", "Revenue Trend", "Customer Acquisition", "Location Performance", "Response Times"].map((widget, i) => {
            const isActive = ["Customers KPI", "Open Jobs KPI", "Revenue Trend", "Location Performance"].includes(widget);
            return (
              <button
                key={widget}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {/* Drag handle placeholder */}
                <span className="flex items-center text-current/50">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                </span>
                {widget}
                {isActive && (
                  <svg className="h-3 w-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Customers Widget */}
        <Panel className="h-32">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Total Customers</p>
          <p className="text-4xl font-bold text-rose-600">17</p>
          <p className="text-xs text-neutral-500 mt-1">All sites</p>
        </Panel>

        {/* Open Jobs Widget */}
        <Panel className="h-32">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Open Jobs</p>
          <p className="text-4xl font-bold text-purple-600">16</p>
        </Panel>

        {/* Revenue Trend Widget */}
        <Panel className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2 relative">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                 <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                 <h3 className="text-sm font-semibold text-neutral-900">Revenue Trend</h3>
             </div>
             <button className="text-neutral-400 hover:text-neutral-600">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </button>
          </div>
          <div className="flex h-[200px] items-center justify-center text-sm text-neutral-400">
            No revenue data yet
          </div>
        </Panel>

         {/* Location Performance Widget */}
         <Panel className="col-span-1 md:col-span-2 relative">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                     <svg className="h-4 w-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                     <h3 className="text-sm font-semibold text-neutral-900">Location Performance</h3>
                 </div>
                 <button className="text-neutral-400 hover:text-neutral-600">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
            </div>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">BYD 2</span>
                        <span className="text-neutral-500">0%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden"></div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium">BYD Harmony Automotive — Richmond</span>
                        <span className="text-neutral-500">80%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-600 w-[80%] rounded-full"></div>
                    </div>
                </div>
            </div>
        </Panel>
      </div>
    </div>
  );
}
