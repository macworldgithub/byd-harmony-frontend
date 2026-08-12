"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { ServiceJobCard } from "@/components/kanban/ServiceJobCard";
import { serviceJobs, serviceColumns } from "@/lib/data/service-jobs";
import { Search, ChevronDown, Plus, X, Check } from "lucide-react";

const statusOptions = [
  "All statuses",
  "Open",
  "In Progress",
  "Awaiting Parts",
  "Completed",
  "Invoiced",
];

const statusMap: Record<string, string> = {
  Open: "open",
  "In Progress": "in_progress",
  "Awaiting Parts": "awaiting_parts",
  Completed: "completed",
  Invoiced: "invoiced",
};

export default function ServiceQueuePage() {
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  const filteredJobs =
    selectedStatus === "All statuses"
      ? serviceJobs
      : serviceJobs.filter((job) => job.status === statusMap[selectedStatus]);

  const jobsByStatus = (status: string) =>
    filteredJobs.filter((j) => j.status === status);

  return (
    <div>
      <PageHeader
        title="Service Queue"
        subtitle={`${filteredJobs.length} total jobs`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-56 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStatusMenu((current) => !current)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                {selectedStatus}
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(status);
                        setShowStatusMenu(false);
                      }}
                      className="flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <span>{status}</span>
                      {selectedStatus === status && (
                        <Check className="h-4 w-4 text-rose-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowNewJobModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              New Job
            </button>
          </div>
        }
      />

      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowNewJobModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Create New Job Card
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewJobModal(false)}
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
                  <option>John Smith</option>
                  <option>Lee Atkinson</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Vehicle *
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>2023 BYD Seal - XYZ789</option>
                  <option>2025 BYD Atto3 - ABC123</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Location *
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>BYD Caroline Springs</option>
                  <option>BYD Nunawading</option>
                  <option>Denza Melbourne</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Priority
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the work required..."
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Create Job Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {serviceColumns.map((col) => {
          const jobs = jobsByStatus(col.key);
          return (
            <KanbanColumn
              key={col.key}
              title={col.label}
              count={jobs.length}
              accent={col.accent}
              emptyLabel="No jobs"
            >
              {jobs.map((job) => (
                <ServiceJobCard key={job.id} job={job} />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
    </div>
  );
}
