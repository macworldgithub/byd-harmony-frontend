"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  ClipboardList,
  DollarSign,
  Calendar,
  Plus,
  X,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Wrench,
  Trash2,
  Eye,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";
import { JobCardDetailsModal } from "@/components/job-cards/JobCardDetailsModal";

/* ── Status maps ─────────────────────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  awaiting_parts: "bg-neutral-100 text-neutral-700",
  completed: "bg-emerald-100 text-emerald-700",
};

const STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_parts: "Awaiting Parts",
  completed: "Completed",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-neutral-100 text-neutral-600",
  normal: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function getLocationId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("selectedSiteId") || "";
  if (!id) {
    const saved = localStorage.getItem("selectedLocation");
    if (saved) {
      try { const p = JSON.parse(saved); id = p._id || p.id || ""; } catch {}
    }
  }
  return id;
}

function getSiteName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("selectedSite") || "";
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AU", { dateStyle: "medium" });
}

/* ─────────────────────────────────────────────────────────── */

export default function OperationsJobCardsPage() {
  const [locationId] = useState<string>(() => getLocationId());
  const [siteName] = useState<string>(() => getSiteName());

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

  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const [showNewJobCardModal, setShowNewJobCardModal] = useState(false);

  // Details modal
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

  useEffect(() => { fetchJobCards(1); }, [fetchJobCards]);

  /* ── Search ──────────────────────────────────────────────── */
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!q.trim()) { fetchJobCards(1); return; }

    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        let url = `${API_URL}/job-cards?q=${encodeURIComponent(q.trim())}`;
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
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Delete ──────────────────────────────────────────────── */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job card?")) return;
    try {
      const res = await fetch(`${API_URL}/job-cards/${id}`, { method: "DELETE", headers: getAuthHeaders() });
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
        title="Job Cards"
        subtitle="Service work orders with unique order numbers"
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
                <button type="button" onClick={() => handleSearchChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Status filter */}
            <div ref={filterRef} className="relative">
              <button type="button" onClick={() => setFilterOpen((v) => !v)} className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                {statusFilter === "All" ? "All Statuses" : STATUS_LABEL[statusFilter] || statusFilter}
                <ChevronLeft className="h-4 w-4 rotate-[-90deg] text-neutral-400" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-neutral-200 bg-white shadow-lg">
                  {STATUS_OPTIONS.map((opt) => (
                    <button key={opt} type="button"
                      onClick={() => { setStatusFilter(opt); setFilterOpen(false); fetchJobCards(1); }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${statusFilter === opt ? "bg-rose-50 font-semibold text-rose-700" : "text-neutral-700 hover:bg-neutral-50"}`}
                    >
                      {opt === "All" ? "All Statuses" : STATUS_LABEL[opt] || opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="button" onClick={() => setShowNewJobCardModal(true)} className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
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
        {loading ? "Loading job cards…" : listError ? "" : jobCards.length === 0 ? "No job cards found." : `Showing ${jobCards.length} of ${total} job card${total !== 1 ? "s" : ""}${statusFilter !== "All" ? ` · ${STATUS_LABEL[statusFilter] || statusFilter}` : ""}`}
      </p>

      {/* Error */}
      {listError && !loading && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">!</span>
          {listError}
          <button type="button" onClick={() => fetchJobCards(page)} className="ml-auto shrink-0 rounded-lg bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200">Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-100 border border-neutral-200" />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && !listError && jobCards.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
            <ClipboardList className="h-7 w-7 text-rose-500" />
          </div>
          <p className="text-sm font-medium text-neutral-700">No job cards yet</p>
          <p className="mt-1 text-xs text-neutral-500">Click New Job Card to create a service work order.</p>
        </div>
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
              : jc.customerName || "";
            const vehicleLabel = jc.vehicleId
              ? `${jc.vehicleId.year || ""} ${jc.vehicleId.make || ""} ${jc.vehicleId.model || ""}`.trim() || jc.vehicleId.rego || ""
              : "";

            return (
              <div key={id} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                      <ClipboardList className="h-6 w-6 text-rose-500" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900">
                          {jc.jobCardNumber || id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_COLORS[statusKey] || "bg-neutral-100 text-neutral-700"}`}>
                          {(STATUS_LABEL[statusKey] || statusKey).toUpperCase()}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_COLORS[priority] || "bg-neutral-100 text-neutral-600"}`}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                        {customerName && <span className="font-medium text-neutral-700">{customerName}</span>}
                        {vehicleLabel && <span className="flex items-center gap-1"><Wrench className="h-3.5 w-3.5" />{vehicleLabel}</span>}
                        {jc.estimatedCost != null && (
                          <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{Number(jc.estimatedCost).toFixed(2)}</span>
                        )}
                        {jc.createdAt && (
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(jc.createdAt)}</span>
                        )}
                      </div>
                      {jc.workRequired && <p className="mt-1 text-xs text-neutral-400 line-clamp-1">{jc.workRequired}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button type="button"
                      onClick={() => { setSelectedJobCardId(id); setIsDetailOpen(true); }}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-violet-50 hover:text-violet-600 transition-colors" title="View details">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete job card">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
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
            <button type="button" disabled={page <= 1} onClick={() => fetchJobCards(page - 1)}
              className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((p) => (
              <button key={p} type="button" onClick={() => fetchJobCards(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-colors ${p === page ? "bg-rose-600 text-white" : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"}`}>
                {p}
              </button>
            ))}
            <button type="button" disabled={page >= totalPages} onClick={() => fetchJobCards(page + 1)}
              className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <JobCardDetailsModal
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedJobCardId(null); }}
        jobCardId={selectedJobCardId}
        onJobCardUpdated={() => fetchJobCards(page)}
      />

      {/* New Job Card Modal placeholder */}
      {showNewJobCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowNewJobCardModal(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-neutral-900">Create Job Card</h2>
              <button type="button" onClick={() => setShowNewJobCardModal(false)} className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-500">Job card creation coming soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}
