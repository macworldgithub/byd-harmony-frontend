import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";

const vehicles = [
  { id: 1, model: "2025 BYD Seal", rego: "XYZ789", color: null, owner: "John Smith", status: "active" },
  { id: 2, model: "2025 BYD Atto 3", rego: "ABC123", color: "Surf Blue", owner: "John Smith", status: "disposed" },
  { id: 3, model: "2025 BYD Seal", rego: "XYZ789", color: null, owner: "John Smith", status: "active" },
  { id: 4, model: "2025 BYD Atto 3", rego: "ABC123", color: "Surf Blue", owner: "John Smith", status: "disposed" },
  { id: 5, model: "2025 BYD Seal", rego: "XYZ789", color: null, owner: "John Smith", status: "active" },
  { id: 6, model: "2025 BYD Atto 3", rego: "ABC123", color: "Surf Blue", owner: "John Smith", status: "disposed" },
  { id: 7, model: "2025 BYD Seal", rego: "XYZ789", color: null, owner: "John Smith", status: "active" },
  { id: 8, model: "2025 BYD Atto 3", rego: "ABC123", color: "Surf Blue", owner: "John Smith", status: "disposed" },
  { id: 9, model: "2025 BYD Seal", rego: "XYZ789", color: null, owner: "John Smith", status: "active" },
  { id: 10, model: "2025 BYD Atto 3", rego: "ABC123", color: "Surf Blue", owner: "John Smith", status: "disposed" },
];

export default function SalesVehiclesPage() {
  return (
    <div>
      <PageHeader
        title="Vehicles"
        subtitle="32 vehicles in system"
      />

      <Panel padded={false} className="mt-6 border-neutral-200">
        <div className="divide-y divide-neutral-100">
          {vehicles.map((v) => (
            <div key={v.id} className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50/50 transition-colors cursor-pointer">
              <div>
                <div className="font-semibold text-neutral-900">{v.model}</div>
                <div className="text-sm text-neutral-500 mt-0.5">
                  {v.rego} {v.color ? `· ${v.color} ` : "· — "}·{" "}
                  <span className="text-rose-600">{v.owner}</span>
                </div>
              </div>
              <Badge tone={v.status === "active" ? "green" : "neutral"}>
                {v.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
