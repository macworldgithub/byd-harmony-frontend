"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { JobCardModal } from "@/components/job-cards/JobCardModal";
import { JobCardDetailsModal } from "@/components/job-cards/JobCardDetailsModal";
import { getCurrentLocationId, getCurrentSiteName } from "@/lib/locationUtils";
import {
  Wrench,
  Plus,
  Loader2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  DollarSign,
  Calendar,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

/* ── Types ──────────────────────────────────────────────────── */
const STATUS_TONE: Record<string, "blue" | "orange" | "neutral" | "green"> = {
  open: "blue",
  in_progress: "orange",
  awaiting_parts: "neutral",
  completed: "green",
};

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_parts: "Awaiting Parts",
  completed: "Completed",
};

const PRIORITY_TONE: Record<string, "blue" | "orange" | "neutral" | "green"> = {
  low: "neutral",
  normal: "blue",
  high: "orange",
  urgent: "green",
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", {
    dateStyle: "medium",
  });
}

function getInitialLocationId(searchParams: ReturnType<typeof useSearchParams>): string {
  if (typeof window === "undefined") return "";
  const urlSite = searchParams.get("site");
  if (urlSite) return urlSite;
  return getCurrentLocationId();
}

/* ─────────────────────────────────────────────────────────── */

function SiteJobCardsPageInner() {
  const searchParams = useSearchParams();

  const [locationId] = useState<string>(() => getInitialLocationId(searchParams));
  const [siteName] = useState<string>(() => getCurrentSiteName());

  const [jobCards, setJobCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const requestSeq = useRef(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Create/Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobCard, setEditingJobCard] = useState<any | null>(null);

  // Details modal (with item management)
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedJobCardId, setSelectedJobCardId] = useState<string | null>(null);

  /* ── Fetch Job Cards ─────────────────────────────────────── */
  const fetchJobCards = useCallback(
    async (pageNum = 1) => {
      const seq = ++requestSeq.current;
      setLoading(true);
      setListError(null);
      try {
        let url = `${API_URL}/job-cards?page=${pageNum}&limit=${limit}`;
        if (locationId) url += `&locationId=${encodeURIComponent(locationId)}`;
        if (statusFilter !== "All") url += `&status=${encodeURIComponent(statusFilter)}`;

        const res = await fetch(url, { headers: getAuthHeaders() });
        const json = await res.json().catch(() => ({}));
        if (seq !== requestSeq.current) return;

        if (res.ok) {
          setJobCards(Array.isArray(json?.data) ? json.data : []);
          setTotal(json?.meta?.total ?? json?.total ?? 0);
          setPage(json?.meta?.page ?? pageNum);
        } else {
          setListError(json?.message ?? `Failed to load job cards (${res.status})`);
        }
      } catch {
        if (seq === requestSeq.current) setListError("Unable to reach the server.");
      } finally {
        if (seq === requestSeq.current) setLoading(false);
      }
    },
    [locationId, limit, statusFilter]
  );

  useEffect(() => {
    fetchJobCards(1);
  }, [fetchJobCards]);

  /* ── Search ──────────────────────────────────────────────── */
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!q.trim()) {
      fetchJobCards(1);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        let url = `${API_URL}/job-cards/search?q=${encodeURIComponent(q.trim())}`;
        if (locationId) url += `&locationId=${encodeURIComponent(locationId)}`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        const json = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(json?.data)) {
          setJobCards(json.data);
          setTotal(json.data.length);
          setPage(1);
        }
      } catch {}
      finally { setIsSearching(false); }
    }, 400);
  };

  /* ── Outside click for filter ────────────────────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Delete ──────────────────────────────────────────────── */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job card?")) return;
    try {
      const res = await fetch(`${API_URL}/job-cards/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        toast.success("Job card deleted.");
        setJobCards((prev) => prev.filter((jc) => (jc._id || jc.id) !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json?.message || "Delete failed.");
      }
    } catch {
      toast.error("Network error. Could not delete job card.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const STATUS_OPTIONS = ["All", "open", "in_progress", "awaiting_parts", "completed"];

  return (
    <div>
      <PageHeader
        title="Site Job Cards"
        subtitle={
          siteName
            ? `Service job cards for ${siteName}`
            : "Service job cards for your assigned site location."
        }
        action={
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              {isSearching ? (
                <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-rose-500" />
              ) : (
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search job cards…"
                className="w-56 rounded-xl border border-neutral-200 bg-white py-2 pl-9 pr-8 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
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

            {/* Status filter */}
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
              >
                {statusFilter === "All" ? "All Statuses" : STATUS_LABEL[statusFilter] || statusFilter}
                <ChevronLeft className="h-4 w-4 rotate-[-90deg] text-neutral-400" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-neutral-200 bg-white shadow-lg">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt);
                        setFilterOpen(false);
                        fetchJobCards(1);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        statusFilter === opt
                          ? "bg-rose-50 font-semibold text-rose-700"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {opt === "All" ? "All Statuses" : STATUS_LABEL[opt] || opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={() => {
                setEditingJobCard(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Job Card
            </button>
          </div>
        }
      />

      {/* Active Location Badge */}
      {locationId && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3.5 py-2 text-xs font-semibold text-rose-700">
          <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
          <span>Active Location: {siteName || locationId}</span>
        </div>
      )}

      {/* Status bar */}
      <p className="mb-4 text-sm text-neutral-500">
        {loading
          ? "Loading job cards…"
          : listError
          ? ""
          : jobCards.length === 0
          ? "No job cards found for this site."
          : `Showing ${jobCards.length} of ${total} job card${total !== 1 ? "s" : ""}${
              statusFilter !== "All" ? ` · ${STATUS_LABEL[statusFilter] || statusFilter}` : ""
            }`}
      </p>

      {/* Error */}
      {listError && !loading && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            !
          </span>
          {listError}
          <button
            type="button"
            onClick={() => fetchJobCards(page)}
            className="ml-auto shrink-0 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-neutral-100 border border-neutral-200"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !listError && jobCards.length === 0 && (
        <Panel>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Wrench className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-neutral-700">No job cards yet</p>
            <p className="max-w-sm text-xs text-neutral-500">
              Click New Job Card to create the first service work order for this location.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingJobCard(null);
                setIsModalOpen(true);
              }}
              className="mt-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition-colors shadow-md"
            >
              New Job Card
            </button>
          </div>
        </Panel>
      )}

      {/* Job Cards List */}
      {!loading && jobCards.length > 0 && (
        <div className="space-y-3">
          {jobCards.map((jc) => {
            const id = jc._id || jc.id;
            const statusKey = jc.status || "open";
            const priority = jc.priority || "normal";
            const customerName = jc.customerId?.firstName
              ? `${jc.customerId.firstName} ${jc.customerId.lastName || ""}`.trim()
              : jc.customerName || "—";
            const vehicleLabel = jc.vehicleId
              ? `${jc.vehicleId.year || ""} ${jc.vehicleId.make || ""} ${jc.vehicleId.model || ""}`.trim() ||
                jc.vehicleId.rego ||
                "—"
              : "—";

            return (
              <Panel key={id} padded={false}>
                <div className="flex items-start gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    <Wrench className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">
                        {jc.jobCardNumber || id.slice(-6).toUpperCase()}
                      </p>
                      <Badge tone={STATUS_TONE[statusKey]}>
                        {STATUS_LABEL[statusKey] || statusKey}
                      </Badge>
                      <Badge tone={PRIORITY_TONE[priority]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Badge>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                      {customerName !== "—" && (
                        <span className="font-medium text-neutral-700">{customerName}</span>
                      )}
                      {vehicleLabel !== "—" && <span>{vehicleLabel}</span>}
                      {jc.serviceType && (
                        <span className="capitalize text-rose-500">
                          {jc.serviceType.replace(/_/g, " ")}
                        </span>
                      )}
                      {jc.estimatedCost != null && (
                        <span className="flex items-center gap-0.5">
                          <DollarSign className="h-3 w-3" />
                          {Number(jc.estimatedCost).toFixed(2)}
                        </span>
                      )}
                      {jc.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(jc.createdAt)}
                        </span>
                      )}
                    </div>

                    {jc.workRequired && (
                      <p className="mt-1.5 text-xs text-neutral-400 line-clamp-1">
                        {jc.workRequired}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobCardId(id);
                        setIsDetailOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      title="View details & items"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingJobCard(jc);
                        setIsModalOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                      title="Edit job card"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(id)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete job card"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
          <p className="text-xs text-neutral-500">
            Page <span className="font-semibold text-neutral-800">{page}</span> of{" "}
            <span className="font-semibold text-neutral-800">{totalPages}</span> · Total{" "}
            <span className="font-semibold text-neutral-800">{total}</span> job cards
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchJobCards(page - 1)}
              className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => fetchJobCards(p)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                    p === page
                      ? "bg-rose-600 text-white"
                      : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {p}
                </button>
              ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => fetchJobCards(page + 1)}
              className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal — locationId pre-filled, no location selector shown */}
      <JobCardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJobCard(null);
        }}
        onSuccess={() => {
          fetchJobCards(1);
          setIsModalOpen(false);
          setEditingJobCard(null);
        }}
        jobCard={editingJobCard}
        locationId={locationId}
      />

      {/* Details Modal (view full job card + manage items) */}
      <JobCardDetailsModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedJobCardId(null);
        }}
        jobCardId={selectedJobCardId}
        onJobCardUpdated={() => fetchJobCards(page)}
      />
    </div>
  );
}

export default function SiteJobCardsPage() {
  return (
    <Suspense fallback={null}>
      <SiteJobCardsPageInner />
    </Suspense>
  );
}
