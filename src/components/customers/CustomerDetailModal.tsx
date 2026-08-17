"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Tag,
  Globe,
  MessageSquare,
  FileText,
  Loader2,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import { Badge } from "@/components/ui/Badge";

/* ─── Types ─────────────────────────────────────────────────── */
/** The API may return preferredLocationId as a populated object or a plain ID string */
export type PopulatedLocation = { _id: string; name: string };

export interface CustomerDetail {
  _id: string;
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
  /** Populated by the API as { _id, name } or a bare ID string or null */
  preferredLocationId: PopulatedLocation | string | null;
  lifecycleStage: string;
  source: string;
  consentSms: boolean;
  consentEmail: boolean;
  consentPhone: boolean;
  notes: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Safely extract the location ID string regardless of populated shape */
export function getLocationId(loc: CustomerDetail["preferredLocationId"]): string {
  if (!loc) return "";
  if (typeof loc === "object") return loc._id;
  return loc;
}

/** Safely extract the location display name */
export function getLocationName(loc: CustomerDetail["preferredLocationId"]): string {
  if (!loc) return "";
  if (typeof loc === "object") return loc.name;
  return loc; // fallback: show raw ID
}

type StageTone = "blue" | "green" | "orange" | "neutral";

const STAGE_TONE: Record<string, StageTone> = {
  prospect: "blue",
  active: "green",
  service: "orange",
  inactive: "neutral",
  archived: "neutral",
};

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/* ─── Props ──────────────────────────────────────────────────── */
export interface CustomerDetailModalProps {
  customerId: string | null | undefined;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: (id: string) => void;
  onEdit?: (customer: CustomerDetail) => void;
}

/* ─── Component ──────────────────────────────────────────────── */
export function CustomerDetailModal({
  customerId,
  isOpen,
  onClose,
  onDeleted,
  onEdit,
}: CustomerDetailModalProps) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isOpen || !customerId) {
      setCustomer(null);
      setError(null);
      setConfirmDelete(false);
      return;
    }

    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/customers/${customerId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.data) {
          setCustomer(data.data);
        } else {
          setError(data?.message ?? `Failed to load customer (${res.status})`);
        }
      } catch {
        setError("Unable to reach the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [isOpen, customerId]);

  const handleDelete = async () => {
    if (!customer) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/customers/${customer._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        onDeleted?.(customer._id);
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? `Delete failed (${res.status})`);
        setConfirmDelete(false);
      }
    } catch {
      setError("Unable to reach the server.");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const fullName = customer
    ? `${customer.firstName} ${customer.lastName}`.trim()
    : "";

  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const stage = customer?.lifecycleStage ?? "";
  const stageTone: StageTone = STAGE_TONE[stage.toLowerCase()] ?? "neutral";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={loading ? "Loading\u2026" : fullName || "Customer Detail"}
      subtitle={customer ? `ID: ${customer._id}` : undefined}
      headerIcon={<User className="h-5 w-5" />}
      maxWidth="max-w-2xl"
      disableBackdropClose={deleting}
    >
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm text-neutral-500">Loading customer details\u2026</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            !
          </span>
          {error}
        </div>
      )}

      {!loading && customer && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 p-4 border border-violet-100">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-neutral-900">
                  {fullName}
                </h3>
                <Badge tone={stageTone}>{stage.toUpperCase()}</Badge>
                {customer.isDeleted && <Badge tone="neutral">DELETED</Badge>}
              </div>
              {customer.source && (
                <p className="mt-0.5 text-xs text-neutral-500">
                  Source:{" "}
                  <span className="font-medium">{customer.source}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow icon={<Mail className="h-4 w-4" />} label="Email">
              {customer.email || "\u2014"}
            </DetailRow>
            <DetailRow icon={<Phone className="h-4 w-4" />} label="Phone">
              {customer.phone || "\u2014"}
            </DetailRow>
            <DetailRow icon={<MapPin className="h-4 w-4" />} label="Address" fullWidth>
              {[customer.address, customer.suburb, customer.state, customer.postcode]
                .filter(Boolean)
                .join(", ") || "\u2014"}
            </DetailRow>
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth">
              {customer.dateOfBirth
                ? new Date(customer.dateOfBirth).toLocaleDateString("en-AU", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "\u2014"}
            </DetailRow>
            <DetailRow icon={<CreditCard className="h-4 w-4" />} label="Licence No.">
              {customer.licenceNumber || "\u2014"}
            </DetailRow>
            <DetailRow icon={<Tag className="h-4 w-4" />} label="Lifecycle Stage">
              <span className="capitalize">{customer.lifecycleStage || "\u2014"}</span>
            </DetailRow>
            <DetailRow icon={<Globe className="h-4 w-4" />} label="Source">
              {customer.source || "\u2014"}
            </DetailRow>
            <DetailRow icon={<MapPin className="h-4 w-4" />} label="Preferred Location">
              {getLocationName(customer.preferredLocationId) || "\u2014"}
            </DetailRow>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-700 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-neutral-400" />
              Communication Consent
            </p>
            <div className="flex flex-wrap gap-3">
              <ConsentBadge label="SMS" allowed={customer.consentSms} />
              <ConsentBadge label="Email" allowed={customer.consentEmail} />
              <ConsentBadge label="Phone" allowed={customer.consentPhone} />
            </div>
          </div>

          {customer.notes && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-neutral-700">
                <FileText className="h-4 w-4 text-neutral-400" />
                Notes
              </p>
              <p className="rounded-xl bg-neutral-50 border border-neutral-100 px-4 py-3 text-sm text-neutral-700 leading-relaxed">
                {customer.notes}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-[11px] text-neutral-400 border-t border-neutral-100 pt-3">
            <span>
              Created:{" "}
              {new Date(customer.createdAt).toLocaleString("en-AU", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <span>
              Updated:{" "}
              {new Date(customer.updatedAt).toLocaleString("en-AU", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {confirmDelete ? (
                <>
                  <span className="text-xs font-medium text-rose-600">
                    Are you sure?
                  </span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    {deleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Close
              </button>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(customer)}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                    boxShadow: "0 4px 14px rgba(109,40,217,0.3)",
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function DetailRow({
  icon,
  label,
  children,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl bg-neutral-50 border border-neutral-100 px-3.5 py-3 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <span className="mt-0.5 shrink-0 text-neutral-400">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          {label}
        </p>
        <p className="text-sm font-medium text-neutral-800">{children}</p>
      </div>
    </div>
  );
}

function ConsentBadge({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        allowed
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-neutral-100 text-neutral-500 border border-neutral-200"
      }`}
    >
      {allowed ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {label}
    </div>
  );
}
