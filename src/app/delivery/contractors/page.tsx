"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  X,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  Plus,
  Info,
  Calendar,
  Building,
  Wrench,
  Pencil,
  Trash2,
} from "lucide-react";
import { API_URL } from "@/lib/config";

interface Contractor {
  _id: string;
  companyName: string;
  typeOfService: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DeliveryContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add contractor modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    typeOfService: "",
    phone: "",
    email: "",
  });

  // Edit contractor modal state (PATCH /api/v1/contractors/:id)
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [editFormData, setEditFormData] = useState({
    companyName: "",
    typeOfService: "",
    phone: "",
    email: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Contractor details modal state (GET /api/v1/contractors/:id)
  const [selectedContractorId, setSelectedContractorId] = useState<string | null>(null);
  const [contractorDetail, setContractorDetail] = useState<Contractor | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Delete confirmation modal state (DELETE /api/v1/contractors/:id)
  const [contractorToDelete, setContractorToDelete] = useState<Contractor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all contractors (GET /api/v1/contractors)
  const fetchContractors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/contractors`, {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load contractors.");
      } else {
        setContractors(Array.isArray(data.data) ? data.data : []);
      }
    } catch {
      setError("Unable to reach the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const res = await fetch(`${API_URL}/contractors`, {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });

        const data = await res.json();
        if (!ignore) {
          if (!res.ok || !data.success) {
            setError(data.message || "Failed to load contractors.");
          } else {
            setContractors(Array.isArray(data.data) ? data.data : []);
          }
        }
      } catch {
        if (!ignore) {
          setError("Unable to reach the server. Please check your connection.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch contractor details (GET /api/v1/contractors/:id)
  const fetchContractorById = async (id: string) => {
    setSelectedContractorId(id);
    setIsLoadingDetail(true);
    setDetailError(null);
    setContractorDetail(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/contractors/${id}`, {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setDetailError(data.message || "Failed to load contractor details.");
      } else {
        setContractorDetail(data.data);
      }
    } catch {
      setDetailError("Unable to reach the server. Please check your connection.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Add contractor submit (POST /api/v1/contractors)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setFormError("Company name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/contractors`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          companyName: formData.companyName.trim(),
          typeOfService: formData.typeOfService.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || "Failed to create contractor.");
      } else {
        setShowAddModal(false);
        setFormData({
          companyName: "",
          typeOfService: "",
          phone: "",
          email: "",
        });
        fetchContractors();
      }
    } catch {
      setFormError("Unable to reach the server. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal with prefilled data
  const handleOpenEdit = (contractor: Contractor) => {
    setEditingContractor(contractor);
    setEditFormData({
      companyName: contractor.companyName || "",
      typeOfService: contractor.typeOfService || "",
      phone: contractor.phone || "",
      email: contractor.email || "",
    });
    setEditError(null);
  };

  // Update contractor submit (PATCH /api/v1/contractors/:id)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContractor) return;
    if (!editFormData.companyName.trim()) {
      setEditError("Company name is required.");
      return;
    }

    setIsUpdating(true);
    setEditError(null);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/contractors/${editingContractor._id}`, {
        method: "PATCH",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          companyName: editFormData.companyName.trim(),
          typeOfService: editFormData.typeOfService.trim(),
          phone: editFormData.phone.trim(),
          email: editFormData.email.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setEditError(data.message || "Failed to update contractor.");
      } else {
        setEditingContractor(null);
        fetchContractors();
      }
    } catch {
      setEditError("Unable to reach the server. Please check your connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm delete contractor (DELETE /api/v1/contractors/:id)
  const handleConfirmDelete = async () => {
    if (!contractorToDelete) return;

    setIsDeleting(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/contractors/${contractorToDelete._id}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete contractor.");
      } else {
        setContractorToDelete(null);
        fetchContractors();
      }
    } catch {
      alert("Unable to reach the server. Please check your connection.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Contractors"
        subtitle={`${contractors.length} registered contractor${contractors.length === 1 ? "" : "s"}`}
        action={
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Contractor
          </button>
        }
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-rose-600" />
          <span className="text-sm">Loading contractors...</span>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchContractors}
            className="ml-auto text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && contractors.length === 0 && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-3">
            <User className="h-6 w-6" />
          </div>
          <p className="text-base font-semibold text-neutral-900">No contractors found</p>
          <p className="text-sm text-neutral-500 mt-1">
            Get started by adding your first service contractor.
          </p>
          {/* <button
            type="button"
            onClick={() => {
              setFormError(null);
              setShowAddModal(true);
            }}
            className="mt-4 flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Contractor
          </button> */}
        </div>
      )}

      {/* Contractors List */}
      {!isLoading && !error && contractors.length > 0 && (
        <div className="mt-6 space-y-3 sm:space-y-4">
          {contractors.map((c) => (
            <Panel key={c._id} padded={false} className="border-neutral-200 hover:border-neutral-300 transition-colors overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4">
                {/* Contractor Identity */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100 mt-0.5 sm:mt-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-neutral-900 text-sm sm:text-base truncate">
                        {c.companyName || "Unnamed Contractor"}
                      </span>
                      <div className="sm:hidden">
                        <Badge tone="green">active</Badge>
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-500 truncate mt-0.5">
                      {c.typeOfService || "Service Provider"}
                    </div>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-3 sm:pt-0 border-t border-neutral-100 sm:border-t-0">
                  <div className="text-left sm:text-right text-xs sm:text-sm space-y-1">
                    {c.phone && (
                      <div className="text-neutral-600 flex items-center sm:justify-end gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{c.phone}</span>
                      </div>
                    )}
                    {c.email && (
                      <div className="text-neutral-500 flex items-center sm:justify-end gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate max-w-[200px] md:max-w-xs">{c.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:block">
                    <Badge tone="green">active</Badge>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* View Details */}
                    <button
                      type="button"
                      title="View Details"
                      onClick={() => fetchContractorById(c._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-2xs"
                    >
                      <Info className="h-4 w-4" />
                    </button>

                    {/* Edit Contractor (PATCH) */}
                    <button
                      type="button"
                      title="Edit Contractor"
                      onClick={() => handleOpenEdit(c)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-2xs"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Delete Contractor (DELETE) */}
                    <button
                      type="button"
                      title="Delete Contractor"
                      onClick={() => setContractorToDelete(c)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors shadow-2xs"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* Add Contractor Modal (POST /api/v1/contractors) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowAddModal(false)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">Add Contractor</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Register a new third-party contractor or service partner</p>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acme Logistics"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Type of Service
                </label>
                <input
                  type="text"
                  placeholder="e.g. Transportation, Detailing, Windscreen"
                  value={formData.typeOfService}
                  onChange={(e) => setFormData({ ...formData, typeOfService: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. contact@acmelogistics.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Contractor"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contractor Modal (PATCH /api/v1/contractors/:id) */}
      {editingContractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isUpdating && setEditingContractor(null)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">Edit Contractor</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Update contractor information</p>
              </div>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setEditingContractor(null)}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {editError && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acme Logistics"
                  value={editFormData.companyName}
                  onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Type of Service
                </label>
                <input
                  type="text"
                  placeholder="e.g. Transportation, Detailing, Windscreen"
                  value={editFormData.typeOfService}
                  onChange={(e) => setEditFormData({ ...editFormData, typeOfService: e.target.value })}
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +12345678000"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    disabled={isUpdating}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. contact@acmelogistics.com"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    disabled={isUpdating}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setEditingContractor(null)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contractor Detail Modal (GET /api/v1/contractors/:id) */}
      {selectedContractorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedContractorId(null)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900">Contractor Details</h2>
                  <p className="text-xs text-neutral-500 font-mono">ID: {selectedContractorId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContractorId(null)}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              {isLoadingDetail && (
                <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                  <Loader2 className="h-6 w-6 animate-spin text-rose-600 mb-2" />
                  <span className="text-sm">Fetching contractor details...</span>
                </div>
              )}

              {!isLoadingDetail && detailError && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{detailError}</span>
                </div>
              )}

              {!isLoadingDetail && contractorDetail && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-3">
                    <div>
                      <div className="text-xs text-neutral-400 font-medium">Company Name</div>
                      <div className="text-sm sm:text-base font-semibold text-neutral-900">
                        {contractorDetail.companyName}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <div className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                          <Wrench className="h-3 w-3" /> Service Type
                        </div>
                        <div className="text-sm font-medium text-neutral-800 mt-0.5">
                          {contractorDetail.typeOfService || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400 font-medium">Status</div>
                        <div className="mt-0.5">
                          <Badge tone="green">active</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-200/60">
                      <div>
                        <div className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3" /> Phone
                        </div>
                        <div className="text-sm font-medium text-neutral-800 mt-0.5">
                          {contractorDetail.phone || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                          <Mail className="h-3 w-3" /> Email
                        </div>
                        <div className="text-sm font-medium text-neutral-800 mt-0.5 break-all">
                          {contractorDetail.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-100 bg-neutral-50/30 p-3 space-y-1.5 text-xs text-neutral-500">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" /> Created At:
                      </span>
                      <span className="font-medium text-neutral-700">
                        {formatDate(contractorDetail.createdAt)}
                      </span>
                    </div>
                    {contractorDetail.updatedAt && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-neutral-400" /> Last Updated:
                        </span>
                        <span className="font-medium text-neutral-700">
                          {formatDate(contractorDetail.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedContractorId(null)}
                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Contractor Confirmation Modal (matches screenshot design) */}
      {contractorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setContractorToDelete(null)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-white p-5 sm:p-6 shadow-2xl ring-1 ring-neutral-200">
            {/* Top Red Trash Icon Badge */}
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4 border border-red-100">
              <Trash2 className="h-4 w-4" />
            </div>

            {/* Modal Heading & Description */}
            <h2 className="text-sm font-bold text-neutral-900">
              Delete Contractor?
            </h2>
            <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
              This action cannot be undone. The contractor{" "}
              <span className="font-semibold text-neutral-800">
                &ldquo;{contractorToDelete.companyName}&rdquo;
              </span>{" "}
              will be permanently removed.
            </p>

            {/* Modal Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setContractorToDelete(null)}
                className="rounded-xl border border-neutral-200 bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



