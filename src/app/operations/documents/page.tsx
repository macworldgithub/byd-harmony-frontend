"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { FileText, Plus, X } from "lucide-react";

export default function OperationsDocumentsPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Manage service documents and reports"
        action={
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Upload Document
          </button>
        }
      />

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Upload Document
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Title
                </label>
                <input
                  type="text"
                  defaultValue="Service report — BYD Atto 3"
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  Document Type
                </label>
                <select className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100">
                  <option>Invoice</option>
                  <option>Quote</option>
                  <option>Contract</option>
                  <option>Licence</option>
                  <option>Insurance</option>
                  <option>Service Report</option>
                  <option>Inspection</option>
                  <option>Warranty</option>
                  <option>Correspondence</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-800">
                  File
                </label>
                <input
                  type="file"
                  className="w-full rounded-2xl border border-rose-500 bg-white px-3 py-3 text-sm text-neutral-700 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-20 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100">
          <FileText className="h-7 w-7 text-neutral-400" />
        </div>
        <p className="mt-4 text-sm font-semibold text-neutral-600">
          No documents yet
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Documents will appear here once created.
        </p>
      </div>
    </div>
  );
}
