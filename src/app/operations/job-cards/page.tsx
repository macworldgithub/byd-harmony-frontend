"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LocationSearchSelect } from "@/components/ui/LocationSearchSelect";
import { ClipboardList, DollarSign, Calendar, Plus, X } from "lucide-react";

const jobCards = [
  {
    id: "BYD-00006",
    status: "IN PROGRESS",
    description: "12,000km routine service",
    price: 299.0,
    date: "11/08/2026",
  },
  {
    id: "BYD-00005",
    status: "IN PROGRESS",
    description: "12,000km routine service",
    price: 299.0,
    date: "11/08/2026",
  },
  {
    id: "BYD-00004",
    status: "IN PROGRESS",
    description: "12,000km routine service",
    price: 299.0,
    date: "11/08/2026",
  },
  {
    id: "BYD-00003",
    status: "IN PROGRESS",
    description: "12,000km routine service",
    price: 299.0,
    date: "11/08/2026",
  },
  {
    id: "BYD-00002",
    status: "IN PROGRESS",
    description: "12,000km routine service",
    price: 299.0,
    date: "11/08/2026",
  },
  {
    id: "BYD-00001",
    status: "IN PROGRESS",
    description: "12,000km routine service",
    price: 299.0,
    date: "11/08/2026",
  },
];

export default function OperationsJobCardsPage() {
  const [showNewJobCardModal, setShowNewJobCardModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div>
      <PageHeader
        title="Job Cards"
        subtitle="Service work orders with unique order numbers"
        action={
          <button
            type="button"
            onClick={() => setShowNewJobCardModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Job Card
          </button>
        }
      />

      {showNewJobCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowNewJobCardModal(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Create Job Card
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewJobCardModal(false)}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Customer
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Select customer</option>
                  <option>John Smith</option>
                  <option>Jane Doe</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Vehicle
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Select vehicle</option>
                  <option>2025 BYD Seal</option>
                  <option>2025 BYD Atto 3</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Location
                </label>
                <LocationSearchSelect
                  locations={[
                    { id: "1", name: "BYD Caroline Springs", suburb: "Caroline Springs" },
                    { id: "2", name: "BYD Nunawading", suburb: "Nunawading" },
                    { id: "3", name: "Denza Melbourne", suburb: "Melbourne" },
                  ]}
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  placeholder="Select location"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Priority
                  </label>
                  <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-800">
                    Odometer In
                  </label>
                  <input
                    type="text"
                    placeholder="km"
                    className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Work required..."
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowNewJobCardModal(false)}
                className="mt-2 w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Create Job Card
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {jobCards.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center gap-3">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                <ClipboardList className="h-6 w-6 text-rose-500" />
              </div>

              {/* Info */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold text-neutral-900">
                    {job.id}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                    {job.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {job.description}
                </p>
                <div className="mt-2 flex items-center justify-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {job.price.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {job.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
