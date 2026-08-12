"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { User, X } from "lucide-react";

const contractors = [
  {
    id: 1,
    name: "AutoGlass Pro",
    type: "Glass & Windscreen",
    phone: "1300 555 001",
    email: "jobs@autoglasspro.com.au",
    status: "active",
  },
  {
    id: 2,
    name: "BYD Certified Detailing",
    type: "Detailing",
    phone: "0412 000 001",
    email: "detail@bydcertified.com.au",
    status: "active",
  },
  {
    id: 3,
    name: "FleetTow Services",
    type: "Towing & Transport",
    phone: "1800 TOW NOW",
    email: "dispatch@fleettow.com.au",
    status: "active",
  },
];

export default function DeliveryContractorsPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Contractors"
        subtitle="3 registered contractors"
        action={
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Add Contractor
          </button>
        }
      />

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Add Contractor
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Company Name *
                </label>
                <input className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Type of Service
                </label>
                <input
                  placeholder="e.g. Detailing, Towing"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Phone
                </label>
                <input className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Email
                </label>
                <input className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <div className="text-sm text-neutral-600 flex items-center justify-end gap-1">
                    📞 {c.phone}
                  </div>
                  <div className="text-sm text-neutral-500 flex items-center justify-end gap-1">
                    ✉️ {c.email}
                  </div>
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
