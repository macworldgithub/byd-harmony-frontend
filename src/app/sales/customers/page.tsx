"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { Edit2, Trash2, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "@/lib/config";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  dateOfBirth?: string;
  licenceNumber?: string;
  preferredLocationId?: string | null;
  lifecycleStage: string;
  source?: string;
  consentSms: boolean;
  consentEmail: boolean;
  consentPhone: boolean;
  notes?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
}

export default function SalesCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20 });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("All stages");

  // Edit modal state
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch list (with optional search query and pagination) ────────────────
  const fetchCustomers = useCallback(async (query: string = "", pageParam: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query.trim()
        ? `${API_URL}/customers/search?q=${encodeURIComponent(query.trim())}&page=${pageParam}&limit=20`
        : `${API_URL}/customers?page=${pageParam}&limit=20`;

      const res = await fetch(endpoint, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers(data.data || []);
        if (data.meta) {
          setMeta(data.meta);
        } else {
          // Fallback if search doesn't return meta
          setMeta({ total: data.data?.length || 0, page: pageParam, limit: 20 });
        }
      } else {
        setError(data.message || "Failed to fetch customers");
      }
    } catch {
      setError("Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Reset page to 1 when search changes
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(searchQuery, page);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, page, fetchCustomers]);

  // Apply stage filter locally
  const filteredCustomers = customers.filter((c) => {
    if (stageFilter === "All stages") return true;
    return c.lifecycleStage?.toLowerCase() === stageFilter.toLowerCase();
  });

  // ── Open Edit (GET by ID) ───────────────────────────────────────────────
  const handleOpenEdit = async (customer: Customer) => {
    setEditCustomer(customer);
    setEditForm({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      suburb: customer.suburb || "",
      state: customer.state || "",
      postcode: customer.postcode || "",
      dateOfBirth: customer.dateOfBirth || "",
      licenceNumber: customer.licenceNumber || "",
      preferredLocationId: customer.preferredLocationId || "",
      lifecycleStage: customer.lifecycleStage || "prospect",
      source: customer.source || "",
      consentSms: customer.consentSms ?? true,
      consentEmail: customer.consentEmail ?? true,
      consentPhone: customer.consentPhone ?? true,
      notes: customer.notes || "",
    });
    setEditError(null);
    setIsLoadingEdit(true);
    try {
      const res = await fetch(`${API_URL}/customers/${customer._id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const c: Customer = data.data;
        setEditForm({
          firstName: c.firstName || "",
          lastName: c.lastName || "",
          email: c.email || "",
          phone: c.phone || "",
          address: c.address || "",
          suburb: c.suburb || "",
          state: c.state || "",
          postcode: c.postcode || "",
          dateOfBirth: c.dateOfBirth || "",
          licenceNumber: c.licenceNumber || "",
          preferredLocationId: c.preferredLocationId || "",
          lifecycleStage: c.lifecycleStage || "prospect",
          source: c.source || "",
          consentSms: c.consentSms ?? true,
          consentEmail: c.consentEmail ?? true,
          consentPhone: c.consentPhone ?? true,
          notes: c.notes || "",
        });
      }
    } catch {
      // fallback to local list data
    } finally {
      setIsLoadingEdit(false);
    }
  };

  // ── Update (PUT) ────────────────────────────────────────────────────────
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    setEditError(null);
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/customers/${editCustomer._id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...editForm,
          isDeleted: editCustomer.isDeleted,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === editCustomer._id ? data.data : c))
        );
        setEditCustomer(null);
      } else {
        setEditError(data.message || "Failed to update customer.");
      }
    } catch {
      setEditError("Unable to reach the server.");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/customers/${deleteTarget._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c._id !== deleteTarget._id));
        setDeleteTarget(null);
      } else {
        setDeleteTarget(null);
      }
    } catch {
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        action={
          <div className="flex gap-4">
            <Toolbar
              searchPlaceholder="Search..."
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="border border-neutral-200 rounded-md px-3 text-sm focus:outline-none focus:border-rose-500 bg-white text-neutral-700"
            >
              <option>All stages</option>
              <option>prospect</option>
              <option>service</option>
              <option>active</option>
              <option>inactive</option>
              <option>archived</option>
            </select>
          </div>
        }
      />

      {error && (
        <div className="mt-4 mb-2 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <Panel padded={false} className="mt-6 border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading customers...
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-neutral-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {c.firstName} {c.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-neutral-700">{c.phone || "-"}</div>
                      <div className="text-neutral-500">{c.email || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        tone={
                          c.lifecycleStage === "prospect"
                            ? "blue"
                            : c.lifecycleStage === "service"
                              ? "orange"
                              : c.lifecycleStage === "active"
                                ? "green"
                                : "neutral"
                        }
                      >
                        {c.lifecycleStage || "none"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{c.source || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit customer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && meta.total > 0 && (() => {
          const totalPages = Math.ceil(meta.total / meta.limit) || 1;
          const getPageNumbers = () => {
            if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
            if (page <= 3) return [1, 2, 3, 4, '...', totalPages];
            if (page >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            return [1, '...', page - 1, page, page + 1, '...', totalPages];
          };

          return (
            <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-500">
                Page <span className="font-semibold text-neutral-700">{meta.page}</span> of <span className="font-semibold text-neutral-700">{totalPages}</span> ({meta.limit} per page)
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page === 1}
                  className="flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                
                {getPageNumbers().map((p, i) => (
                  <button
                    key={i}
                    onClick={() => typeof p === 'number' && setPage(p)}
                    disabled={p === '...'}
                    className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      p === meta.page
                        ? "bg-rose-600 text-white border border-rose-600"
                        : p === "..."
                        ? "text-neutral-400 cursor-default"
                        : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={meta.page >= totalPages}
                  className="flex items-center gap-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })()}
      </Panel>

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      {editCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Edit Customer</h2>
                <p className="text-xs text-neutral-500 mt-1">Update customer details.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditCustomer(null)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors -mr-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoadingEdit ? (
              <div className="flex items-center justify-center gap-2 py-12 text-neutral-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="flex flex-col min-h-0 overflow-hidden">
                <div className="px-6 py-4 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, firstName: e.target.value })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 mb-2">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 mb-2">
                      Stage
                    </label>
                    <select
                      value={editForm.lifecycleStage || ""}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lifecycleStage: e.target.value })
                      }
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="prospect">Prospect</option>
                      <option value="service">Service</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {editError && (
                    <p className="text-sm text-red-600">{editError}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setEditCustomer(null)}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60 transition-colors"
                  >
                    {isUpdating && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Save changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 ring-1 ring-neutral-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 text-center">
              Delete Customer?
            </h3>
            <p className="text-sm text-neutral-500 text-center mt-1 mb-5">
              &ldquo;{deleteTarget.firstName} {deleteTarget.lastName}&rdquo; will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
