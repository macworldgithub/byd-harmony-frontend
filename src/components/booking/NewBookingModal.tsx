"use client";

import { useState, useEffect, FormEvent } from "react";
import { X, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year?: number | string;
  rego?: string;
}

interface Location {
  _id: string;
  name: string;
  suburb?: string;
  state?: string;
}

type ServiceType = "routine" | "repair" | "inspection" | "warranty" | "other";

const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "routine", label: "Routine Service" },
  { value: "repair", label: "Repair" },
  { value: "inspection", label: "Inspection" },
  { value: "warranty", label: "Warranty" },
  { value: "other", label: "Other" },
];

interface FormState {
  customerId: string;
  vehicleId: string;
  locationId: string;
  scheduledAt: string;
  estimatedDuration: string;
  serviceType: ServiceType;
  description: string;
  status: string;
  assignedTechnicianId: string;
  customerNotes: string;
  internalNotes: string;
}

const DEFAULT_FORM: FormState = {
  customerId: "",
  vehicleId: "",
  locationId: "",
  scheduledAt: "",
  estimatedDuration: "60",
  serviceType: "routine",
  description: "",
  status: "scheduled",
  assignedTechnicianId: "",
  customerNotes: "",
  internalNotes: "",
};

// ─── Auth helper ──────────────────────────────────────────────────────────────

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  booking?: any | null; // For Edit/Update mode
}

export function NewBookingModal({
  isOpen,
  onClose,
  onSuccess,
  booking,
}: NewBookingModalProps) {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Dropdown data ──────────────────────────────────────────────────────────
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // ── Fetch data when modal opens ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    // Set initial form
    if (booking) {
      setForm({
        customerId: typeof booking.customerId === "object" ? booking.customerId?._id || "" : booking.customerId || "",
        vehicleId: typeof booking.vehicleId === "object" ? booking.vehicleId?._id || "" : booking.vehicleId || "",
        locationId: typeof booking.locationId === "object" ? booking.locationId?._id || "" : booking.locationId || "",
        scheduledAt: booking.serviceDateTime || booking.scheduledAt ? new Date(booking.serviceDateTime || booking.scheduledAt).toISOString().slice(0, 16) : "",
        estimatedDuration: String(booking.estimatedDuration || "60"),
        serviceType: booking.serviceType || "routine",
        description: booking.description || booking.serviceDetails || "",
        status: booking.status || "scheduled",
        assignedTechnicianId: booking.assignedTechnicianId ? String(booking.assignedTechnicianId) : "",
        customerNotes: booking.customerNotes || "",
        internalNotes: booking.internalNotes || "",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setError(null);
    setIsLoading(false);

    // Fetch customers
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const res = await fetch(`${API_URL}/customers`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data?.data)) {
          setCustomers(data.data);
        } else {
          setCustomers([]);
        }
      } catch {
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };

    // Fetch vehicles
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const res = await fetch(`${API_URL}/vehicles`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data?.data)) {
          setVehicles(data.data);
        } else {
          setVehicles([]);
        }
      } catch {
        setVehicles([]);
      } finally {
        setLoadingVehicles(false);
      }
    };

    // Fetch locations
    const fetchLocations = async () => {
      setLoadingLocations(true);
      try {
        const res = await fetch(`${API_URL}/locations`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data?.data)) {
          setLocations(data.data);
        } else {
          setLocations([]);
        }
      } catch {
        setLocations([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchCustomers();
    fetchVehicles();
    fetchLocations();
  }, [isOpen]);

  // ── Close on Escape ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // ── Field updater ──────────────────────────────────────────────────────────
  const set =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Submit (POST /api/v1/bookings) ─────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.customerId) {
      setError("Please select a customer.");
      return;
    }
    if (!form.vehicleId) {
      setError("Please select a vehicle.");
      return;
    }
    if (!form.locationId) {
      setError("Please select a location.");
      return;
    }
    if (!form.scheduledAt) {
      setError("Please select a date & time.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body = {
        customerId: form.customerId,
        vehicleId: form.vehicleId,
        locationId: form.locationId,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        estimatedDuration: Number(form.estimatedDuration) || 60,
        serviceType: form.serviceType,
        description: form.description.trim() || undefined,
        status: form.status,
        assignedTechnicianId: form.assignedTechnicianId
          ? Number(form.assignedTechnicianId)
          : 0,
        customerNotes: form.customerNotes.trim() || undefined,
        internalNotes: form.internalNotes.trim() || undefined,
        completedAt: undefined,
      };

      const url = booking ? `${API_URL}/bookings/${booking._id}` : `${API_URL}/bookings`;
      const method = booking ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        const msg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
          `Failed to ${booking ? "update" : "create"} booking (${res.status})`;
        setError(msg);
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

  // ── Styles ─────────────────────────────────────────────────────────────────
  const inputClass =
    "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all disabled:bg-neutral-50 disabled:text-neutral-400";
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
        aria-labelledby="new-booking-title"
        className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]"
        style={{ animation: "newBookingModalIn 0.16s ease-out forwards" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 sticky top-0 bg-white z-10">
          <h2
            id="new-booking-title"
            className="text-[17px] font-bold text-neutral-900"
          >
            {booking ? "Edit Service Booking" : "Create Service Booking"}
          </h2>
          <button
            id="new-booking-close"
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

            {/* Customer */}
            <div>
              <label htmlFor="booking-customer" className={labelClass}>
                Select customer
              </label>
              <select
                id="booking-customer"
                value={form.customerId}
                onChange={set("customerId")}
                disabled={isLoading || loadingCustomers}
                className={inputClass + " cursor-pointer"}
              >
                <option value="">
                  {loadingCustomers ? "Loading customers..." : "Select customer"}
                </option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.firstName} {c.lastName}
                    {c.email ? ` — ${c.email}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div>
              <label htmlFor="booking-vehicle" className={labelClass}>
                Vehicle
              </label>
              <select
                id="booking-vehicle"
                value={form.vehicleId}
                onChange={set("vehicleId")}
                disabled={isLoading || loadingVehicles}
                className={inputClass + " cursor-pointer"}
              >
                <option value="">
                  {loadingVehicles ? "Loading vehicles..." : "Select vehicle"}
                </option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.year ? `${v.year} ` : ""}
                    {v.make} {v.model}
                    {v.rego ? ` (${v.rego})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="booking-location" className={labelClass}>
                Location
              </label>
              <select
                id="booking-location"
                value={form.locationId}
                onChange={set("locationId")}
                disabled={isLoading || loadingLocations}
                className={inputClass + " cursor-pointer"}
              >
                <option value="">
                  {loadingLocations ? "Loading locations..." : "Select location"}
                </option>
                {locations.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                    {l.suburb ? `, ${l.suburb}` : ""}
                    {l.state ? ` ${l.state}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div>
              <label htmlFor="booking-scheduled-at" className={labelClass}>
                Date &amp; Time
              </label>
              <input
                id="booking-scheduled-at"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={set("scheduledAt")}
                disabled={isLoading}
                className={inputClass}
              />
            </div>

            {/* Service Type */}
            <div>
              <label htmlFor="booking-service-type" className={labelClass}>
                Service Type
              </label>
              <select
                id="booking-service-type"
                value={form.serviceType}
                onChange={set("serviceType")}
                disabled={isLoading}
                className={inputClass + " cursor-pointer"}
              >
                {SERVICE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="booking-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="booking-description"
                rows={3}
                placeholder="Service details..."
                value={form.description}
                onChange={set("description")}
                disabled={isLoading}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 sticky bottom-0 bg-white">
            <button
              id="new-booking-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-[#e47e85] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {booking ? "Saving..." : "Creating..."}
                </>
              ) : (
                booking ? "Save Changes" : "Create Booking"
              )}
            </button>
          </div>
        </form>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html:
            "@keyframes newBookingModalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }",
        }}
      />
    </div>
  );
}
