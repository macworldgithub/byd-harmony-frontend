"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { KeyRound, Loader2, Copy, Check } from "lucide-react";
import { API_URL } from "@/lib/config";

export interface ApiKeyFormValues {
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

const INITIAL_VALUES: ApiKeyFormValues = {
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
};

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

interface AddApiKeyModalProps {
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

export function AddApiKeyModal({ isOpen, onClose, onSuccess }: AddApiKeyModalProps) {
  const [values, setValues] = useState<ApiKeyFormValues>(INITIAL_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setValues(INITIAL_VALUES);
    setError(null);
    setIsLoading(false);
    setCreatedSecret(null);
    setCopied(false);
    setTimeout(() => nameRef.current?.focus(), 80);

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

  const update = <K extends keyof ApiKeyFormValues>(key: K, value: ApiKeyFormValues[K]) => {
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

  const copyToClipboard = () => {
    if (createdSecret) {
      navigator.clipboard.writeText(createdSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) {
      setError("Name is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const body = {
        name: values.name.trim(),
        role: values.role || undefined,
        locationId: values.locationId || undefined,
        department: values.department || undefined,
        isActive: values.isActive,
        scopes: values.scopes.length > 0 ? values.scopes : undefined,
        webhookUrl: values.webhookUrl.trim() || undefined,
        webhookSecret: values.webhookSecret.trim() || undefined,
        retryStrategy: values.retryStrategy || undefined,
        maxRetries: values.maxRetries,
      };

      const res = await fetch(`${API_URL}/api-keys`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message ||
          data?.error ||
          (Array.isArray(data?.message) ? data.message.join(", ") : null) ||
          `Failed to create API key (${res.status})`;
        setError(msg);
        setIsLoading(false);
        return;
      }

      const returnedKey = data?.data?.key || data?.key || data?.data?.webhookSecret || data?.webhookSecret;
      if (returnedKey) {
        setCreatedSecret(returnedKey);
      } else {
        onSuccess?.(data?.data ?? data);
        onClose();
      }
      setIsLoading(false);
    } catch {
      setError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };

  if (createdSecret) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onSuccess?.({});
          onClose();
        }}
        title="API Key Created"
        subtitle="Please copy your secret now."
        headerIcon={<KeyRound className="h-5 w-5" />}
        maxWidth="max-w-xl"
        disableBackdropClose={true}
      >
        <div className="space-y-4 text-center">
          <div className="rounded-full bg-emerald-100 p-3 mx-auto w-fit">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">Successfully generated</h3>
          <p className="text-sm text-neutral-500">
            Copy the secret key below. For your security, it will only be shown once and cannot be retrieved later.
          </p>
          
          <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left">
            <code className="truncate text-sm font-mono text-neutral-700 font-semibold">{createdSecret}</code>
            <button
              type="button"
              onClick={copyToClipboard}
              className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors bg-violet-100 hover:bg-violet-200 px-3 py-1.5 rounded-lg"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="mt-8 pt-4">
            <button
              onClick={() => {
                onSuccess?.({});
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all active:scale-[0.99] bg-neutral-900 hover:bg-neutral-800"
            >
              I have copied my key
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create API Key"
      subtitle="Generate a new key for system integration"
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
            ref={nameRef}
            type="text"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            disabled={isLoading}
            placeholder="e.g., Salesforce Integration"
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
          <select
            value={values.locationId}
            onChange={(e) => update("locationId", e.target.value)}
            disabled={isLoading || locationsLoading}
            className={inputClass}
          >
            <option value="">
              {locationsLoading ? "Loading locations..." : "No location restriction"}
            </option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>
        </Field>

        <div>
          <p className="mb-2 text-sm font-semibold text-neutral-700">API Scopes (Optional)</p>
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
          <h4 className="text-sm font-bold text-neutral-800 mb-4">Webhook Settings (Optional)</h4>
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
                placeholder="Optional verification secret"
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
                Generating...
              </>
            ) : (
              "Generate Key"
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
