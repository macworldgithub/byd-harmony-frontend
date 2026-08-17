"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { BookingModal } from "@/components/bookings/BookingModal";
import { getCurrentLocationId, getCurrentSiteName } from "@/lib/locationUtils";
import {
  Calendar,
  Plus,
  Loader2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Trash2,
  Clock,
  Car,
  User,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

/* ── Types ──────────────────────────────────────────────────── */
type BookingStatus = "scheduled" | "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

const STATUS_TONE: Record<BookingStatus, "blue" | "green" | "orange" | "neutral"> = {
  scheduled: "blue",
  pending: "neutral",
  confirmed: "blue",
  in_progress: "orange",
  completed: "green",
  cancelled: "neutral",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  scheduled: "Scheduled",
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getInitialLocationId(searchParams: ReturnType<typeof useSearchParams>): string {
  if (typeof window === "undefined") return "";
  const urlSite = searchParams.get("site");
  if (urlSite) return urlSite;
  return getCurrentLocationId();
}

/* ─────────────────────────────────────────────────────────── */

export default function SiteBookingsPage() {
  const searchParams = useSearchParams();

  const [locationId] = useState<string>(() => getInitialLocationId(searchParams));
  const [siteName] = useState<string>(() => getCurrentSiteName());

  const [bookings, setBookings] = useState<any[]>([]);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);

  /* ── Fetch Bookings ──────────────────────────────────────── */
  const fetchBookings = useCallback(
    async (pageNum = 1) => {
      const seq = ++requestSeq.current;
      setLoading(true);
      setListError(null);
      try {
        let url = `${API_URL}/bookings?page=${pageNum}&limit=${limit}`;
        if (locationId) url += `&locationId=${encodeURIComponent(locationId)}`;
        if (statusFilter !== "All") url += `&status=${encodeURIComponent(statusFilter)}`;

        const res = await fetch(url, { headers: getAuthHeaders() });
        const json = await res.json().catch(() => ({}));
        if (seq !== requestSeq.current) return;

        if (res.ok) {
          setBookings(Array.isArray(json?.data) ? json.data : []);
          setTotal(json?.meta?.total ?? json?.total ?? 0);
          setPage(json?.meta?.page ?? pageNum);
        } else {
          setListError(json?.message ?? `Failed to load bookings (${res.status})`);
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
    fetchBookings(1);
  }, [fetchBookings]);

  /* ── Search ──────────────────────────────────────────────── */
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!q.trim()) {
      fetchBookings(1);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        let url = `${API_URL}/bookings/search?q=${encodeURIComponent(q.trim())}`;
        if (locationId) url += `&locationId=${encodeURIComponent(locationId)}`;
        const res = await fetch(url, { headers: getAuthHeaders() });
        const json = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(json?.data)) {
          setBookings(json.data);
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
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        toast.success("Booking deleted.");
        setBookings((prev) => prev.filter((b) => (b._id || b.id) !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      } else {
        const json = await res.json().catch(() => ({}));
        toast.error(json?.message || "Delete failed.");
      }
    } catch {
      toast.error("Network error. Could not delete booking.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const STATUS_OPTIONS = ["All", "scheduled", "pending", "confirmed", "in_progress", "completed", "cancelled"];

  return (
    <div>
      <PageHeader
        title="Site Bookings"
        subtitle={
          siteName
            ? `Service bookings for ${siteName}`
            : "Service bookings for your assigned site location."
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
                placeholder="Search bookings…"
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
                {statusFilter === "All" ? "All Statuses" : STATUS_LABEL[statusFilter as BookingStatus] || statusFilter}
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
                        fetchBookings(1);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        statusFilter === opt
                          ? "bg-rose-50 font-semibold text-rose-700"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {opt === "All" ? "All Statuses" : STATUS_LABEL[opt as BookingStatus] || opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={() => {
                setEditingBooking(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Booking
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
          ? "Loading bookings…"
          : listError
          ? ""
          : bookings.length === 0
          ? "No bookings found for this site."
          : `Showing ${bookings.length} of ${total} booking${total !== 1 ? "s" : ""}${
              statusFilter !== "All" ? ` · ${STATUS_LABEL[statusFilter as BookingStatus] || statusFilter}` : ""
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
            onClick={() => fetchBookings(page)}
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
      {!loading && !listError && bookings.length === 0 && (
        <Panel>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Calendar className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-neutral-700">No bookings yet</p>
            <p className="max-w-sm text-xs text-neutral-500">
              Click New Booking to schedule the first service booking for this location.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditingBooking(null);
                setIsModalOpen(true);
              }}
              className="mt-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition-colors shadow-md"
            >
              New Booking
            </button>
          </div>
        </Panel>
      )}

      {/* Bookings List */}
      {!loading && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((b) => {
            const id = b._id || b.id;
            const customerName =
              b.customerId?.firstName
                ? `${b.customerId.firstName} ${b.customerId.lastName || ""}`.trim()
                : b.customerName || "Unknown Customer";
            const vehicleLabel = b.vehicleId
              ? `${b.vehicleId.year || ""} ${b.vehicleId.make || ""} ${b.vehicleId.model || ""}`.trim() ||
                b.vehicleId.rego || "—"
              : "—";
            const statusKey = (b.status || "pending") as BookingStatus;

            return (
              <Panel key={id} padded={false}>
                <div className="flex items-start gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    <Calendar className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">
                        {customerName}
                      </p>
                      <Badge tone={STATUS_TONE[statusKey]}>
                        {STATUS_LABEL[statusKey]}
                      </Badge>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-neutral-400" />
                        {formatDate(b.serviceDateTime)}
                      </span>
                      {vehicleLabel !== "—" && (
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3 text-neutral-400" />
                          {vehicleLabel}
                        </span>
                      )}
                      {b.serviceType && (
                        <span className="capitalize text-rose-500">
                          {b.serviceType.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>

                    {b.notes && (
                      <p className="mt-1.5 text-xs text-neutral-400 line-clamp-1">
                        {b.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBooking(b);
                        setIsModalOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                      title="Edit booking"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(id)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete booking"
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
            <span className="font-semibold text-neutral-800">{total}</span> bookings
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => fetchBookings(page - 1)}
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
                  onClick={() => fetchBookings(p)}
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
              onClick={() => fetchBookings(page + 1)}
              className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBooking(null);
        }}
        onSuccess={() => {
          fetchBookings(1);
          setIsModalOpen(false);
          setEditingBooking(null);
        }}
        booking={editingBooking}
        locationId={locationId}
      />
    </div>
  );
}
