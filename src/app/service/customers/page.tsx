import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Car, ClipboardList, MessageSquare } from "lucide-react";
import { Toolbar } from "@/components/dashboard/Toolbar";

const customers = [
  { id: 1, name: "Lee Atkinson", phone: "6411111111" },
  { id: 2, name: "John Smith", phone: "0412345678", active: true },
  { id: 3, name: "John Smith", phone: "0412345678" },
  { id: 4, name: "John Smith", phone: "0412345678" },
  { id: 5, name: "John Smith", phone: "0412345678" },
  { id: 6, name: "John Smith", phone: "0412345678" },
  { id: 7, name: "John Smith", phone: "0412345678" },
];

export default function ServiceCustomersPage() {
  return (
    <div className="flex h-[calc(100vh-80px)] gap-6 p-2">
      {/* Sidebar */}
      <div className="w-80 flex flex-col bg-white border border-neutral-200 rounded-lg overflow-hidden shrink-0">
        <div className="p-4 border-b border-neutral-200">
          <Toolbar searchPlaceholder="Search customers..." />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {customers.map((c) => (
            <div key={c.id} className={`p-3 rounded-md cursor-pointer ${c.active ? 'bg-rose-50 border border-rose-200' : 'hover:bg-neutral-50'} mb-1`}>
              <div className="font-medium text-neutral-900">{c.name}</div>
              <div className="text-sm text-neutral-500">{c.phone}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-12">
        <div className="flex items-start justify-between bg-white p-6 rounded-lg border border-neutral-200">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">John Smith</h1>
            <p className="text-sm text-neutral-500 mt-1">📞 0412345678  ✉️ john@example.com</p>
          </div>
          <Badge tone="blue">active</Badge>
        </div>

        <Panel className="border-neutral-200">
          <h3 className="flex items-center gap-2 font-semibold text-neutral-800 text-sm mb-4"><Car className="w-4 h-4 text-rose-600"/> Vehicles (2)</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-md bg-neutral-50/30">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-neutral-400" />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">2025 BYD Seal</div>
                  <div className="text-xs text-neutral-500">XYZ789 -- No VIN</div>
                </div>
              </div>
              <Badge tone="green">active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-neutral-100 rounded-md bg-neutral-50/30">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-neutral-400" />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">2025 BYD Atto 3</div>
                  <div className="text-xs text-neutral-500">ABC123 - Surf Blue - No VIN</div>
                </div>
              </div>
              <Badge tone="neutral">disposed</Badge>
            </div>
          </div>
        </Panel>

        <Panel className="border-neutral-200">
          <h3 className="flex items-center gap-2 font-semibold text-neutral-800 text-sm mb-4"><ClipboardList className="w-4 h-4 text-rose-600"/> Job History (1)</h3>
          <div className="p-3 border border-neutral-100 rounded-md bg-neutral-50/30 flex justify-between items-center">
            <div className="flex gap-4">
              <div className="text-neutral-400">#</div>
              <div>
                <div className="font-semibold text-rose-600 text-sm">BYD-00010</div>
                <div className="text-sm text-neutral-600">12,000km routine service</div>
              </div>
            </div>
            <Badge tone="orange">in_progress</Badge>
          </div>
        </Panel>

        <Panel className="border-neutral-200">
          <h3 className="flex items-center gap-2 font-semibold text-neutral-800 text-sm mb-4"><MessageSquare className="w-4 h-4 text-rose-600"/> Communication Thread</h3>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium text-neutral-900">Customer called to confirm service appointment</div>
                <div className="text-xs text-neutral-400">Note - Note</div>
              </div>
              <div className="text-xs text-neutral-400">08/08/2026</div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-medium text-neutral-900">Job BYD-00010 status: in_progress</div>
                <div className="text-xs text-neutral-400">Job Updated - System</div>
              </div>
              <div className="text-xs text-neutral-400">08/08/2026</div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
