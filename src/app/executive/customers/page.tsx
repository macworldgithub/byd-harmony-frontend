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
  ChevronLeft,
  ChevronRight,
  Search,
  Pencil,
  Trash2,
  Loader2,
  X,
  Check,
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

const ITEMS_PER_PAGE = 20;

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

  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("All Stages");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const filterRef = useRef<HTMLDivElement>(null);

  /* Modals */
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerDetail | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  /* Delete confirmation */
  const [deleteTarget, setDeleteTarget] = useState<CustomerDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ── Fetch customers with pagination ──────────────────────── */
  const fetchCustomers = useCallback(
    async (query = "", page = 1, stage: StageFilter = "All Stages") => {
      setLoading(true);
      setListError(null);
      try {
        let url = "";
        if (query.trim()) {
          url = `${API_URL}/customers/search?q=${encodeURIComponent(query.trim())}&page=${page}&limit=${ITEMS_PER_PAGE}`;
          if (stage !== "All Stages") url += `&stage=${encodeURIComponent(stage.toLowerCase())}`;
        } else {
          url = `${API_URL}/customers?page=${page}&limit=${ITEMS_PER_PAGE}`;
          if (stage !== "All Stages") url += `&stage=${encodeURIComponent(stage.toLowerCase())}`;
        }

        const res = await fetch(url, { headers: getAuthHeaders() });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message ?? `Failed to load customers (${res.status})`);
        }
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setCustomers(list);
        const totalCount =
          data.meta?.total ?? data.total ?? data.pagination?.total ?? data.totalCount ?? list.length;
        setTotalItems(totalCount);
      } catch (err: unknown) {
        setListError(err instanceof Error ? err.message : "Unable to reach the server.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCustomers(searchQuery, currentPage, stageFilter);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, currentPage, stageFilter, fetchCustomers]);

  /* ── Close filter dropdown on outside click ──────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + customers.length;

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStageChange = (val: StageFilter) => {
    setStageFilter(val);
    setCurrentPage(1);
    setFilterOpen(false);
  };

  /* ── CRUD Handlers ────────────────────────────────────────── */
  const handleCreated = () => {
    fetchCustomers(searchQuery, currentPage, stageFilter);
  };

  const handleUpdated = (updated: CustomerDetail) => {
    setCustomers((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  const openEdit = (customer: CustomerDetail) => {
    setEditCustomer(customer);
    setIsEditOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/customers/${deleteTarget._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c._id !== deleteTarget._id));
        setTotalItems((prev) => Math.max(0, prev - 1));
        setDeleteTarget(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setListError(data?.message ?? `Failed to delete customer (${res.status})`);
      }
    } catch {
      setListError("Unable to reach the server.");
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
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, phone…"
                className="w-60 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-8 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
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
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                <span>{stageFilter}</span>
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full z-20 mt-1.5 w-44 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
                  {STAGE_FILTER_OPTIONS.map((opt) => {
                    const isSelected = stageFilter === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleStageChange(opt)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                          isSelected
                            ? "bg-violet-50 font-semibold text-violet-700"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-violet-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
          </div>
        }
      />

      {listError && !loading && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            !
          </span>
          {listError}
          <button
            type="button"
            onClick={() => fetchCustomers(searchQuery, currentPage, stageFilter)}
            className="ml-auto shrink-0 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between text-sm text-neutral-500">
            <p>
              Showing{" "}
              <span className="font-semibold text-neutral-800">
                {totalItems === 0 ? 0 : startIndex + 1}
              </span>
              -
              <span className="font-semibold text-neutral-800">
                {Math.min(endIndex, totalItems)}
              </span>{" "}
              of <span className="font-semibold text-neutral-800">{totalItems}</span> customers
              {stageFilter !== "All Stages" && (
                <span className="ml-1.5 inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                  Stage: {stageFilter}
                </span>
              )}
            </p>
          </div>

          {customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <Search className="h-10 w-10 mb-2" />
              <p className="text-sm">
                {searchQuery ? `No results for "${searchQuery}"` : "No customers found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.map((c) => {
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
                            <Badge tone={STAGE_TONE[stage]}>{stage.toUpperCase()}</Badge>
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
                          {c.suburb && <span className="text-neutral-500">{c.suburb}</span>}
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
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
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

          {totalItems > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
              <p className="text-xs text-neutral-500">
                Page <span className="font-semibold text-neutral-800">{currentPage}</span> of{" "}
                <span className="font-semibold text-neutral-800">{totalPages}</span> (20 per page)
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                  })
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) => {
                    if (typeof p === "string") {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-xs text-neutral-400">
                          ...
                        </span>
                      );
                    }
                    const isCurrent = p === currentPage;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                          isCurrent
                            ? "bg-rose-600 text-white shadow-2xs"
                            : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
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
        onSuccess={(updated) => {
          handleUpdated(updated);
          setIsEditOpen(false);
          setEditCustomer(null);
        }}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Delete Customer</h3>
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
        </div>
      )}
    </div>
  );
}
