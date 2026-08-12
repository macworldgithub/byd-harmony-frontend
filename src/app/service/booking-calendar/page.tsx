"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Clock, Plus, X } from "lucide-react";

const bookings = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: i,
    time: "02:00 pm",
    type: "-- routine",
    status: i % 5 === 4 ? "confirmed" : "scheduled",
  }));

export default function ServiceBookingCalendarPage() {
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  return (
    <div>
      <PageHeader
        title="Booking Calendar"
        subtitle="16 today · 0 upcoming"
        action={
          <button
            type="button"
            onClick={() => setShowNewBookingModal(true)}
            className="rounded-md bg-rose-600 px-6 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
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
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  New Service Booking
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
                  Customer *
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Select customer</option>
                  <option>John Smith</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Location *
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Select location</option>
                  <option>BYD Caroline Springs</option>
                  <option>BYD Nunawading</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Date & Time *
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
                  <option>Repair</option>
                  <option>Warranty</option>
                  <option>Recall</option>
                  <option>Inspection</option>
                  <option>pre-Delivery</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Customer notes or description..."
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Create Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-4">
          <Clock className="h-4 w-4 text-rose-600" />
          Today — Monday 10 August
        </h3>

        <div className="space-y-3">
          {bookings.map((booking) => (
            <Panel
              key={booking.id}
              padded={false}
              className="border-neutral-200"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-8">
                  <div className="font-semibold text-rose-600 w-20">
                    {booking.time}
                  </div>
                  <div className="text-neutral-500 text-sm">{booking.type}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    tone={booking.status === "confirmed" ? "green" : "blue"}
                  >
                    {booking.status}
                  </Badge>
                  {booking.status === "confirmed" && (
                    <button className="rounded-md border border-neutral-200 px-3 py-1 text-sm font-medium hover:bg-neutral-50 transition-colors text-neutral-700">
                      Start
                    </button>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
