"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Calendar, Clock, Wrench, Plus, X } from "lucide-react";

const bookings = [
  {
    id: "60001",
    status: "CONFIRMED",
    statusColor: "bg-emerald-100 text-emerald-700",
    date: "10 Aug 2026, 2:00 pm",
    type: "routine",
    note: "First service at 12,000km",
    action: {
      label: "Start",
      style: "bg-rose-600 text-white hover:bg-rose-700",
    },
  },
  {
    id: "90001",
    status: "SCHEDULED",
    statusColor: "bg-blue-100 text-blue-700",
    date: "10 Aug 2026, 2:00 pm",
    type: "routine",
    note: "First service at 12,000km",
    action: {
      label: "Confirm",
      style: "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
    },
  },
  {
    id: "120001",
    status: "SCHEDULED",
    statusColor: "bg-blue-100 text-blue-700",
    date: "10 Aug 2026, 2:00 pm",
    type: "routine",
    note: "First service at 12,000km",
    action: {
      label: "Confirm",
      style: "border border-neutral-300 text-neutral-700 hover:bg-neutral-50",
    },
  },
];

export default function OperationsBookingsPage() {
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  return (
    <div>
      <PageHeader
        title="Service Bookings"
        subtitle="Schedule and manage vehicle service appointments"
        action={
          <button
            type="button"
            onClick={() => setShowNewBookingModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Booking
          </button>
        }
      />

      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowNewBookingModal(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Create Service Booking
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewBookingModal(false)}
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
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Select location</option>
                  <option>BYD Caroline Springs</option>
                  <option>BYD Nunawading</option>
                  <option>Denza Melbourne</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Date & Time
                </label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy --:-- --"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Service Type
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Routine Service</option>
                  <option>Warranty Service</option>
                  <option>Vehicle Inspection</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Service details..."
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowNewBookingModal(false)}
                className="mt-2 w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Create Booking
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              {/* Icon + info */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                  <Calendar className="h-6 w-6 text-rose-500" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="text-sm font-bold text-neutral-900">
                      Booking #{booking.id}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${booking.statusColor}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500 sm:justify-start">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Wrench className="h-3.5 w-3.5" />
                      {booking.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {booking.note}
                  </p>
                </div>
              </div>

              {/* Action button */}
              <button
                className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${booking.action.style}`}
              >
                {booking.action.label}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
