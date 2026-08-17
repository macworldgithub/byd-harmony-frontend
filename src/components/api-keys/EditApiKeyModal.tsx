"use client";

import { useState, useEffect, FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { LocationSearchSelect } from "@/components/ui/LocationSearchSelect";
import { KeyRound, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";
import { ApiKeyDetail } from "./ApiKeyDetailModal";

export interface UpdateApiKeyFormValues {
  name: string;
  role: string;
  locationId: string;
  department: string;
  isActive: boolean;
  scopes: string[];
  webhookUrl: string;
  webhookSecret: string;
  retryStrategy: string;
  maxRetries: number;
}

const ROLES = ['sales', 'service', 'delivery', 'admin', 'executive', 'readonly'];
const DEPARTMENTS = ['sales', 'service', 'delivery', 'finance', 'executive'];
const RETRY_STRATEGIES = ['immediate', 'linear', 'exponential'];
const SCOPES = ['sales', 'service', 'delivery', 'admin'];

type Location = {
  _id: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
};

interface EditApiKeyModalProps {
  apiKey: ApiKeyDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updated: unknown) => void;
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function EditApiKeyModal({ apiKey, isOpen, onClose, onSuccess }: EditApiKeyModalProps) {
  const [values, setValues] = useState<UpdateApiKeyFormValues>({
    name: "",
    role: "",
    locationId: "",
    department: "",
    isActive: true,
    scopes: [],
    webhookUrl: "",
    webhookSecret: "",
    retryStrategy: "immediate",
    maxRetries: 3,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (apiKey) {
      setValues({
        name: apiKey.name || "",
        role: apiKey.role || "",
        locationId: apiKey.locationId || "",
        department: apiKey.department || "",
        isActive: apiKey.isActive ?? true,
        scopes: apiKey.scopes || [],
        webhookUrl: "", // Usually we don't fetch this for security, keep blank
        webhookSecret: "", // Keep blank unless updating
        retryStrategy: apiKey.retryStrategy || "immediate",
        maxRetries: apiKey.maxRetries ?? 3,
      });
    }
    
    setError(null);
    setIsLoading(false);

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
  }, [isOpen, apiKey]);

  const update = <K extends keyof UpdateApiKeyFormValues>(key: K, value: UpdateApiKeyFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleScope = (scope: string) => {
    setValues((prev) => {
      const scopes = prev.scopes.includes(scope)
        ? prev.scopes.filter((s) => s !== scope)
        : [...prev.scopes, scope];
      return { ...prev, scopes };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;
    
    if (!values.name.trim()) {
      setError("Name is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build the update payload
      const body: any = {
        name: values.name.trim(),
        role: values.role || undefined,
        locationId: values.locationId || undefined,
        department: values.department || undefined,
        isActive: values.isActive,
        scopes: values.scopes.length > 0 ? values.scopes : undefined,
        retryStrategy: values.retryStrategy || undefined,
        maxRetries: values.maxRetries,
      };

      // Only include webhook details if they've typed something
      if (values.webhookUrl.trim()) body.webhookUrl = values.webhookUrl.trim();
      if (values.webhookSecret.trim()) body.webhookSecret = values.webhookSecret.trim();

      const res = await fetch(`${API_URL}/api-keys/${apiKey._id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.message) ? data.message.join(", ") : null) ||
          `Failed to update API key (${res.status})`;
        setError(msg);
        setIsLoading(false);
        return;
      }

      onSuccess?.(data?.data ?? data);
      onClose();
      setIsLoading(false);
    } catch {
      setError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };

  if (!apiKey) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit API Key"
      subtitle={`Updating ${apiKey.name}`}
      headerIcon={<KeyRound className="h-5 w-5" />}
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

        <Field label="Key Name" required>
          <input
            type="text"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            disabled={isLoading}
            className={inputClass}
            required
            maxLength={200}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Role">
            <select
              value={values.role}
              onChange={(e) => update("role", e.target.value)}
              disabled={isLoading}
              className={inputClass}
            >
              <option value="">Select a role (optional)</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Department">
            <select
              value={values.department}
              onChange={(e) => update("department", e.target.value)}
              disabled={isLoading}
              className={inputClass}
            >
              <option value="">Select a department (optional)</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Location Restriction">
          <LocationSearchSelect
            locations={locations}
            value={values.locationId}
            onChange={(val) => update("locationId", val)}
            disabled={isLoading || locationsLoading}
            loading={locationsLoading}
            placeholder="No location restriction"
            emptyLabel="No location restriction"
            allowClear
          />
        </Field>

        <div>
          <p className="mb-2 text-sm font-semibold text-neutral-700">API Scopes</p>
          <div className="flex flex-wrap gap-4">
            {SCOPES.map(scope => (
              <label key={scope} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={values.scopes.includes(scope)}
                  disabled={isLoading}
                  onChange={() => toggleScope(scope)}
                  className="h-4 w-4 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                />
                {scope.charAt(0).toUpperCase() + scope.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4 pb-2">
          <h4 className="text-sm font-bold text-neutral-800 mb-4">Webhook Settings</h4>
          <p className="text-xs text-neutral-500 mb-4">Leave blank to keep existing webhook configuration unchanged.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Webhook URL">
              <input
                type="url"
                value={values.webhookUrl}
                onChange={(e) => update("webhookUrl", e.target.value)}
                disabled={isLoading}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>
            <Field label="Webhook Secret">
              <input
                type="password"
                value={values.webhookSecret}
                onChange={(e) => update("webhookSecret", e.target.value)}
                disabled={isLoading}
                placeholder="New verification secret"
                className={inputClass}
              />
            </Field>
            <Field label="Retry Strategy">
              <select
                value={values.retryStrategy}
                onChange={(e) => update("retryStrategy", e.target.value)}
                disabled={isLoading}
                className={inputClass}
              >
                {RETRY_STRATEGIES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Max Retries">
              <input
                type="number"
                min="0"
                max="10"
                value={values.maxRetries}
                onChange={(e) => update("maxRetries", parseInt(e.target.value) || 0)}
                disabled={isLoading}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            id="isActive"
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
            disabled={isLoading}
            className="h-4 w-4 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-neutral-700 cursor-pointer">
            Key is Active
          </label>
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
                Updating...
              </>
            ) : (
              "Save Changes"
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
    <div className="space-y-1.5 flex flex-col">
      <label className="block text-sm font-semibold text-neutral-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}
