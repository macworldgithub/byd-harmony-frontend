"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { AddCustomerModal } from "@/components/customers/AddCustomerModal";
import { EditCustomerModal } from "@/components/customers/EditCustomerModal";
import type { CustomerDetail } from "@/components/customers/CustomerDetailModal";
import {
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Plus,
  ChevronDown,
  Search,
  Pencil,
  Trash2,
  Loader2,
  X,
} from "lucide-react";
import { API_URL } from "@/lib/config";

/* ─── Types ──────────────────────────────────────────────────── */
type Stage = "Prospect" | "Active" | "Service" | "Inactive" | "Archived";

const STAGE_TONE: Record<Stage, "blue" | "green" | "orange" | "neutral"> = {
  Prospect: "blue",
  Active: "green",
  Service: "orange",
  Inactive: "neutral",
  Archived: "neutral",
};

const STAGE_FILTER_OPTIONS = [
  "All Stages",
  "Prospect",
  "Active",
  "Service",
  "Inactive",
  "Archived",
] as const;

type StageFilter = (typeof STAGE_FILTER_OPTIONS)[number];

function toDisplayStage(stage?: string): Stage {
  const map: Record<string, Stage> = {
    prospect: "Prospect",
    active: "Active",
    service: "Service",
    inactive: "Inactive",
    archived: "Archived",
  };
  return map[stage?.toLowerCase() ?? ""] ?? "Prospect";
}

const AVATAR_COLORS = [
  "bg-violet-600",
  "bg-indigo-600",
  "bg-sky-600",
  "bg-teal-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-orange-500",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(first?: string, last?: string): string {
  return `${(first ?? "")[0] ?? ""}${(last ?? "")[0] ?? ""}`.toUpperCase();
}

/* ─── Auth helper ────────────────────────────────────────────── */
function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ExecutiveCustomersPage() {
  const [customers, setCustomers] = useState<CustomerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  /* Search */
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Stage filter */
  const [stageFilter, setStageFilter] = useState<StageFilter>("All Stages");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  /* Modals */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerDetail | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  /* Delete confirmation */
  const [deleteTarget, setDeleteTarget] = useState<CustomerDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ── Fetch all customers ──────────────────────────────────── */
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const res = await fetch(`${API_URL}/customers`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data?.data)) {
        setCustomers(data.data);
      } else {
        setListError(
          data?.message ?? `Failed to load customers (${res.status})`
        );
      }
    } catch {
      setListError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /* ── Search with debounce ─────────────────────────────────── */
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!q.trim()) {
      fetchCustomers();
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      setListError(null);
      try {
        const res = await fetch(
          `${API_URL}/customers/search?q=${encodeURIComponent(q.trim())}`,
          { headers: getAuthHeaders() }
        );
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data?.data)) {
          setCustomers(data.data);
        } else {
          setListError(data?.message ?? "Search failed.");
        }
      } catch {
        setListError("Unable to reach the server.");
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  /* ── Close filter dropdown on outside click ──────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Derived list (stage filter applied client-side) ─────── */
  const displayed =
    stageFilter === "All Stages"
      ? customers
      : customers.filter(
          (c) =>
            toDisplayStage(c.lifecycleStage).toLowerCase() ===
            stageFilter.toLowerCase()
        );

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleCreated = (created: unknown) => {
    if (created && typeof created === "object") {
      setCustomers((prev) => [created as CustomerDetail, ...prev]);
    }
  };

  const handleUpdated = (updated: CustomerDetail) => {
    setCustomers((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
  };

  const openEdit = (customer: CustomerDetail) => {
    setEditCustomer(customer);
    setIsEditOpen(true);
  };

  /* ── Delete customer ─────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/customers/${deleteTarget._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.filter((c) => c._id !== deleteTarget._id)
        );
        setDeleteTarget(null);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.message ?? `Failed to delete customer (${res.status})`);
      }
    } catch {
      alert("Unable to reach the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ─── Render ──────────────────────────────────────────────── */
  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Unified profiles, vehicle history, and communication threads"
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          {isSearching ? (
            <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-violet-400" />
          ) : (
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, email, phone, or suburb..."
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-8 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Stage filter */}
        <div ref={filterRef} className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className="flex items-center justify-between w-32 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
          >
            {stageFilter}
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
              {STAGE_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setStageFilter(opt);
                    setFilterOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left text-sm ${
                    stageFilter === opt
                      ? "bg-violet-50 font-semibold text-violet-700"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-neutral-500">
        {loading ? "Loading..." : `${displayed.length} customers`}
      </p>

      {/* Error state */}
      {listError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {listError}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !listError && displayed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <Search className="h-10 w-10 mb-2" />
          <p className="text-sm">No customers found</p>
        </div>
      )}

      {/* Customer cards */}
      {!loading && displayed.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((c) => {
            const stage = toDisplayStage(c.lifecycleStage);
            const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
            const initials = getInitials(c.firstName, c.lastName);
            const color = avatarColor(fullName);

            return (
              <Panel key={c._id} padded={false} className="flex flex-col">
                <div className="flex items-start gap-3 p-4 flex-1">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color} text-sm font-bold text-white`}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-bold text-neutral-900">
                          {fullName || "Unnamed"}
                        </p>
                        <Badge tone={STAGE_TONE[stage]}>
                          {stage.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Edit & Delete icons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(c)}
                          title="Edit customer"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
                          title="Delete customer"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[13px] text-neutral-500">
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-neutral-400" />
                          {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-neutral-400" />
                          {c.email}
                        </span>
                      )}
                      {c.suburb && (
                        <span className="text-neutral-500">{c.suburb}</span>
                      )}
                    </div>

                    {stage === "Service" && (
                      <div className="mt-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="mr-1">🔧</span> Service
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-neutral-100 p-4 bg-neutral-50/50 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      {c.source && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          {c.source}
                        </span>
                      )}
                      {c.notes && (
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      {/* ── Add Customer Modal ─────────────────────────────────── */}
      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleCreated}
      />

      {/* ── Edit Customer Modal ────────────────────────────────── */}
      <EditCustomerModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditCustomer(null);
        }}
        customer={editCustomer}
        onSuccess={handleUpdated}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-neutral-200"
            style={{ animation: "modalIn 0.18s ease-out forwards" }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Delete Customer
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-neutral-700">
                  {deleteTarget.firstName} {deleteTarget.lastName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
