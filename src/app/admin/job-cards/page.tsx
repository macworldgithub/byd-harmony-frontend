"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { Wrench, Pencil, Trash2, Loader2, Eye } from "lucide-react";
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

export default function AdminJobCardsPage() {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState<any | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailJobCardId, setSelectedDetailJobCardId] = useState<string | null>(null);

  const fetchJobCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/job-cards`, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch job cards");
      }

      setJobCards(data.data || data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobCards();
  }, []);

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
    fetchJobCards();
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

  return (
    <div>
      <PageHeader
        title="All Job Cards"
        subtitle="Platform-wide service job cards across all sites."
        action={
          <Toolbar 
            searchPlaceholder="Search job cards..." 
            filterLabel="All Statuses" 
            ctaLabel="New Job Card" 
            onCtaClick={handleOpenAddModal}
          />
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
          <p className="mb-4 text-sm text-neutral-500">{jobCards.length} job cards</p>

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
                        No job cards found. Click "New Job Card" to create one.
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
        onJobCardUpdated={fetchJobCards}
      />
    </div>
  );
}
