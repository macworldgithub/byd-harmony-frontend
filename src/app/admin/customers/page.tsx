"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { API_URL } from "@/lib/config";

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

const ITEMS_PER_PAGE = 20;

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("All Stages");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const filterRef = useRef<HTMLDivElement>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<CustomerDetail | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchCustomers = async (query = "", page = 1, stage: StageFilter = "All Stages") => {
    setLoading(true);
    setListError(null);
    try {
      let url = "";
      if (query.trim()) {
        url = `${API_URL}/customers/search?q=${encodeURIComponent(query.trim())}&page=${page}&limit=${ITEMS_PER_PAGE}`;
        if (stage !== "All Stages") {
          url += `&stage=${encodeURIComponent(stage.toLowerCase())}`;
        }
      } else {
        url = `${API_URL}/customers?page=${page}&limit=${ITEMS_PER_PAGE}`;
        if (stage !== "All Stages") {
          url += `&stage=${encodeURIComponent(stage.toLowerCase())}`;
        }
      }

      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message ?? `Failed to load customers (${res.status})`);
      }

      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setCustomers(list);
      const totalCount = data.meta?.total ?? data.total ?? data.pagination?.total ?? data.totalCount ?? list.length;
      setTotalItems(totalCount);
    } catch (err: any) {
      setListError(err.message || "Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCustomers(searchQuery, currentPage, stageFilter);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, currentPage, stageFilter]);

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

  const handleCreated = () => {
    fetchCustomers(searchQuery, currentPage, stageFilter);
  };

  const handleDeleted = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c._id !== id));
    setTotalItems((prev) => Math.max(0, prev - 1));
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

  return (
    <div>
      <PageHeader
        title="All Customers"
        subtitle="Platform-wide customer records across all sites."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, phone…"
                className="w-60 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
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
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${isSelected
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
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
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
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="h-6 w-6 animate-spin" />
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
            <Panel>
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <Users className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium text-neutral-700">
                  {searchQuery || stageFilter !== "All Stages"
                    ? "No customers matched your search or stage filter."
                    : "No customers yet."}
                </p>
                <p className="max-w-sm text-xs text-neutral-500">
                  {searchQuery || stageFilter !== "All Stages"
                    ? "Try a different search term or clear the filter."
                    : "Click Add Customer to create the first record."}
                </p>
                {!searchQuery && stageFilter === "All Stages" && (
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
          ) : (
            <div className="space-y-3">
              {customers.map((c) => {
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
                  <Panel key={c._id} padded={false}>
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

          {totalItems > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
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
                        className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${isCurrent
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

      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleCreated}
        isAdmin={true}
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
        isAdmin={true}
      />
    </div>
  );
}