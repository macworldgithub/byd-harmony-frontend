"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import {
  Wrench,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  X
} from "lucide-react";
import { JobCardModal, JobCardStatus } from "@/components/job-cards/JobCardModal";
import { JobCardDetailsModal } from "@/components/job-cards/JobCardDetailsModal";
import { API_URL } from "@/lib/config";

const statusTone: Record<string, "blue" | "orange" | "neutral" | "green"> = {
  open: "blue",
  in_progress: "orange",
  awaiting_parts: "neutral",
  completed: "green",
};

const statusLabel: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_parts: "Awaiting Parts",
  completed: "Completed",
};

const STATUS_FILTER_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Awaiting Parts", value: "awaiting_parts" },
  { label: "Completed", value: "completed" },
];

const ITEMS_PER_PAGE = 20;

export default function AdminJobCardsPage() {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState<any | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailJobCardId, setSelectedDetailJobCardId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const filterRef = useRef<HTMLDivElement>(null);

  const fetchJobCards = async (query = "", page = 1, status = "ALL") => {
    setIsLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let url = "";
      if (query.trim()) {
        url = `${API_URL}/job-cards/search?q=${encodeURIComponent(query.trim())}&page=${page}&limit=${ITEMS_PER_PAGE}`;
        if (status !== "ALL") {
          url += `&status=${encodeURIComponent(status)}`;
        }
      } else {
        url = `${API_URL}/job-cards?page=${page}&limit=${ITEMS_PER_PAGE}`;
        if (status !== "ALL") {
          url += `&status=${encodeURIComponent(status)}`;
        }
      }

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch job cards");
      }

      const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setJobCards(list);

      const totalCount =
        data.meta?.total ??
        data.total ??
        data.pagination?.total ??
        data.totalCount ??
        list.length;
      setTotalItems(totalCount);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchJobCards(searchQuery, currentPage, statusFilter);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, currentPage, statusFilter]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + jobCards.length;

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
    setIsStatusDropdownOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job card?")) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/job-cards/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete job card");
      }

      setJobCards((prev) => prev.filter((jc) => (jc._id || jc.id) !== id));
      setTotalItems((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(err.message || "Error deleting job card.");
    }
  };

  const handleOpenAddModal = () => {
    setSelectedJobCard(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedJobCard(job);
    setIsModalOpen(true);
  };

  const handleOpenDetailModal = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDetailJobCardId(id);
    setIsDetailModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchJobCards(searchQuery, currentPage, statusFilter);
  };

  const getCustomerDisplay = (jc: any) => {
    const c = jc.customerId || jc.customer;
    if (!c) return "—";
    if (typeof c === "string") return c;
    if (typeof c === "object") {
      return [c.firstName, c.lastName].filter(Boolean).join(" ") || c.name || c.email || "Unknown";
    }
    return "—";
  };

  const getVehicleDisplay = (jc: any) => {
    const v = jc.vehicleId || jc.vehicle;
    if (!v) return "—";
    if (typeof v === "string") return v;
    if (typeof v === "object") {
      return `${v.year || ""} ${v.make || ""} ${v.model || ""} - ${v.rego || v.vin || ""}`.trim() || "Unknown";
    }
    return "—";
  };

  const selectedStatusLabel =
    STATUS_FILTER_OPTIONS.find((opt) => opt.value === statusFilter)?.label ||
    "All Statuses";

  return (
    <div>
      <PageHeader
        title="All Job Cards"
        subtitle="Platform-wide service job cards across all sites."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search job cards..."
                className="w-56 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
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

            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
              >
                <span>{selectedStatusLabel}</span>
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute right-0 top-full z-20 mt-1.5 w-44 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
                  {STATUS_FILTER_OPTIONS.map((opt) => {
                    const isSelected = statusFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleStatusChange(opt.value)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${isSelected
                          ? "bg-rose-50 font-semibold text-rose-600"
                          : "text-neutral-700 hover:bg-neutral-100"
                          }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Job Card
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-100 bg-white">
          <div className="flex flex-col items-center gap-2 text-neutral-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Loading job cards...</p>
          </div>
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
              of <span className="font-semibold text-neutral-800">{totalItems}</span> job cards
              {statusFilter !== "ALL" && (
                <span className="ml-1.5 inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                  Status: {selectedStatusLabel}
                </span>
              )}
            </p>
          </div>

          <Panel padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    {["Order #", "Customer", "Vehicle", "Service Type", "Technician", "Priority", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobCards.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-neutral-500">
                        {searchQuery || statusFilter !== "ALL"
                          ? "No job cards matched your search or status filter."
                          : 'No job cards found. Click "New Job Card" to create one.'}
                      </td>
                    </tr>
                  ) : (
                    jobCards.map((job) => {
                      const id = job._id || job.id;
                      return (
                        <tr
                          key={id}
                          onClick={(e) => handleOpenDetailModal(id, e)}
                          className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 cursor-pointer transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50">
                                <Wrench className="h-3.5 w-3.5 text-orange-500" />
                              </div>
                              <span className="font-mono text-xs font-semibold text-neutral-700">{job.orderNumber || "—"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-medium text-neutral-900">{getCustomerDisplay(job)}</td>
                          <td className="px-5 py-3.5 text-xs text-neutral-500">{getVehicleDisplay(job)}</td>
                          <td className="px-5 py-3.5 text-neutral-600 max-w-[180px] truncate">{job.serviceType || "—"}</td>
                          <td className="px-5 py-3.5 text-neutral-500">
                            {job.technicianId ? (typeof job.technicianId === "object" ? (job.technicianId.firstName || job.technicianId.name || "Tech") : job.technicianId) : "—"}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-medium text-neutral-500 capitalize">{job.priority || "normal"}</td>
                          <td className="px-5 py-3.5">
                            <Badge tone={job.status ? (statusTone[job.status] || "neutral") : "neutral"}>
                              {job.status ? (statusLabel[job.status] || job.status) : "Unknown"}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleOpenDetailModal(id, e)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                                title="View Details & Line Items"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => handleOpenEditModal(job, e)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                                title="Edit Job Card"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(id);
                                }}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Delete Job Card"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Pagination Controls */}
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

      <JobCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        jobCard={selectedJobCard}
      />

      <JobCardDetailsModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        jobCardId={selectedDetailJobCardId}
        onJobCardUpdated={() => fetchJobCards(searchQuery, currentPage, statusFilter)}
      />
    </div>
  );
}

