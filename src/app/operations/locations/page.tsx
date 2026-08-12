"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Building2, MapPin, Phone, Plus, X } from "lucide-react";

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
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);

  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle="Manage sales, service, and delivery centres"
        action={
          <button
            type="button"
            onClick={() => setShowAddLocationModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        }
      />

      {showAddLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAddLocationModal(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Add Location
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLocationModal(false)}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue="BYD Harmony Melbourne CBD"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Type
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Sales</option>
                  <option>Service</option>
                  <option>Delivery</option>
                  <option>Combined</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Suburb
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    State
                  </label>
                  <input
                    type="text"
                    defaultValue="VIC"
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Capacity
                  </label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddLocationModal(false)}
                className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Create Location
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${loc.iconBg}`}
                >
                  <Building2 className={`h-5 w-5 ${loc.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {loc.name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {loc.suburb}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${loc.typeColor}`}
              >
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
                Capacity:{" "}
                <span className="font-semibold text-neutral-700">
                  {loc.capacity} bays
                </span>
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
