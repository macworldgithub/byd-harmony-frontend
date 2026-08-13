"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Car, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";

export type VehicleStatus = "active" | "disposed" | "traded" | "written_off";

const STATUS_OPTIONS: { value: VehicleStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "disposed", label: "Disposed" },
  { value: "traded", label: "Traded" },
  { value: "written_off", label: "Written Off" },
];

export interface VehicleFormValues {
  customerId: string;
  vin: string;
  rego: string;
  make: string;
  model: string;
  year: number | "";
  colour: string;
  odometer: number | "";
  status: VehicleStatus;
  deliveredAt: string;
  nextServiceDue: string;
  warrantyExpiry: string;
}

const INITIAL_VALUES: VehicleFormValues = {
  customerId: "",
  vin: "",
  rego: "",
  make: "BYD",
  model: "",
  year: new Date().getFullYear(),
  colour: "",
  odometer: 0,
  status: "active",
  deliveredAt: "",
  nextServiceDue: "",
  warrantyExpiry: "",
};

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle?: any | null; // If provided, modal is in "Update" mode
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function VehicleModal({ isOpen, onClose, onSuccess, vehicle }: VehicleModalProps) {
  const [values, setValues] = useState<VehicleFormValues>(INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const [customers, setCustomers] = useState<any[]>([]);
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFetchingCustomers(true);
      fetch(`${API_URL}/customers`, { headers: getAuthHeaders() })
        .then((res) => res.json())
        .then((data) => {
          setCustomers(data?.data ?? (Array.isArray(data) ? data : []));
        })
        .catch((err) => {
          console.error("Failed to fetch customers for vehicle modal:", err);
        })
        .finally(() => {
          setIsFetchingCustomers(false);
        });

      if (vehicle) {
        const rawCust = vehicle.customerId || vehicle.customer;
        const custId =
          typeof rawCust === "object" && rawCust !== null
            ? rawCust._id || rawCust.id || ""
            : rawCust || "";

        setValues({
          customerId: custId,
          vin: vehicle.vin || "",
          rego: vehicle.rego || "",
          make: vehicle.make || "BYD",
          model: vehicle.model || "",
          year: vehicle.year || "",
          colour: vehicle.colour || "",
          odometer: vehicle.odometer || 0,
          status: vehicle.status || "active",
          deliveredAt: vehicle.deliveredAt ? new Date(vehicle.deliveredAt).toISOString().split("T")[0] : "",
          nextServiceDue: vehicle.nextServiceDue ? new Date(vehicle.nextServiceDue).toISOString().split("T")[0] : "",
          warrantyExpiry: vehicle.warrantyExpiry ? new Date(vehicle.warrantyExpiry).toISOString().split("T")[0] : "",
        });
      } else {
        setValues(INITIAL_VALUES);
      }
      setError(null);
      setIsLoading(false);
      setTimeout(() => initialFocusRef.current?.focus(), 80);
    }
  }, [isOpen, vehicle]);

  const update = <K extends keyof VehicleFormValues>(key: K, value: VehicleFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.vin.trim() || !values.rego.trim() || !values.model.trim()) {
      setError("VIN, Rego, and Model are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body = {
        ...values,
        year: Number(values.year),
        odometer: Number(values.odometer),
        deliveredAt: values.deliveredAt ? new Date(values.deliveredAt).toISOString() : undefined,
        nextServiceDue: values.nextServiceDue ? new Date(values.nextServiceDue).toISOString() : undefined,
        warrantyExpiry: values.warrantyExpiry ? new Date(values.warrantyExpiry).toISOString() : undefined,
      };

      const isUpdate = !!vehicle;
      const url = isUpdate ? `${API_URL}/vehicles/${vehicle._id || vehicle.id}` : `${API_URL}/vehicles`;
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
          `Failed to ${isUpdate ? "update" : "create"} vehicle (${res.status})`;
        setError(msg);
        setIsLoading(false);
        return;
      }

      onSuccess?.();
      onClose();
    } catch {
      setError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };

  const isUpdate = !!vehicle;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdate ? "Update Vehicle" : "Add Vehicle"}
      subtitle={isUpdate ? "Modify an existing vehicle record" : "Create a new vehicle record"}
      headerIcon={<Car className="h-5 w-5" />}
      maxWidth="max-w-2xl"
      disableBackdropClose={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              !
            </span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="VIN" required>
            <input
              ref={initialFocusRef}
              type="text"
              value={values.vin}
              onChange={(e) => update("vin", e.target.value)}
              disabled={isLoading}
              placeholder="Vehicle Identification Number"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Registration (Rego)" required>
            <input
              type="text"
              value={values.rego}
              onChange={(e) => update("rego", e.target.value)}
              disabled={isLoading}
              placeholder="e.g. 1AB2CD"
              className={inputClass}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Make" required>
            <input
              type="text"
              value={values.make}
              onChange={(e) => update("make", e.target.value)}
              disabled={isLoading}
              placeholder="BYD"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Model" required>
            <input
              type="text"
              value={values.model}
              onChange={(e) => update("model", e.target.value)}
              disabled={isLoading}
              placeholder="e.g. Atto 3"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Year">
            <input
              type="number"
              value={values.year}
              onChange={(e) => update("year", e.target.value ? Number(e.target.value) : "")}
              disabled={isLoading}
              placeholder="2024"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Colour">
            <input
              type="text"
              value={values.colour}
              onChange={(e) => update("colour", e.target.value)}
              disabled={isLoading}
              placeholder="e.g. Pearl White"
              className={inputClass}
            />
          </Field>
          <Field label="Odometer (km)">
            <input
              type="number"
              value={values.odometer}
              onChange={(e) => update("odometer", e.target.value ? Number(e.target.value) : "")}
              disabled={isLoading}
              placeholder="e.g. 12000"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) => update("status", e.target.value as VehicleStatus)}
              disabled={isLoading}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Customer">
            <select
              value={values.customerId}
              onChange={(e) => update("customerId", e.target.value)}
              disabled={isLoading || isFetchingCustomers}
              className={inputClass}
            >
              <option value="">
                {isFetchingCustomers ? "Loading customers..." : "Select Customer (Optional)"}
              </option>
              {customers.map((c: any) => {
                const id = c._id || c.id;
                const displayName =
                  [c.firstName, c.lastName].filter(Boolean).join(" ") ||
                  c.name ||
                  c.email ||
                  id;
                return (
                  <option key={id} value={id}>
                    {displayName} {c.email && c.email !== displayName ? `(${c.email})` : ""}
                  </option>
                );
              })}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Delivered At">
            <input
              type="date"
              value={values.deliveredAt}
              onChange={(e) => update("deliveredAt", e.target.value)}
              disabled={isLoading}
              className={inputClass}
            />
          </Field>
          <Field label="Next Service Due">
            <input
              type="date"
              value={values.nextServiceDue}
              onChange={(e) => update("nextServiceDue", e.target.value)}
              disabled={isLoading}
              className={inputClass}
            />
          </Field>
          <Field label="Warranty Expiry">
            <input
              type="date"
              value={values.warrantyExpiry}
              onChange={(e) => update("warrantyExpiry", e.target.value)}
              disabled={isLoading}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              boxShadow: "0 4px 14px rgba(109,40,217,0.3)",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isUpdate ? "Updating..." : "Creating..."}
              </>
            ) : isUpdate ? (
              "Update Vehicle"
            ) : (
              "Create Vehicle"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 disabled:opacity-50";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-neutral-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
