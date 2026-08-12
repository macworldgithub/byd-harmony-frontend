"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { LeadCard } from "@/components/kanban/LeadCard";
import { activeCustomers, serviceClients } from "@/lib/data/queues";

export default function SalesPipelinePage() {
  const [showAddLead, setShowAddLead] = useState(false);
  const total = activeCustomers.length + serviceClients.length;

  return (
    <div>
      <PageHeader
        title="Sales Pipeline"
        subtitle={`${total} total in pipeline`}
        action={
          <div className="flex items-center gap-3">
            <Toolbar searchPlaceholder="Search..." />
            <button
              onClick={() => setShowAddLead(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Add Lead
            </button>
          </div>
        }
      />

      {showAddLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAddLead(false)}
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-[8px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Add New Lead</h3>
              <button
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100"
                onClick={() => setShowAddLead(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  First Name *
                </label>
                <input className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Last Name *
                </label>
                <input className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone
                </label>
                <input className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Stage
                </label>
                <select className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm">
                  <option>prospect</option>
                  <option>active</option>
                  <option>service</option>
                  <option>inactive</option>
                  <option>archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Source
                </label>
                <input
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="e.g. Walk-in, Web"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Notes
                </label>
                <textarea className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm h-24" />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowAddLead(false)}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddLead(false)}
                className="rounded-md bg-rose-600 px-4 py-2 text-sm text-white"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        <KanbanColumn
          title="Prospects"
          count={0}
          accent="blue"
          emptyLabel="No prospects"
        />
        <KanbanColumn
          title="Active Customers"
          count={activeCustomers.length}
          accent="green"
          emptyLabel="No customers"
        >
          {activeCustomers.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </KanbanColumn>
        <KanbanColumn
          title="Service Clients"
          count={serviceClients.length}
          accent="orange"
          emptyLabel="No clients"
        >
          {serviceClients.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </KanbanColumn>
      </div>
    </div>
  );
}
