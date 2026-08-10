import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";

export default function ExecutiveRevenuePage() {
  return (
    <div>
      <PageHeader
        title="Revenue Report"
        subtitle="Financial performance over time"
        action={
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
                <button className="px-3 py-1.5 text-xs font-semibold rounded-md text-neutral-600 hover:text-neutral-900">7d</button>
                <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-rose-600 text-white shadow-sm">30d</button>
                <button className="px-3 py-1.5 text-xs font-semibold rounded-md text-neutral-600 hover:text-neutral-900">90d</button>
            </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 max-w-2xl">
          <Panel className="text-center py-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-rose-600">$0</p>
          </Panel>
          <Panel className="text-center py-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">New Customers</p>
              <p className="text-3xl font-bold text-emerald-600">0</p>
          </Panel>
          <Panel className="text-center py-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Total Bookings</p>
              <p className="text-3xl font-bold text-amber-500">0</p>
          </Panel>
      </div>

      <Panel className="max-w-3xl h-[400px]">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Revenue (30 days)</h3>
          <div className="h-full flex items-center justify-center text-sm text-neutral-400 pb-10">
              No revenue data yet
          </div>
      </Panel>
    </div>
  );
}
