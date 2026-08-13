
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { AddCustomerModal } from "@/components/customers/AddCustomerModal";
import { CustomerDetailModal } from "@/components/customers/CustomerDetailModal";
import { EditCustomerModal } from "@/components/customers/EditCustomerModal";
import type { CustomerDetail } from "@/components/customers/CustomerDetailModal";
import {
  Phone,
  Mail,
  Clock,
  Users,
  Search,
  Plus,
  Loader2,
  ChevronDown,
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

/* ─── Auth helper ────────────────────────────────────────────── */
function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function AdminCustomersPage() {
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerDetail | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
        setListError(data?.message ?? `Failed to load customers (${res.status})`);
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
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
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

  const handleDeleted = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c._id !== id));
  };

  const handleUpdated = (updated: CustomerDetail) => {
    setCustomers((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
  };

  const openDetail = (id: string) => {
    setSelectedId(id);
    setIsDetailOpen(true);
  };

  const openEdit = (customer: CustomerDetail) => {
    setIsDetailOpen(false);
    setEditCustomer(customer);
    setIsEditOpen(true);
  };

  /* ─── Render ──────────────────────────────────────────────── */
  return (
    <div>
      <PageHeader
        title="All Customers"
        subtitle="Platform-wide customer records across all sites."
        action={
          /* Inline toolbar so we can wire up search + filter properly */
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              {isSearching ? (
                <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-violet-400" />
              ) : (
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, phone…"
                className="w-60 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-8 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
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
                {stageFilter}
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border border-neutral-200 bg-white shadow-lg">
                  {STAGE_FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStageFilter(opt);
                        setFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        stageFilter === opt
                          ? "bg-violet-50 font-semibold text-violet-700"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Customer */}
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                boxShadow: "0 4px 14px rgba(109,40,217,0.25)",
              }}
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </button>
          </div>
        }
      />

      {/* Count / status bar */}
      <p className="mb-4 text-sm text-neutral-500">
        {loading
          ? "Loading customers…"
          : listError
          ? ""
          : displayed.length === 0
          ? searchQuery
            ? `No results for "${searchQuery}"`
            : "No customers yet."
          : `${displayed.length} customer${displayed.length !== 1 ? "s" : ""}${
              stageFilter !== "All Stages" ? ` · ${stageFilter}` : ""
            }${searchQuery ? ` · search: "${searchQuery}"` : ""}`}
      </p>

      {/* Error banner */}
      {listError && !loading && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            !
          </span>
          {listError}
          <button
            type="button"
            onClick={fetchCustomers}
            className="ml-auto shrink-0 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Skeleton / loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !listError && displayed.length === 0 && (
        <Panel>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Users className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-neutral-700">
              {searchQuery ? "No customers found" : "No customers yet"}
            </p>
            <p className="max-w-sm text-xs text-neutral-500">
              {searchQuery
                ? `Try a different search term or clear the filter.`
                : `Click Add Customer to create the first record.`}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="mt-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  boxShadow: "0 4px 14px rgba(109,40,217,0.3)",
                }}
              >
                Add Customer
              </button>
            )}
          </div>
        </Panel>
      )}

      {/* Customer list */}
      {!loading && displayed.length > 0 && (
        <div className="space-y-3">
          {displayed.map((c) => {
            const stage = toDisplayStage(c.lifecycleStage);
            const name =
              [c.firstName, c.lastName].filter(Boolean).join(" ") || "—";
            const initials = name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            const color = avatarColor(name);
            const location =
              [c.suburb, c.state].filter(Boolean).join(", ") || "";
            const lastActivity = c.updatedAt || c.createdAt || "";

            return (
              <Panel
                key={c._id}
                padded={false}
              >
                <div
                  className="flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-violet-50/40 rounded-2xl"
                  onClick={() => openDetail(c._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openDetail(c._id);
                  }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-sm font-bold text-white`}
                  >
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">
                        {name}
                      </p>
                      <Badge tone={STAGE_TONE[stage]}>
                        {stage.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-neutral-400" />
                          {c.email}
                        </span>
                      )}
                      {location && (
                        <span className="text-rose-500">{location}</span>
                      )}
                    </div>

                    {lastActivity && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-400">
                        <Clock className="h-3 w-3" />
                        {new Date(lastActivity).toLocaleString("en-AU", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      {/* ── Modals ──────────────────────────────────────────── */}
      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleCreated}
      />

      <CustomerDetailModal
        customerId={selectedId}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedId(null);
        }}
        onDeleted={handleDeleted}
        onEdit={openEdit}
      />

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
    </div>
  );
}