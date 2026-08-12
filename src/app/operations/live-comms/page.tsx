"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { UserPlus, MessageSquare, X } from "lucide-react";

export default function OperationsLiveCommsPage() {
  const [showAddLiveClientModal, setShowAddLiveClientModal] = useState(false);

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
            </div>
            Live demo clients
          </h1>
          <p className="text-sm text-neutral-500">
            Add a one-off contact, send them a real SMS, and watch replies land
            in the thread — in front of the room.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddLiveClientModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add live client
        </button>
      </div>

      {showAddLiveClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAddLiveClientModal(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Add a live demo client
                </h2>
                <p className="text-sm text-neutral-500">
                  One-off contact for a live interaction demo. Real SMS will be
                  sent to this number when the provider is configured.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLiveClientModal(false)}
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
                  placeholder="e.g. James Carter"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Mobile
                </label>
                <input
                  type="text"
                  placeholder="04xx xxx xxx"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Email (optional — for email demos)
                </label>
                <input
                  type="email"
                  placeholder="e.g. james@example.com"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Vehicle of interest (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024 RAV4 Hybrid Cruiser AWD"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Journey stage
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Buying</option>
                  <option>Trading / upgrading</option>
                  <option>Service & Maintenance</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Context notes (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Anything the room should know during the demo..."
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddLiveClientModal(false)}
                className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Add live client
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Queue */}
        <div className="w-80 border-r border-neutral-200 bg-white flex flex-col">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <span className="text-xs font-bold tracking-widest text-neutral-400">
              LIVE QUEUE
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
              0
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <UserPlus className="h-8 w-8 text-neutral-300" />
            <p className="mt-3 text-sm font-semibold text-neutral-900">
              No live clients yet
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Add a one-off contact to run a live SMS interaction in your next
              partner demo.
            </p>
            <button
              onClick={() => setShowAddLiveClientModal(true)}
              className="mt-4 flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Add live client
            </button>
          </div>
        </div>

        {/* Right main - Chat */}
        <div className="flex flex-1 flex-col items-center justify-center bg-neutral-50/50 p-6 text-center">
          <MessageSquare className="h-10 w-10 text-neutral-300" />
          <p className="mt-4 text-sm font-semibold text-neutral-900">
            Select or add a live client
          </p>
          <p className="mt-1 max-w-sm text-sm text-neutral-500">
            Live threads are backed by a real database and your SMS provider —
            everything the room sees is actually happening.
          </p>
        </div>
      </div>
    </div>
  );
}
