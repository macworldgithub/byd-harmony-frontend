import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";

const checklist = [
  { id: 1, label: "Vehicle inspection completed", checked: false },
  { id: 2, label: "Paint and body check — no scratches or dents", checked: false },
  { id: 3, label: "Interior clean and detailed", checked: true },
  { id: 4, label: "All fluids topped up", checked: true },
  { id: 5, label: "Tyre pressures set to spec", checked: true },
  { id: 6, label: "All accessories fitted and tested", checked: false },
  { id: 7, label: "Registration and CTP confirmed", checked: false },
  { id: 8, label: "Finance documents prepared", checked: false },
  { id: 9, label: "Handover pack assembled", checked: false },
  { id: 10, label: "Customer notified of delivery time", checked: false },
];

export default function DeliveryChecklistsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Delivery Checklists"
        subtitle="Complete all items before and after each vehicle delivery."
      />
      
      <div className="mt-6">
        <div className="flex gap-2 mb-6">
          <button className="bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium">Pre-Delivery</button>
          <button className="bg-neutral-100 text-neutral-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-200">Post-Delivery</button>
        </div>

        <Panel padded={false} className="border-neutral-200">
          <div className="divide-y divide-neutral-100">
            {checklist.map((item) => (
              <label key={item.id} className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${item.checked ? 'bg-rose-50/20' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  readOnly
                  className="w-4 h-4 text-rose-600 rounded border-neutral-300 focus:ring-rose-500"
                />
                <span className={`text-sm ${item.checked ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </Panel>

        <div className="mt-4 flex justify-between items-center text-sm text-neutral-500">
          <span>3 of 10 completed</span>
          <button className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-medium transition-colors">
            Mark all done
          </button>
        </div>
      </div>
    </div>
  );
}
