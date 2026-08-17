"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  Key,
  Shield,
  Building2,
  MapPin,
  Calendar,
  Activity,
  Globe,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import { Badge } from "@/components/ui/Badge";

export interface ApiKeyDetail {
  _id: string;
  name: string;
  keyPrefix: string;
  role?: string;
  locationId?: string;
  department?: string;
  isActive: boolean;
  scopes?: string[];
  retryStrategy?: string;
  maxRetries?: number;
  createdAt: string;
  updatedAt: string;
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export interface ApiKeyDetailModalProps {
  apiKeyId: string | null | undefined;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (apiKey: ApiKeyDetail) => void;
  onDeleted?: (id: string) => void;
}

export function ApiKeyDetailModal({ apiKeyId, isOpen, onClose, onEdit, onDeleted }: ApiKeyDetailModalProps) {
  const [apiKey, setApiKey] = useState<ApiKeyDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isOpen || !apiKeyId) {
      setApiKey(null);
      setError(null);
      setConfirmDelete(false);
      setDeleting(false);
      return;
    }

    const fetchApiKey = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api-keys/${apiKeyId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.data) {
          setApiKey(data.data);
        } else {
          setError(data?.message ?? `Failed to load API key (${res.status})`);
        }
      } catch {
        setError("Unable to reach the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchApiKey();
  }, [isOpen, apiKeyId]);

  const handleDelete = async () => {
    if (!apiKey) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api-keys/${apiKey._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        onDeleted?.(apiKey._id);
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Failed to delete API key.");
        setDeleting(false);
        setConfirmDelete(false);
      }
    } catch {
      setError("Unable to reach the server.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Key Details"
      subtitle="View API key information and configuration"
      headerIcon={<Key className="h-5 w-5" />}
      maxWidth="max-w-2xl"
      disableBackdropClose={deleting}
      footer={
        apiKey ? (
          <div className="flex justify-between items-center w-full">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                confirmDelete 
                  ? "bg-rose-600 text-white hover:bg-rose-700" 
                  : "text-rose-600 hover:bg-rose-50 border border-transparent"
              }`}
            >
              {deleting ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</span>
              ) : confirmDelete ? (
                "Click to confirm deletion"
              ) : (
                "Delete Key"
              )}
            </button>

            {onEdit && (
              <button
                onClick={() => onEdit(apiKey)}
                disabled={deleting}
                className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                Edit Key
              </button>
            )}
          </div>
        ) : undefined
      }
    >
      <div className="space-y-6 pb-2">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !apiKey && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            <p className="mt-4 text-sm text-neutral-500">Loading API key details...</p>
          </div>
        )}

        {!loading && apiKey && (
          <>
            {/* Header / Summary */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between rounded-2xl bg-neutral-50 p-5 border border-neutral-100">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 shadow-sm">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">{apiKey.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                    <code className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {apiKey.keyPrefix}...
                    </code>
                    <span>•</span>
                    <Badge tone={apiKey.isActive ? "green" : "neutral"}>
                      {apiKey.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Access & Role */}
              <div className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
                <h4 className="mb-4 text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-neutral-400" /> Access & Role
                </h4>
                <div className="space-y-3">
                  <DetailRow label="Role" value={apiKey.role} icon={<Shield className="h-4 w-4" />} />
                  <DetailRow label="Department" value={apiKey.department} icon={<Building2 className="h-4 w-4" />} />
                  <DetailRow label="Location ID" value={apiKey.locationId} icon={<MapPin className="h-4 w-4" />} />
                </div>
              </div>

              {/* Configuration */}
              <div className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
                <h4 className="mb-4 text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-neutral-400" /> Configuration
                </h4>
                <div className="space-y-3">
                  <DetailRow label="Retry Strategy" value={apiKey.retryStrategy} icon={<Activity className="h-4 w-4" />} />
                  <DetailRow label="Max Retries" value={apiKey.maxRetries?.toString()} icon={<Activity className="h-4 w-4" />} />
                  <DetailRow label="Created At" value={formatDate(apiKey.createdAt)} icon={<Calendar className="h-4 w-4" />} />
                  <DetailRow label="Updated At" value={formatDate(apiKey.updatedAt)} icon={<Clock className="h-4 w-4" />} />
                </div>
              </div>
            </div>

            {/* Scopes */}
            {apiKey.scopes && apiKey.scopes.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
                <h4 className="mb-3 text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-neutral-400" /> API Scopes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {apiKey.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200 capitalize"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {!apiKey.isActive && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <XCircle className="h-5 w-5 shrink-0" />
                This API key is currently inactive. It will not authenticate any requests.
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-neutral-400">{icon}</div>
      <div>
        <p className="text-xs font-medium text-neutral-500">{label}</p>
        <p className="text-sm font-semibold text-neutral-900 capitalize">
          {value || <span className="text-neutral-400 font-normal">Not specified</span>}
        </p>
      </div>
    </div>
  );
}
