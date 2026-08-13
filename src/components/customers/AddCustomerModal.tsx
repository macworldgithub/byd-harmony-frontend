"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { UserPlus, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export type LifecycleStage = "prospect" | "active" | "service" | "inactive" | "archived";

const LIFECYCLE_OPTIONS: { value: LifecycleStage; label: string }[] = [
  { value: "prospect", label: "Prospect" },
  { value: "active", label: "Active" },
  { value: "service", label: "Service" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

export interface CustomerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  dateOfBirth: string;
  licenceNumber: string;
  preferredLocationId: string;
  lifecycleStage: LifecycleStage;
  source: string;
  consentSms: boolean;
  consentEmail: boolean;
  consentPhone: boolean;
  notes: string;
}
type Location = {
  _id: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
};
const INITIAL_VALUES: CustomerFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  suburb: "",
  state: "",
  postcode: "",
  dateOfBirth: "",
  licenceNumber: "",
  preferredLocationId: "",
  lifecycleStage: "prospect",
  source: "",
  consentSms: true,
  consentEmail: true,
  consentPhone: true,
  notes: "",
};

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: unknown) => void;
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const [values, setValues] = useState<CustomerFormValues>(INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  // inside the component, with other useState:
const [locations, setLocations] = useState<Location[]>([]);
const [locationsLoading, setLocationsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues(INITIAL_VALUES);
      setError(null);
      setIsLoading(false);
      setTimeout(() => firstNameRef.current?.focus(), 80);
    }
  }, [isOpen]);
useEffect(() => {
  if (!isOpen) return;

  setValues(INITIAL_VALUES);
  setError(null);
  setIsLoading(false);
  setTimeout(() => firstNameRef.current?.focus(), 80);

  // load locations
  const loadLocations = async () => {
    setLocationsLoading(true);
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
      setLocationsLoading(false);
    }
  };

  loadLocations();
}, [isOpen]);
  const update = <K extends keyof CustomerFormValues>(key: K, value: CustomerFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.firstName.trim() || !values.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }
    if (!values.email.trim() && !values.phone.trim()) {
      setError("Please provide at least an email or phone number.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim() || undefined,
        phone: values.phone.trim() || undefined,
        address: values.address.trim() || undefined,
        suburb: values.suburb.trim() || undefined,
        state: values.state.trim() || undefined,
        postcode: values.postcode.trim() || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        licenceNumber: values.licenceNumber.trim() || undefined,
        preferredLocationId: values.preferredLocationId.trim() || undefined,
        lifecycleStage: values.lifecycleStage,
        source: values.source.trim() || undefined,
        consentSms: values.consentSms,
        consentEmail: values.consentEmail,
        consentPhone: values.consentPhone,
        notes: values.notes.trim() || undefined,
      };

      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
          `Failed to create customer (${res.status})`;
        setError(msg);
        setIsLoading(false);
        return;
      }

      onSuccess?.(data?.data ?? data);
      onClose();
    } catch {
      setError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Customer"
      subtitle="Create a new customer record"
      headerIcon={<UserPlus className="h-5 w-5" />}
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
          <Field label="First name" required>
            <input
              ref={firstNameRef}
              type="text"
              value={values.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              disabled={isLoading}
              placeholder="Lee"
              className={inputClass}
              required
            />
          </Field>
          <Field label="Last name" required>
            <input
              type="text"
              value={values.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              disabled={isLoading}
              placeholder="Atkinson"
              className={inputClass}
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              disabled={isLoading}
              placeholder="lee@example.com"
              className={inputClass}
              autoComplete="email"
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              disabled={isLoading}
              placeholder="0412345678"
              className={inputClass}
              autoComplete="tel"
            />
          </Field>
        </div>

        <Field label="Address">
          <input
            type="text"
            value={values.address}
            onChange={(e) => update("address", e.target.value)}
            disabled={isLoading}
            placeholder="12 Example Street"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Suburb">
            <input
              type="text"
              value={values.suburb}
              onChange={(e) => update("suburb", e.target.value)}
              disabled={isLoading}
              placeholder="Richmond"
              className={inputClass}
            />
          </Field>
          <Field label="State">
            <input
              type="text"
              value={values.state}
              onChange={(e) => update("state", e.target.value)}
              disabled={isLoading}
              placeholder="VIC"
              className={inputClass}
            />
          </Field>
          <Field label="Postcode">
            <input
              type="text"
              value={values.postcode}
              onChange={(e) => update("postcode", e.target.value)}
              disabled={isLoading}
              placeholder="3121"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date of birth">
            <input
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
              disabled={isLoading}
              className={inputClass}
            />
          </Field>
          <Field label="Licence number">
            <input
              type="text"
              value={values.licenceNumber}
              onChange={(e) => update("licenceNumber", e.target.value)}
              disabled={isLoading}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Lifecycle stage">
            <select
              value={values.lifecycleStage}
              onChange={(e) => update("lifecycleStage", e.target.value as LifecycleStage)}
              disabled={isLoading}
              className={inputClass}
            >
              {LIFECYCLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Source">
            <input
              type="text"
              value={values.source}
              onChange={(e) => update("source", e.target.value)}
              disabled={isLoading}
              placeholder="Walk-in, Website, Referral..."
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Preferred location">
  <select
    value={values.preferredLocationId}
    onChange={(e) => update("preferredLocationId", e.target.value)}
    disabled={isLoading || locationsLoading}
    className={inputClass}
  >
    <option value="">
      {locationsLoading ? "Loading locations..." : "Select a location (optional)"}
    </option>
    {locations.map((loc) => (
      <option key={loc._id} value={loc._id}>
        {loc.name} — {loc.state}, {loc.address}
        {loc.suburb ? `, ${loc.suburb}` : ""}
      </option>
    ))}
  </select>
</Field>

        <div>
          <p className="mb-2 text-sm font-semibold text-neutral-700">Communication consent</p>
          <div className="flex flex-wrap gap-4">
            <ConsentCheckbox
              id="consentSms"
              label="SMS"
              checked={values.consentSms}
              disabled={isLoading}
              onChange={(v) => update("consentSms", v)}
            />
            <ConsentCheckbox
              id="consentEmail"
              label="Email"
              checked={values.consentEmail}
              disabled={isLoading}
              onChange={(v) => update("consentEmail", v)}
            />
            <ConsentCheckbox
              id="consentPhone"
              label="Phone"
              checked={values.consentPhone}
              disabled={isLoading}
              onChange={(v) => update("consentPhone", v)}
            />
          </div>
        </div>

        <Field label="Notes">
          <textarea
            value={values.notes}
            onChange={(e) => update("notes", e.target.value)}
            disabled={isLoading}
            rows={3}
            placeholder="Any extra notes..."
            className={`${inputClass} resize-y`}
          />
        </Field>

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
                Creating...
              </>
            ) : (
              "Create Customer"
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

function ConsentCheckbox({
  id,
  label,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
      />
      {label}
    </label>
  );
}