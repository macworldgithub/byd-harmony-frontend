import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Building2, Phone, Mail, Plus } from "lucide-react";
import { locationCards } from "@/lib/data/admin-overview";

export default function AdminLocationsPage() {
  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle="Manage sales, service, and delivery centres"
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        }
      />

      <div className="space-y-4">
        {locationCards.map((loc) => (
          <Panel key={loc.id} padded={false}>
            <div className="flex items-start gap-4 p-5">
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
                <Building2 className="h-5 w-5 text-neutral-400" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold text-neutral-900">{loc.name}</p>
                  <Badge tone="neutral">{loc.type}</Badge>
                  <Badge tone="green">{loc.status}</Badge>
                </div>

                <p className="mt-1 text-sm text-neutral-500">{loc.address}</p>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    {loc.phone}
                  </span>
                  {loc.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-neutral-400" />
                      {loc.email}
                    </span>
                  )}
                  <span className="text-neutral-400">
                    Capacity: <span className="font-medium text-neutral-600">{loc.capacity}</span>
                  </span>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
