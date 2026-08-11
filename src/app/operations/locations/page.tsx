import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";
import { Building2, MapPin, Phone, Plus } from "lucide-react";

const locations = [
  {
    id: "loc-1",
    name: "BYD Caroline Springs",
    suburb: "Caroline Springs, VIC",
    type: "COMBINED",
    typeColor: "bg-violet-100 text-violet-700",
    address: null,
    phone: "0399998888",
    capacity: 20,
    active: true,
    initials: "B",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "loc-2",
    name: "BYD Harmony Service Centre",
    suburb: "Richmond, VIC",
    type: "SERVICE",
    typeColor: "bg-emerald-100 text-emerald-700",
    address: "123 Test St",
    phone: "0399765432",
    capacity: 8,
    active: true,
    initials: "B",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "loc-3",
    name: "BYD Nunawading",
    suburb: "Nunawading, VIC",
    type: "COMBINED",
    typeColor: "bg-violet-100 text-violet-700",
    address: null,
    phone: null,
    capacity: 20,
    active: true,
    initials: "B",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "loc-4",
    name: "BYD Test Location 1786423497775",
    suburb: "Richmond, VIC",
    type: "SERVICE",
    typeColor: "bg-emerald-100 text-emerald-700",
    address: "123 Test St",
    phone: "0398765432",
    capacity: 8,
    active: true,
    initials: "B",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    id: "loc-5",
    name: "Denza Melbourne",
    suburb: "Melbourne, VIC",
    type: "COMBINED",
    typeColor: "bg-violet-100 text-violet-700",
    address: null,
    phone: null,
    capacity: 20,
    active: true,
    initials: "D",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

export default function OperationsLocationsPage() {
  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle="Manage sales, service, and delivery centres"
        action={
          <Link
            href="/operations/locations/new"
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${loc.iconBg}`}>
                  <Building2 className={`h-5 w-5 ${loc.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{loc.name}</p>
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {loc.suburb}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${loc.typeColor}`}>
                {loc.type}
              </span>
            </div>

            {/* Details */}
            <div className="mt-4 space-y-1.5 text-xs text-neutral-500">
              {loc.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {loc.address}
                </div>
              )}
              {loc.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {loc.phone}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
              <span className="text-xs text-neutral-500">
                Capacity: <span className="font-semibold text-neutral-700">{loc.capacity} bays</span>
              </span>
              <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
