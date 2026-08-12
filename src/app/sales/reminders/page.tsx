"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";

export default function SalesRemindersPage() {
  const [showNewReminder, setShowNewReminder] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Follow-up Reminders
          </h1>
          <p className="text-sm text-neutral-500 mt-1">0 open · 0 overdue</p>
        </div>
        <button
          onClick={() => setShowNewReminder(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          + Add Reminder
        </button>
      </div>

      {showNewReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowNewReminder(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[8px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">New Reminder</h3>
              <button
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100"
                onClick={() => setShowNewReminder(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Title *
                </label>
                <input
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="e.g. Follow up with John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Due Date *
                </label>
                <input
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="mm/dd/yyyy --:-- --"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowNewReminder(false)}
                  className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowNewReminder(false)}
                  className="rounded-md bg-rose-600 px-4 py-2 text-sm text-white"
                >
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Panel padded={false} className="border-neutral-200">
          <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
            />
            <span className="flex-1 font-medium text-neutral-900 text-sm">
              No upcoming reminders
            </span>
          </label>
        </Panel>
      </div>
    </div>
  );
}
