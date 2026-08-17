"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";

const TYPE_OPTIONS = ["combined", "sales", "service", "delivery"] as const;
type LocationType = (typeof TYPE_OPTIONS)[number];

interface LocationData {
  _id: string;
  name: string;
  type: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  capacity: number;
  isActive: boolean;
}

interface AddLocationProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** When provided the modal operates in edit/update mode */
  editLocation?: LocationData | null;
}

interface FormState {
  name: string;
  type: LocationType;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  capacity: string;
  email: string;
}

const DEFAULT_FORM: FormState = {
  name: "",
  type: "combined",
  address: "",
  suburb: "",
  state: "VIC",
  postcode: "",
  phone: "",
  capacity: "10",
  email: "",
};

export function AddLocation({ isOpen, onClose, onSuccess, editLocation }: AddLocationProps) {
  const isEditMode = Boolean(editLocation);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (editLocation) {
        setForm({
          name: editLocation.name ?? "",
          type: (TYPE_OPTIONS.includes(editLocation.type as LocationType)
            ? editLocation.type
            : "combined") as LocationType,
          address: editLocation.address ?? "",
          suburb: editLocation.suburb ?? "",
          state: editLocation.state ?? "VIC",
          postcode: editLocation.postcode ?? "",
          phone: editLocation.phone ?? "",
          capacity: String(editLocation.capacity ?? 10),
          email: editLocation.email ?? "",
        });
      } else {
        setForm(DEFAULT_FORM);
      }
    }
  }, [isOpen, editLocation]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Location name is required.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const accessToken = localStorage.getItem("accessToken");
    const body = {
      name: form.name.trim(),
      type: form.type,
      address: form.address.trim(),
      suburb: form.suburb.trim(),
      state: form.state.trim(),
      postcode: form.postcode.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      capacity: Number(form.capacity) || 0,
    };

    try {
      const url = isEditMode
        ? `${API_URL}/locations/${editLocation!._id}`
        : `${API_URL}/locations`;

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message ||
            (isEditMode
              ? "Failed to update location. Please try again."
              : "Failed to create location. Please try again.")
        );
        setIsLoading(false);
        return;
      }

      onClose();
      onSuccess?.();
    } catch {
      setError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-location-title"
        className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl"
        style={{ animation: "addLocModalIn 0.16s ease-out forwards" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2
            id="add-location-title"
            className="text-[17px] font-bold text-neutral-900"
          >
            {isEditMode ? "Edit Location" : "Add Location"}
          </h2>
          <button
            id="add-location-close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-4">
            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="loc-name" className={labelClass}>
                Name
              </label>
              <input
                id="loc-name"
                type="text"
                placeholder="BYD Caroline Springs"
                value={form.name}
                onChange={set("name")}
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            {/* Type */}
            <div>
              <label htmlFor="loc-type" className={labelClass}>
                Type
              </label>
              <select
                id="loc-type"
                value={form.type}
                onChange={set("type")}
                disabled={isLoading}
                className={inputClass + " cursor-pointer"}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="loc-address" className={labelClass}>
                Address
              </label>
              <input
                id="loc-address"
                type="text"
                value={form.address}
                onChange={set("address")}
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            {/* Suburb / State / Postcode */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="loc-suburb" className={labelClass}>
                  Suburb
                </label>
                <input
                  id="loc-suburb"
                  type="text"
                  value={form.suburb}
                  onChange={set("suburb")}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="loc-state" className={labelClass}>
                  State
                </label>
                <input
                  id="loc-state"
                  type="text"
                  placeholder="VIC"
                  value={form.state}
                  onChange={set("state")}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="loc-postcode" className={labelClass}>
                  Postcode
                </label>
                <input
                  id="loc-postcode"
                  type="text"
                  value={form.postcode}
                  onChange={set("postcode")}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone / Capacity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="loc-phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="loc-phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="loc-capacity" className={labelClass}>
                  Capacity (bays)
                </label>
                <input
                  id="loc-capacity"
                  type="number"
                  min={0}
                  placeholder="10"
                  value={form.capacity}
                  onChange={set("capacity")}
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="loc-email" className={labelClass}>
                Email
              </label>
              <input
                id="loc-email"
                type="email"
                value={form.email}
                onChange={set("email")}
                disabled={isLoading}
                className={inputClass}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-100 px-6 py-4">
            <button
              id="add-location-cancel"
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="add-location-submit"
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Location"
              )}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@keyframes addLocModalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }" }} />
    </div>
  );
}
