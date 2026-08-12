"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BigStatCard } from "@/components/dashboard/StatCard";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { DeliveryListItem } from "@/components/queue/DeliveryListItem";
import { Truck, Plus, X } from "lucide-react";

const calendarStats = { today: 0, thisWeek: 0, totalScheduled: 0 };
const todaysDeliveriesLocal: Array<{
  id: string;
  time?: string;
  detail?: string;
}> = [];

export default function DeliveryCalendarPage() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <div>
      <PageHeader
        title="Delivery Calendar"
        subtitle={`${calendarStats.today} today · 0 upcoming`}
        action={
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <Plus className="h-4 w-4" />
            Schedule Delivery
          </button>
        }
      />

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Schedule Delivery
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
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
                  <option>Denza Melbourne</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Delivery Date &amp; Time *
                </label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy --:-- --"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Delivery notes..."
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BigStatCard
          value={String(calendarStats.today)}
          label="Today"
          colorClassName="text-rose-600"
        />
        <BigStatCard
          value={String(calendarStats.thisWeek)}
          label="This Week"
          colorClassName="text-amber-600"
        />
        <BigStatCard
          value={String(calendarStats.totalScheduled)}
          label="Total Scheduled"
        />
      </div>

      <div className="mt-5">
        <Panel padded={false}>
          <div className="border-b border-neutral-100 px-5 py-4">
            <PanelHeader
              title="Today's Deliveries"
              //   action={<Truck className="h-4 w-4 text-rose-500" />}
            />
          </div>
          <div className="p-6">
            {todaysDeliveriesLocal.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-neutral-200 bg-white/50 p-6 text-center text-sm text-neutral-500">
                No deliveries scheduled today
              </div>
            ) : (
              <div>
                {todaysDeliveriesLocal.map((item) => (
                  <DeliveryListItem key={item.id} item={item as any} />
                ))}
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
