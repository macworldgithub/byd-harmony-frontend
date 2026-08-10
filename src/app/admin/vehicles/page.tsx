import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { Car } from "lucide-react";

type VehicleStatus = "Active" | "In Service" | "Delivered" | "Pending";

const statusTone: Record<VehicleStatus, "green" | "orange" | "blue" | "neutral"> = {
  Active: "green",
  "In Service": "orange",
  Delivered: "blue",
  Pending: "neutral",
};

const vehicles = [
  { id: "v-1",  make: "BYD",  model: "Atto 3",    year: 2024, color: "Pearl White",  rego: "1AB2CD",  vin: "LSVAU2185N2100001", owner: "Lee Atkinson",   site: "Richmond",  status: "Active"     as VehicleStatus, odometer: "12,000 km" },
  { id: "v-2",  make: "BYD",  model: "Seal",       year: 2024, color: "Cosmos Black", rego: "2EF3GH",  vin: "LSVAU2185N2100002", owner: "John Smith",     site: "Richmond",  status: "In Service" as VehicleStatus, odometer: "8,500 km"  },
  { id: "v-3",  make: "BYD",  model: "Dolphin",    year: 2023, color: "Sky Blue",     rego: "3IJ4KL",  vin: "LSVAU2185N2100003", owner: "Sarah Mitchell", site: "BYD 2",     status: "Delivered"  as VehicleStatus, odometer: "24,300 km" },
  { id: "v-4",  make: "BYD",  model: "Han EV",     year: 2024, color: "Surf Silver",  rego: "4MN5OP",  vin: "LSVAU2185N2100004", owner: "James Tran",     site: "Richmond",  status: "Active"     as VehicleStatus, odometer: "5,100 km"  },
  { id: "v-5",  make: "BYD",  model: "Tang EV",    year: 2023, color: "Aurora Gray",  rego: "5QR6ST",  vin: "LSVAU2185N2100005", owner: "Priya Sharma",   site: "Richmond",  status: "Pending"    as VehicleStatus, odometer: "0 km"      },
  { id: "v-6",  make: "BYD",  model: "Atto 3",    year: 2023, color: "Forest Green", rego: "6UV7WX",  vin: "LSVAU2185N2100006", owner: "David Lee",      site: "BYD 2",     status: "In Service" as VehicleStatus, odometer: "31,200 km" },
  { id: "v-7",  make: "BYD",  model: "Seal U",     year: 2024, color: "Polar White",  rego: "7YZ8AB",  vin: "LSVAU2185N2100007", owner: "Emma Wilson",    site: "Richmond",  status: "Active"     as VehicleStatus, odometer: "3,800 km"  },
];

export default function AdminVehiclesPage() {
  return (
    <div>
      <PageHeader
        title="All Vehicles"
        subtitle="Platform-wide vehicle records across all sites."
        action={<Toolbar searchPlaceholder="Search by rego, VIN, owner..." filterLabel="All Statuses" ctaLabel="Add Vehicle" />}
      />

      <p className="mb-4 text-sm text-neutral-500">{vehicles.length} vehicles</p>

      <Panel padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Vehicle", "Registration", "VIN", "Owner", "Site", "Odometer", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                        <Car className="h-4 w-4 text-neutral-500" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{v.year} {v.make} {v.model}</p>
                        <p className="text-xs text-neutral-400">{v.color}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-neutral-700">{v.rego}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{v.vin}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{v.owner}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{v.site}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{v.odometer}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={statusTone[v.status]}>{v.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
