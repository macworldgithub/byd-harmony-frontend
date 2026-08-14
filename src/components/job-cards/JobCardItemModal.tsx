"use client";

import { useState, useEffect, FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { ClipboardList, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

interface JobCardItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobCardId: string;
  item?: any | null; // Pass item if editing
}

export function JobCardItemModal({ isOpen, onClose, onSuccess, jobCardId, item }: JobCardItemModalProps) {
  const isEdit = !!item;
  const [type, setType] = useState<"labour" | "parts">("labour");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [partNumber, setPartNumber] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setType(item.type || "labour");
        setDescription(item.description || "");
        setQuantity(item.quantity ?? 1);
        setUnitCost(item.unitCost ?? 0);
        setPartNumber(item.partNumber || "");
        setTechnicianId(item.technicianId || "");
      } else {
        setType("labour");
        setDescription("");
        setQuantity(1);
        setUnitCost(0);
        setPartNumber("");
        setTechnicianId("");
      }
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, item]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      type,
      description,
      quantity: Number(quantity),
      unitCost: Number(unitCost),
      partNumber: type === "parts" ? partNumber : undefined,
      technicianId: technicianId.trim() || undefined,
    };

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = isEdit
        ? `${API_URL}/job-cards/${jobCardId}/items/${item._id || item.id}`
        : `${API_URL}/job-cards/${jobCardId}/items`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEdit ? "update" : "add"} item.`);
      }

      toast.success(`Item ${isEdit ? "updated" : "added"} successfully!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      toast.error(err.message || "Operation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Line Item" : "Add Line Item"}
      subtitle={isEdit ? "Update line item details" : "Add labor or parts to this job card"}
      headerIcon={<ClipboardList className="h-5 w-5" />}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Item Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "labour" | "parts")}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          >
            <option value="labour">Labour</option>
            <option value="parts">Parts</option>
          </select>
        </div>

        {type === "parts" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Part Number
            </label>
            <input
              type="text"
              required
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="e.g. BYD-FIL-102"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Description
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={type === "labour" ? "e.g. Standard 10k service labour" : "e.g. Engine Oil Filter"}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Quantity
            </label>
            <input
              type="number"
              required
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Unit Cost ($)
            </label>
            <input
              type="number"
              required
              min={0}
              step="0.01"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Technician ID (Optional)
          </label>
          <input
            type="text"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            placeholder="Technician ID"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
