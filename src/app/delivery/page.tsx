"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { BigStatCard } from "@/components/dashboard/StatCard";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import {
  Truck,
  Plus,
  X,
  Loader2,
  Calendar,
  MapPin,
  User,
  Clock,
  FileText,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { API_URL } from "@/lib/config";
import toast from "react-hot-toast";

interface DeliveryItemData {
  _id: string;
  customerId: string | { _id: string; firstName?: string; lastName?: string; name?: string; email?: string; phone?: string };
  locationId: string | { _id: string; name?: string; address?: string };
  deliveryDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomerItem {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface LocationItem {
  _id: string;
  name: string;
  address?: string;
}

interface VehicleItem {
  _id: string;
  vin?: string;
  rego?: string;
  make?: string;
  model?: string;
  year?: number | string;
  customerId?: string | { _id: string; [key: string]: unknown };
  customer?: string | { _id: string; [key: string]: unknown };
}

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export default function DeliveryQueuePage() {
  const [deliveries, setDeliveries] = useState<DeliveryItemData[]>([]);
  const [isLoadingDeliveries, setIsLoadingDeliveries] = useState(true);
  const [deliveriesError, setDeliveriesError] = useState<string | null>(null);

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItemData | null>(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDeliveryId, setEditingDeliveryId] = useState<string | null>(null);
  const [editCustomerId, setEditCustomerId] = useState("");
  const [editLocationId, setEditLocationId] = useState("");
  const [editVehicleId, setEditVehicleId] = useState("");
  const [editDeliveryDate, setEditDeliveryDate] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dropdown lists
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [isFetchingDropdowns, setIsFetchingDropdowns] = useState(false);

  // Location filter for GET /api/v1/schedule-deliveries?locationId=...
  const [locationFilter, setLocationFilter] = useState<string>("");

  // Form inputs
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1. GET /api/v1/schedule-deliveries (with optional ?locationId=...)
  const fetchDeliveries = useCallback(async (locId?: string) => {
    setIsLoadingDeliveries(true);
    setDeliveriesError(null);
    try {
      const url = locId
        ? `${API_URL}/schedule-deliveries?locationId=${encodeURIComponent(locId)}`
        : `${API_URL}/schedule-deliveries`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.success) {
        setDeliveries(Array.isArray(json.data) ? json.data : []);
      } else {
        setDeliveries([]);
        if (!res.ok && res.status !== 404) {
          setDeliveriesError(json.message || "Failed to load schedule deliveries.");
        }
      }
    } catch {
      setDeliveriesError("Unable to reach the server.");
    } finally {
      setIsLoadingDeliveries(false);
    }
  }, []);

  // Fetch dropdown options for customers, locations, and vehicles
  const fetchDropdowns = useCallback(async () => {
    setIsFetchingDropdowns(true);
    try {
      const headers = getAuthHeaders();
      const [custRes, locRes, vehRes] = await Promise.all([
        fetch(`${API_URL}/customers`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/locations`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_URL}/vehicles`, { headers }).then((r) => r.json()).catch(() => ({})),
      ]);

      setCustomers(Array.isArray(custRes?.data) ? custRes.data : Array.isArray(custRes) ? custRes : []);
      setLocations(Array.isArray(locRes?.data) ? locRes.data : Array.isArray(locRes) ? locRes : []);
      setVehicles(Array.isArray(vehRes?.data) ? vehRes.data : Array.isArray(vehRes) ? vehRes : []);
    } catch (err) {
      console.error("Failed to load options:", err);
    } finally {
      setIsFetchingDropdowns(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let ignore = false;
    const loadDeliveries = async () => {
      try {
        const url = locationFilter
          ? `${API_URL}/schedule-deliveries?locationId=${encodeURIComponent(locationFilter)}`
          : `${API_URL}/schedule-deliveries`;

        const res = await fetch(url, { headers: getAuthHeaders() });
        const json = await res.json().catch(() => ({}));

        if (!ignore) {
          if (res.ok && json.success) {
            setDeliveries(Array.isArray(json.data) ? json.data : []);
          } else {
            setDeliveries([]);
            if (!res.ok && res.status !== 404) {
              setDeliveriesError(json.message || "Failed to load schedule deliveries.");
            }
          }
        }
      } catch {
        if (!ignore) {
          setDeliveriesError("Unable to reach the server.");
        }
      } finally {
        if (!ignore) {
          setIsLoadingDeliveries(false);
        }
      }
    };

    loadDeliveries();
    return () => {
      ignore = true;
    };
  }, [locationFilter]);

  useEffect(() => {
    let ignore = false;
    const loadDropdowns = async () => {
      try {
        const headers = getAuthHeaders();
        const [custRes, locRes, vehRes] = await Promise.all([
          fetch(`${API_URL}/customers`, { headers }).then((r) => r.json()).catch(() => ({})),
          fetch(`${API_URL}/locations`, { headers }).then((r) => r.json()).catch(() => ({})),
          fetch(`${API_URL}/vehicles`, { headers }).then((r) => r.json()).catch(() => ({})),
        ]);

        if (!ignore) {
          setCustomers(Array.isArray(custRes?.data) ? custRes.data : Array.isArray(custRes) ? custRes : []);
          setLocations(Array.isArray(locRes?.data) ? locRes.data : Array.isArray(locRes) ? locRes : []);
          setVehicles(Array.isArray(vehRes?.data) ? vehRes.data : Array.isArray(vehRes) ? vehRes : []);
        }
      } catch (err) {
        console.error("Failed to load options:", err);
      }
    };

    loadDropdowns();
    return () => {
      ignore = true;
    };
  }, []);

  const openModal = () => {
    setCustomerId("");
    setVehicleId("");
    setLocationId("");
    setDeliveryDate("");
    setNotes("");
    setSubmitError(null);
    setShowScheduleModal(true);
    fetchDropdowns();
  };

  // Open Edit modal and pre-fill form
  const openEditModal = (delivery: DeliveryItemData) => {
    const cId = typeof delivery.customerId === "object" ? delivery.customerId?._id : delivery.customerId;
    const lId = typeof delivery.locationId === "object" ? delivery.locationId?._id : delivery.locationId;

    setEditingDeliveryId(delivery._id);
    setEditCustomerId(cId || "");
    setEditLocationId(lId || "");
    setEditVehicleId("");
    setEditNotes(delivery.notes || "");

    if (delivery.deliveryDate) {
      const d = new Date(delivery.deliveryDate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      setEditDeliveryDate(`${year}-${month}-${day}T${hours}:${mins}`);
    } else {
      setEditDeliveryDate("");
    }

    setEditError(null);
    setShowEditModal(true);
    fetchDropdowns();
  };

  // 4. PATCH /api/v1/schedule-deliveries/:id
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editCustomerId) { setEditError("Please select a customer."); return; }
    if (!editLocationId) { setEditError("Please select a location."); return; }
    if (!editDeliveryDate) { setEditError("Please select a delivery date & time."); return; }

    setIsEditSubmitting(true);
    setEditError(null);

    try {
      const isoDate = new Date(editDeliveryDate).toISOString();
      const payload = {
        customerId: editCustomerId,
        locationId: editLocationId,
        deliveryDate: isoDate,
        notes: editNotes.trim(),
      };

      const res = await fetch(`${API_URL}/schedule-deliveries/${editingDeliveryId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast.success(data.message || "Delivery updated successfully!");
        setShowEditModal(false);
        setEditingDeliveryId(null);
        fetchDeliveries(locationFilter || undefined);
      } else {
        setEditError(data.message || "Failed to update delivery.");
      }
    } catch (err: unknown) {
      setEditError(err instanceof Error ? err.message : "Unable to connect to the server.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // 2. POST /api/v1/schedule-deliveries
  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      setSubmitError("Please select a customer.");
      return;
    }
    if (!locationId) {
      setSubmitError("Please select a location.");
      return;
    }
    if (!deliveryDate) {
      setSubmitError("Please select a delivery date & time.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const isoDate = new Date(deliveryDate).toISOString();

      const payload = {
        customerId,
        locationId,
        deliveryDate: isoDate,
        notes: notes.trim(),
      };

      const res = await fetch(`${API_URL}/schedule-deliveries`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast.success(data.message || "Delivery scheduled successfully!");
        setShowScheduleModal(false);
        fetchDeliveries(locationFilter || undefined);
      } else {
        setSubmitError(data.message || "Failed to schedule delivery.");
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. GET /api/v1/schedule-deliveries/:id
  const handleViewDeliveryDetail = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/schedule-deliveries/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.data) {
        setSelectedDelivery(data.data);
      } else {
        toast.error(data.message || "Failed to load delivery details.");
      }
    } catch {
      toast.error("Unable to load delivery details.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // 5. DELETE /api/v1/schedule-deliveries/:id
  const handleDeleteDelivery = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/schedule-deliveries/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast.success(data.message || "Delivery deleted successfully!");
        setConfirmDeleteId(null);
        setSelectedDelivery(null);
        fetchDeliveries(locationFilter || undefined);
      } else {
        toast.error(data.message || "Failed to delete delivery.");
        setConfirmDeleteId(null);
      }
    } catch {
      toast.error("Unable to connect to the server.");
      setConfirmDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper name resolvers
  const getCustomerName = (cust: DeliveryItemData["customerId"]) => {
    if (typeof cust === "object" && cust !== null) {
      const combined = `${cust.firstName || ""} ${cust.lastName || ""}`.trim();
      return combined || cust.name || cust.email || "Customer";
    }
    const found = customers.find((c) => c._id === cust);
    if (found) {
      const combined = `${found.firstName || ""} ${found.lastName || ""}`.trim();
      return combined || found.name || found.email || "Customer";
    }
    return typeof cust === "string" && cust.length === 24 ? `Customer (${cust.slice(-6)})` : cust || "Customer";
  };

  const getLocationName = (loc: DeliveryItemData["locationId"]) => {
    if (typeof loc === "object" && loc !== null) {
      return loc.name || "Location";
    }
    const found = locations.find((l) => l._id === loc);
    if (found) return found.name;
    return typeof loc === "string" && loc.length === 24 ? `Location (${loc.slice(-6)})` : loc || "Location";
  };

  // Filter vehicles by customer if a customer is chosen, or fallback to all vehicles
  const getCustomerVehicleId = (v: VehicleItem): string => {
    const rawCust = v.customerId || v.customer;
    if (typeof rawCust === "object" && rawCust !== null) {
      return String(rawCust._id || "");
    }
    return String(rawCust || "");
  };

  const filteredVehicles = (() => {
    if (!customerId) return vehicles;
    const matched = vehicles.filter((v) => getCustomerVehicleId(v) === customerId);
    // If the customer has specific vehicles assigned, show those; otherwise show all available vehicles
    return matched.length > 0 ? matched : vehicles;
  })();

  const filteredEditVehicles = (() => {
    if (!editCustomerId) return vehicles;
    const matched = vehicles.filter((v) => getCustomerVehicleId(v) === editCustomerId);
    return matched.length > 0 ? matched : vehicles;
  })();

  // Compute live statistics
  const now = new Date();
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  const todayCount = deliveries.filter((d) => {
    if (!d.deliveryDate) return false;
    return isSameDay(new Date(d.deliveryDate), now);
  }).length;

  const thisWeekCount = deliveries.filter((d) => {
    if (!d.deliveryDate) return false;
    return isThisWeek(new Date(d.deliveryDate));
  }).length;

  const totalScheduled = deliveries.length;

  return (
    <div>
      <PageHeader
        title="Delivery Queue"
        subtitle={`${todayCount} today · ${totalScheduled} total scheduled`}
        action={
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Schedule Delivery
          </button>
        }
      />

      {/* Schedule Delivery Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowScheduleModal(false)}
          />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-[28px] bg-white p-5 sm:p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                  Schedule Delivery
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">Book a delivery slot for customer vehicle handover</p>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                disabled={isSubmitting}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="mt-5 space-y-4">
              {/* Customer * */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Customer <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  disabled={isFetchingDropdowns || isSubmitting}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">
                    {isFetchingDropdowns
                      ? "Loading customers..."
                      : customers.length === 0
                        ? "No customers available"
                        : "Select customer"}
                  </option>
                  {customers.map((c) => {
                    const name = `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.name || c.email || c._id;
                    return (
                      <option key={c._id} value={c._id}>
                        {name} {c.phone ? `(${c.phone})` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Vehicle * */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Vehicle <span className="text-rose-500">*</span>
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  disabled={isFetchingDropdowns || isSubmitting}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">
                    {isFetchingDropdowns
                      ? "Loading vehicles..."
                      : filteredVehicles.length === 0
                        ? "No vehicles available"
                        : "Select Vehicle"}
                  </option>
                  {filteredVehicles.map((v) => {
                    const makeModel = [v.year, v.make || "BYD", v.model].filter(Boolean).join(" ");
                    const regVin = v.rego ? ` - ${v.rego}` : v.vin ? ` - ${v.vin}` : "";
                    return (
                      <option key={v._id} value={v._id}>
                        {makeModel || "Vehicle"}{regVin}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Location & Delivery Date in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location * */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Location <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    disabled={isFetchingDropdowns || isSubmitting}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  >
                    <option value="">
                      {isFetchingDropdowns
                        ? "Loading locations..."
                        : locations.length === 0
                          ? "No locations available"
                          : "Select location"}
                    </option>
                    {locations.map((loc) => (
                      <option key={loc._id} value={loc._id}>
                        {loc.name} {loc.address ? `— ${loc.address}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Date & Time * */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                    Delivery Date &amp; Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Customer requested a morning delivery if possible."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Delivery Modal (PATCH /api/v1/schedule-deliveries/:id) */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => !isEditSubmitting && setShowEditModal(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Edit Delivery</h2>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">ID: {editingDeliveryId}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={isEditSubmitting}
                className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {editError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              {/* Customer */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Customer <span className="text-rose-500">*</span></label>
                <select
                  required
                  value={editCustomerId}
                  onChange={(e) => setEditCustomerId(e.target.value)}
                  disabled={isFetchingDropdowns || isEditSubmitting}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">
                    {isFetchingDropdowns
                      ? "Loading customers..."
                      : customers.length === 0
                        ? "No customers available"
                        : "Select customer"}
                  </option>
                  {customers.map((c) => {
                    const name = `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.name || c.email || c._id;
                    return (
                      <option key={c._id} value={c._id}>
                        {name} {c.phone ? `(${c.phone})` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Vehicle * */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Vehicle <span className="text-rose-500">*</span></label>
                <select
                  value={editVehicleId}
                  onChange={(e) => setEditVehicleId(e.target.value)}
                  disabled={isFetchingDropdowns || isEditSubmitting}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">
                    {isFetchingDropdowns
                      ? "Loading vehicles..."
                      : filteredEditVehicles.length === 0
                        ? "No vehicles available"
                        : "Select Vehicle"}
                  </option>
                  {filteredEditVehicles.map((v) => {
                    const makeModel = [v.year, v.make || "BYD", v.model].filter(Boolean).join(" ");
                    const regVin = v.rego ? ` - ${v.rego}` : v.vin ? ` - ${v.vin}` : "";
                    return (
                      <option key={v._id} value={v._id}>
                        {makeModel || "Vehicle"}{regVin}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Location & Delivery Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location * */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Location <span className="text-rose-500">*</span></label>
                  <select
                    required
                    value={editLocationId}
                    onChange={(e) => setEditLocationId(e.target.value)}
                    disabled={isFetchingDropdowns || isEditSubmitting}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  >
                    <option value="">
                      {isFetchingDropdowns
                        ? "Loading locations..."
                        : locations.length === 0
                          ? "No locations available"
                          : "Select location"}
                    </option>
                    {locations.map((loc) => (
                      <option key={loc._id} value={loc._id}>
                        {loc.name} {loc.address ? `— ${loc.address}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Date & Time */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Delivery Date &amp; Time <span className="text-rose-500">*</span></label>
                  <input
                    type="datetime-local"
                    required
                    value={editDeliveryDate}
                    onChange={(e) => setEditDeliveryDate(e.target.value)}
                    disabled={isEditSubmitting}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  disabled={isEditSubmitting}
                  placeholder="Customer requested a morning delivery if possible."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-700 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  disabled={isEditSubmitting}
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isEditSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Delivery"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delivery Details Modal (GET /api/v1/schedule-deliveries/:id) */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedDelivery(null)}
          />
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-[24px] bg-white p-5 sm:p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                    Delivery Details
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    ID: {selectedDelivery._id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDelivery(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 sm:space-y-4 text-sm">
              <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
                <User className="mt-0.5 h-4 w-4 text-neutral-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Customer</span>
                  <p className="font-semibold text-neutral-800 text-sm truncate">
                    {getCustomerName(selectedDelivery.customerId)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
                <MapPin className="mt-0.5 h-4 w-4 text-neutral-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Location</span>
                  <p className="font-semibold text-neutral-800 text-sm truncate">
                    {getLocationName(selectedDelivery.locationId)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
                <Clock className="mt-0.5 h-4 w-4 text-neutral-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Date</span>
                  <p className="font-semibold text-neutral-800 text-sm">
                    {selectedDelivery.deliveryDate
                      ? new Date(selectedDelivery.deliveryDate).toLocaleString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "—"}
                  </p>
                </div>
              </div>

              {selectedDelivery.notes && (
                <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3">
                  <FileText className="mt-0.5 h-4 w-4 text-neutral-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Notes</span>
                    <p className="text-neutral-700 text-xs mt-0.5 leading-relaxed break-words">
                      {selectedDelivery.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between border-t border-neutral-100 pt-4 gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const toEdit = selectedDelivery;
                    setSelectedDelivery(null);
                    if (toEdit) openEditModal(toEdit);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 text-neutral-500" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = selectedDelivery?._id;
                    setSelectedDelivery(null);
                    if (id) setConfirmDeleteId(id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDelivery(null)}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog (DELETE /api/v1/schedule-deliveries/:id) */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setConfirmDeleteId(null)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-white p-5 sm:p-6 shadow-2xl ring-1 ring-neutral-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4 border border-red-100">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">Delete Delivery?</h3>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500 leading-relaxed">
              This action cannot be undone. The scheduled delivery will be permanently removed.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteId(null)}
                className="rounded-xl border border-neutral-200 bg-white px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteDelivery(confirmDeleteId)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm"
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BigStatCard
          value={String(todayCount)}
          label="Today"
          colorClassName="text-rose-600"
        />
        <BigStatCard
          value={String(thisWeekCount)}
          label="This Week"
          colorClassName="text-amber-600"
        />
        <BigStatCard
          value={String(totalScheduled)}
          label="Total Scheduled"
        />
      </div>

      {/* Deliveries List Panel */}
      <div className="mt-5">
        <Panel padded={false}>
          <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 px-5 py-4 gap-3">
            <PanelHeader
              title="Today's Deliveries"
              action={<Truck className="h-4 w-4 text-rose-500 ml-2" />}
            />
            {/* Location filter dropdown for GET /api/v1/schedule-deliveries?locationId=... */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-500">Filter Location:</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700 shadow-2xs outline-none focus:border-rose-300"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-5">
            {isLoadingDeliveries ? (
              <div className="flex h-36 flex-col items-center justify-center gap-2 text-neutral-400">
                <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                <span className="text-xs font-medium">Loading deliveries...</span>
              </div>
            ) : deliveriesError ? (
              <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-600">
                {deliveriesError}
              </div>
            ) : deliveries.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-10 text-center">
                <Truck className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                <p className="text-sm font-semibold text-neutral-700">No deliveries scheduled</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Click &ldquo;Schedule Delivery&rdquo; above to create a new delivery booking.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {deliveries.map((item) => {
                  const formattedDate = item.deliveryDate
                    ? new Date(item.deliveryDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "—";

                  const customerLabel = getCustomerName(item.customerId);
                  const locationLabel = getLocationName(item.locationId);

                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:bg-neutral-50/60 transition-colors px-2 rounded-xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                          <Truck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-neutral-900">
                              {customerLabel}
                            </span>
                            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                              {locationLabel}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1 font-semibold text-rose-600">
                              <Calendar className="h-3.5 w-3.5" />
                              {formattedDate}
                            </span>
                            {item.notes && (
                              <span className="truncate max-w-[280px] text-neutral-400">
                                &ldquo;{item.notes}&rdquo;
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
                        >
                          <Pencil className="h-3.5 w-3.5 text-neutral-500" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewDeliveryDetail(item._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
                        >
                          <Eye className="h-3.5 w-3.5 text-neutral-500" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors shadow-2xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
