"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { LocationSearchSelect } from "@/components/ui/LocationSearchSelect";
import { Wrench, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

export type JobCardStatus = "open" | "in_progress" | "awaiting_parts" | "completed";
export type JobCardPriority = "low" | "normal" | "high" | "urgent";

const STATUS_OPTIONS: { value: JobCardStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "awaiting_parts", label: "Awaiting Parts" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS: { value: JobCardPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export interface JobCardFormValues {
  // Common
  technicianId: string;
  priority: JobCardPriority;

  // POST Only
  customerId: string;
  vehicleId: string;
  locationId: string;
  bookingId: string;
  serviceType: string;
  workRequired: string;
  odometerIn: number | "";
  estimatedCost: number | "";

  // PUT Only
  diagnosis: string;
  odometerOut: number | "";
  actualCost: number | "";
  status: JobCardStatus;
}

const INITIAL_VALUES: JobCardFormValues = {
  customerId: "",
  vehicleId: "",
  locationId: "",
  bookingId: "",
  technicianId: "",
  priority: "normal",
  serviceType: "routine_service",
  workRequired: "",
  odometerIn: "",
  estimatedCost: "",
  diagnosis: "",
  odometerOut: "",
  actualCost: "",
  status: "open",
};

interface JobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobCard?: any | null; // Full job card object if editing
}

export function JobCardModal({ isOpen, onClose, onSuccess, jobCard }: JobCardModalProps) {
  const isEdit = !!jobCard;
  const [values, setValues] = useState<JobCardFormValues>(INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data fetching state for dropdowns
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isFetchingRelations, setIsFetchingRelations] = useState(false);

  const initialFocusRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (!isEdit) {
        // Fetch all related entities for CREATE mode dropdowns
        setIsFetchingRelations(true);
        const headers: HeadersInit = {};
        const token = localStorage.getItem("accessToken");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        Promise.all([
          fetch(`${API_URL}/customers`, { headers }).then((r) => (r.ok ? r.json() : [])),
          fetch(`${API_URL}/vehicles`, { headers }).then((r) => (r.ok ? r.json() : [])),
          fetch(`${API_URL}/locations`, { headers }).then((r) => (r.ok ? r.json() : [])),
          fetch(`${API_URL}/bookings`, { headers }).then((r) => (r.ok ? r.json() : [])),
        ])
          .then(([custData, vehData, locData, bookData]) => {
            setCustomers(custData?.data ?? (Array.isArray(custData) ? custData : []));
            setVehicles(vehData?.data ?? (Array.isArray(vehData) ? vehData : []));
            setLocations(locData?.data ?? (Array.isArray(locData) ? locData : []));
            setBookings(bookData?.data ?? (Array.isArray(bookData) ? bookData : []));
          })
          .catch((err) => console.error("Failed to fetch relations:", err))
          .finally(() => setIsFetchingRelations(false));
      }

      if (isEdit && jobCard) {
        setValues({
          ...INITIAL_VALUES,
          technicianId: jobCard.technicianId || "",
          priority: jobCard.priority || "normal",
          diagnosis: jobCard.diagnosis || "",
          odometerOut: jobCard.odometerOut || "",
          actualCost: jobCard.actualCost || "",
          status: jobCard.status || "open",
        });
      } else {
        setValues(INITIAL_VALUES);
      }
      setError(null);
      setIsLoading(false);
      setTimeout(() => initialFocusRef.current?.focus(), 80);
    }
  }, [isOpen, jobCard, isEdit]);

  const update = <K extends keyof JobCardFormValues>(key: K, value: JobCardFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let payload: any = {};
      let url = `${API_URL}/job-cards`;
      let method = "POST";

      if (isEdit) {
        url = `${API_URL}/job-cards/${jobCard._id || jobCard.id}`;
        method = "PUT";
        payload = {
          technicianId: values.technicianId,
          diagnosis: values.diagnosis,
          odometerOut: values.odometerOut || 0,
          actualCost: values.actualCost || 0,
          status: values.status,
          priority: values.priority,
        };
      } else {
        payload = {
          customerId: values.customerId,
          vehicleId: values.vehicleId,
          locationId: values.locationId,
          bookingId: values.bookingId,
          technicianId: values.technicianId,
          priority: values.priority,
          serviceType: values.serviceType,
          workRequired: values.workRequired,
          odometerIn: values.odometerIn || 0,
          estimatedCost: values.estimatedCost || 0,
        };
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Failed to ${isEdit ? "update" : "create"} job card`);
      }

      toast.success(`Job Card ${isEdit ? "updated" : "created"} successfully!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      toast.error(err.message || "Failed to save job card");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Job Card" : "New Job Card"}
      subtitle={isEdit ? "Update diagnosis and repair details" : "Create a new service job card"}
      headerIcon={<Wrench className="h-5 w-5" />}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          {/* CREATE MODE FIELDS */}
          {!isEdit && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Customer
                </label>
                <select
                  required
                  ref={initialFocusRef}
                  value={values.customerId}
                  onChange={(e) => update("customerId", e.target.value)}
                  disabled={isFetchingRelations}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="">Select a customer</option>
                  {customers.map((c: any) => {
                    const id = c._id || c.id;
                    const name = [c.firstName, c.lastName].filter(Boolean).join(" ") || c.name || id;
                    return (
                      <option key={id} value={id}>
                        {name} {c.email ? `(${c.email})` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Vehicle
                </label>
                <select
                  required
                  value={values.vehicleId}
                  onChange={(e) => update("vehicleId", e.target.value)}
                  disabled={isFetchingRelations}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((v: any) => {
                    const id = v._id || v.id;
                    const label = `${v.year} ${v.make} ${v.model} - ${v.rego || v.vin}`;
                    return (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Location (Optional)
                </label>
                <LocationSearchSelect
                  locations={locations}
                  value={values.locationId}
                  onChange={(val) => update("locationId", val)}
                  disabled={isFetchingRelations}
                  loading={isFetchingRelations}
                  placeholder="Select a location"
                  emptyLabel="Select a location"
                  allowClear
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Booking (Optional)
                </label>
                <select
                  value={values.bookingId}
                  onChange={(e) => update("bookingId", e.target.value)}
                  disabled={isFetchingRelations}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                >
                  <option value="">Select a booking</option>
                  {bookings.map((b: any) => {
                    const id = b._id || b.id;
                    const date = b.serviceDateTime ? new Date(b.serviceDateTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "";
                    const label = [b.serviceType?.replace(/_/g, " "), date].filter(Boolean).join(" — ") || id;
                    return (
                      <option key={id} value={id}>
                        {label} ({b.status || "pending"})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Service Type
                </label>
                <input
                  type="text"
                  required
                  value={values.serviceType}
                  onChange={(e) => update("serviceType", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Odometer In (km)
                </label>
                <input
                  type="number"
                  value={values.odometerIn}
                  onChange={(e) => update("odometerIn", e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Estimated Cost ($)
                </label>
                <input
                  type="number"
                  value={values.estimatedCost}
                  onChange={(e) => update("estimatedCost", e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Work Required
                </label>
                <textarea
                  required
                  rows={3}
                  value={values.workRequired}
                  onChange={(e) => update("workRequired", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </>
          )}

          {/* EDIT MODE FIELDS */}
          {isEdit && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </label>
                <select
                  ref={initialFocusRef}
                  value={values.status}
                  onChange={(e) => update("status", e.target.value as JobCardStatus)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Odometer Out (km)
                </label>
                <input
                  type="number"
                  value={values.odometerOut}
                  onChange={(e) => update("odometerOut", e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Actual Cost ($)
                </label>
                <input
                  type="number"
                  value={values.actualCost}
                  onChange={(e) => update("actualCost", e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Diagnosis
                </label>
                <textarea
                  rows={3}
                  value={values.diagnosis}
                  onChange={(e) => update("diagnosis", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
                />
              </div>
            </>
          )}

          {/* COMMON FIELDS */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Priority
            </label>
            <select
              value={values.priority}
              onChange={(e) => update("priority", e.target.value as JobCardPriority)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Technician ID (Optional)
            </label>
            <input
              type="text"
              value={values.technicianId}
              onChange={(e) => update("technicianId", e.target.value)}
              placeholder="Paste technician ID"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
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
            {isEdit ? "Save Changes" : "Create Job Card"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
