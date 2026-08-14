"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { JobCardItemModal } from "./JobCardItemModal";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";
import { 
  Wrench, 
  User, 
  Car, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ClipboardList, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  Gauge 
} from "lucide-react";

interface JobCardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobCardId: string | null;
  onJobCardUpdated?: () => void; // Triggered when items change so parent page can refresh too
}

const statusTone: Record<string, "blue" | "orange" | "neutral" | "green"> = {
  open: "blue",
  in_progress: "orange",
  awaiting_parts: "neutral",
  completed: "green",
};

const statusLabel: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_parts: "Awaiting Parts",
  completed: "Completed",
};

export function JobCardDetailsModal({ isOpen, onClose, jobCardId, onJobCardUpdated }: JobCardDetailsModalProps) {
  const [jobCard, setJobCard] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sub-resource Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchJobCardDetails = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/job-cards/${id}`, { headers });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to fetch job card details.");
      }
      
      const details = Array.isArray(json.data) ? json.data[0] : json.data;
      setJobCard(details);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && jobCardId) {
      fetchJobCardDetails(jobCardId);
    } else {
      setJobCard(null);
    }
  }, [isOpen, jobCardId]);

  const handleItemSuccess = () => {
    if (jobCardId) {
      fetchJobCardDetails(jobCardId);
    }
    if (onJobCardUpdated) {
      onJobCardUpdated();
    }
  };

  const handleOpenAddItem = () => {
    setSelectedItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: any) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this line item?")) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/job-cards/${jobCardId}/items/${itemId}`, {
        method: "DELETE",
        headers,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to delete line item.");
      }

      toast.success("Line item deleted successfully!");
      handleItemSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item.");
    }
  };

  const getCustomerDisplay = () => {
    const c = jobCard?.customerId || jobCard?.customer;
    if (!c) return "No customer assigned";
    if (typeof c === "string") return `ID: ${c}`;
    if (typeof c === "object") {
      const name = [c.firstName, c.lastName].filter(Boolean).join(" ");
      return (
        <div className="text-sm">
          <p className="font-semibold text-neutral-900">{name || c.name || "Unknown Name"}</p>
          {c.phone && <p className="text-neutral-500 text-xs mt-0.5">{c.phone}</p>}
          {c.email && <p className="text-neutral-500 text-xs">{c.email}</p>}
        </div>
      );
    }
    return "Unknown";
  };

  const getVehicleDisplay = () => {
    const v = jobCard?.vehicleId || jobCard?.vehicle;
    if (!v) return "No vehicle assigned";
    if (typeof v === "string") return `ID: ${v}`;
    if (typeof v === "object") {
      return (
        <div className="text-sm">
          <p className="font-semibold text-neutral-900">
            {v.year} {v.make} {v.model}
          </p>
          <p className="text-neutral-500 text-xs mt-0.5">Rego: {v.rego || "—"}</p>
          <p className="text-neutral-500 text-xs">VIN: {v.vin || "—"}</p>
        </div>
      );
    }
    return "Unknown";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={jobCard ? `Job Card: ${jobCard.orderNumber || "Loading..."}` : "Job Card Details"}
      subtitle="Complete job details, diagnosis history, and line items"
      headerIcon={<Wrench className="h-5 w-5" />}
      maxWidth="max-w-4xl"
    >
      {isLoading && !jobCard ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : jobCard ? (
        <div className="space-y-6">
          {/* Header Overview Card */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-5 border border-neutral-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Order Number</span>
              <h3 className="text-2xl font-bold text-neutral-900 mt-0.5">
                {jobCard.orderNumber || "—"}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={jobCard.status ? (statusTone[jobCard.status] || "neutral") : "neutral"} size="lg">
                {jobCard.status ? (statusLabel[jobCard.status] || jobCard.status) : "Unknown"}
              </Badge>
              <Badge tone={jobCard.priority === "high" || jobCard.priority === "urgent" ? "red" : "neutral"} size="lg">
                {jobCard.priority ? (jobCard.priority.toUpperCase()) : "NORMAL"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer & Vehicle Info */}
            <div className="space-y-4 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-neutral-100 rounded-xl p-4 space-y-3 bg-white shadow-sm">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-50 pb-2">
                  <User className="h-3.5 w-3.5 text-neutral-500" />
                  Customer
                </h4>
                {getCustomerDisplay()}
              </div>

              <div className="border border-neutral-100 rounded-xl p-4 space-y-3 bg-white shadow-sm">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-50 pb-2">
                  <Car className="h-3.5 w-3.5 text-neutral-500" />
                  Vehicle
                </h4>
                {getVehicleDisplay()}
              </div>
            </div>

            {/* Quick Pricing Summary */}
            <div className="border border-neutral-100 rounded-xl p-4 bg-white shadow-sm space-y-3 flex flex-col justify-between">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-50 pb-2">
                <DollarSign className="h-3.5 w-3.5 text-neutral-500" />
                Cost Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Est. Cost:</span>
                  <span className="font-semibold text-neutral-900">${jobCard.estimatedCost || 0}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-50 pt-2">
                  <span className="text-neutral-500">Labour Total:</span>
                  <span className="font-semibold text-neutral-900">${jobCard.labourTotal || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Parts Total:</span>
                  <span className="font-semibold text-neutral-900">${jobCard.partsTotal || 0}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2 text-base font-bold">
                  <span className="text-neutral-800">Actual Cost:</span>
                  <span className="text-violet-600">${jobCard.actualCost || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Info & Diagnosis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Wrench className="h-4 w-4 text-violet-500" />
                Service Request Details
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-neutral-500 block">Service Type</span>
                  <span className="font-medium text-neutral-800 capitalize">{jobCard.serviceType?.replace("_", " ") || "—"}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block">Work Required</span>
                  <p className="mt-0.5 text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 whitespace-pre-line text-xs">
                    {jobCard.workRequired || "No service notes requested."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Gauge className="h-4 w-4 text-violet-500" />
                Technical Diagnosis
              </h4>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-neutral-500 block">Odometer In</span>
                    <span className="font-semibold text-neutral-800">{jobCard.odometerIn ? `${jobCard.odometerIn} km` : "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 block">Odometer Out</span>
                    <span className="font-semibold text-neutral-800">{jobCard.odometerOut ? `${jobCard.odometerOut} km` : "—"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block">Diagnosis Notes</span>
                  <p className="mt-0.5 text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 whitespace-pre-line text-xs min-h-[50px]">
                    {jobCard.diagnosis || "No diagnosis logged yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-violet-500" />
                Line Items (Labour & Parts)
              </h4>
              <button
                type="button"
                onClick={handleOpenAddItem}
                className="flex items-center gap-1 rounded-lg bg-violet-600 hover:bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50 text-xs font-semibold text-neutral-500">
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Part #</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Unit Cost</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3">Technician ID</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {!jobCard.items || jobCard.items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-xs text-neutral-400">
                        No line items found. Click "Add Item" to add labor or parts.
                      </td>
                    </tr>
                  ) : (
                    jobCard.items.map((item: any) => {
                      const id = item._id || item.id;
                      return (
                        <tr key={id} className="hover:bg-neutral-50 text-neutral-700">
                          <td className="px-4 py-3 capitalize">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-2xs font-semibold ${
                              item.type === "labour" ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                            {item.partNumber || "—"}
                          </td>
                          <td className="px-4 py-3 max-w-[150px] truncate" title={item.description}>
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">${item.unitCost || 0}</td>
                          <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                            ${(item.quantity * (item.unitCost || 0)).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 font-mono text-2xs text-neutral-400 truncate max-w-[100px]" title={item.technicianId}>
                            {item.technicianId || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditItem(item)}
                                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                                title="Edit Item"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(id)}
                                className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                                title="Delete Item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex justify-between items-center text-2xs text-neutral-400 border-t border-neutral-100 pt-4">
            <div className="flex gap-4">
              <span>Created: {formatDate(jobCard.createdAt)}</span>
              <span>Updated: {formatDate(jobCard.updatedAt)}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {/* Item Creator/Editor Modal */}
      {jobCard && (
        <JobCardItemModal
          isOpen={isItemModalOpen}
          onClose={() => setIsItemModalOpen(false)}
          onSuccess={handleItemSuccess}
          jobCardId={jobCard._id || jobCard.id}
          item={selectedItem}
        />
      )}
    </Modal>
  );
}
