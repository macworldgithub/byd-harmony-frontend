import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";

export default function ExecutiveSiteComparisonPage() {
  return (
    <div>
      <PageHeader
        title="Site Comparison"
        subtitle="Compare performance across all dealership locations."
      />

      <div className="space-y-5 max-w-2xl">
        <Panel padded={false}>
          <div className="p-5">
             <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-[15px] font-bold text-neutral-900">BYD 2</h3>
                    <p className="text-xs text-neutral-500">Combined · Jasjdaids</p>
                 </div>
                 <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700">
                     0% utilised
                 </span>
             </div>
             <div className="grid grid-cols-4 gap-4 text-center">
                 <div>
                     <p className="text-xl font-bold text-neutral-900">0</p>
                     <p className="text-xs text-neutral-500">Open Jobs</p>
                 </div>
                 <div>
                     <p className="text-xl font-bold text-neutral-900">0</p>
                     <p className="text-xs text-neutral-500">Completed</p>
                 </div>
                 <div>
                     <p className="text-xl font-bold text-neutral-900">0</p>
                     <p className="text-xs text-neutral-500">Bookings</p>
                 </div>
                 <div>
                     <p className="text-xl font-bold text-neutral-900">$0</p>
                     <p className="text-xs text-neutral-500">Revenue</p>
                 </div>
             </div>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-b-2xl"></div>
        </Panel>

        <Panel padded={false}>
          <div className="p-5">
             <div className="flex justify-between items-start mb-4">
                 <div>
                    <h3 className="text-[15px] font-bold text-neutral-900">BYD Harmony Automotive — Richmond</h3>
                    <p className="text-xs text-neutral-500">Combined · Richmond</p>
                 </div>
                 <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-700">
                     80% utilised
                 </span>
             </div>
             <div className="grid grid-cols-4 gap-4 text-center">
                 <div>
                     <p className="text-xl font-bold text-neutral-900">16</p>
                     <p className="text-xs text-neutral-500">Open Jobs</p>
                 </div>
                 <div>
                     <p className="text-xl font-bold text-neutral-900">0</p>
                     <p className="text-xs text-neutral-500">Completed</p>
                 </div>
                 <div>
                     <p className="text-xl font-bold text-neutral-900">17</p>
                     <p className="text-xs text-neutral-500">Bookings</p>
                 </div>
                 <div>
                     <p className="text-xl font-bold text-neutral-900">$0</p>
                     <p className="text-xs text-neutral-500">Revenue</p>
                 </div>
             </div>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-b-2xl overflow-hidden flex">
              <div className="h-full bg-amber-500 w-[80%]"></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
