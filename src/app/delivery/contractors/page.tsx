import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { User } from "lucide-react";

const contractors = [
  { id: 1, name: "AutoGlass Pro", type: "Glass & Windscreen", phone: "1300 555 001", email: "jobs@autoglasspro.com.au", status: "active" },
  { id: 2, name: "BYD Certified Detailing", type: "Detailing", phone: "0412 000 001", email: "detail@bydcertified.com.au", status: "active" },
  { id: 3, name: "FleetTow Services", type: "Towing & Transport", phone: "1800 TOW NOW", email: "dispatch@fleettow.com.au", status: "active" },
];

export default function DeliveryContractorsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Contractors"
        subtitle="3 registered contractors"
        action={
          <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            + Add Contractor
          </button>
        }
      />
      <div className="mt-6 space-y-4">
        {contractors.map((c) => (
          <Panel key={c.id} padded={false} className="border-neutral-200">
            <div className="flex items-center justify-between p-4 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">{c.name}</div>
                  <div className="text-sm text-neutral-500">{c.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-8 ml-auto">
                <div className="text-right">
                  <div className="text-sm text-neutral-600 flex items-center justify-end gap-1">📞 {c.phone}</div>
                  <div className="text-sm text-neutral-500 flex items-center justify-end gap-1">✉️ {c.email}</div>
                </div>
                <Badge tone="green">{c.status}</Badge>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
