"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import {
  Car,
  Pencil,
  Trash2,
  Loader2,
  Eye,
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { VehicleModal } from "@/components/vehicles/VehicleModal";
import { VehicleDetailsModal } from "@/components/vehicles/VehicleDetailsModal";
import { API_URL } from "@/lib/config";

type VehicleStatus = "active" | "disposed" | "traded" | "written_off";

const statusTone: Record<VehicleStatus, "green" | "orange" | "blue" | "neutral" | "red"> = {
  active: "green",
  disposed: "neutral",
  traded: "blue",
  written_off: "red",
};

const statusLabel: Record<VehicleStatus, string> = {
  active: "Active",
  disposed: "Disposed",
  traded: "Traded",
  written_off: "Written Off",
};

const STATUS_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Active", value: "active" },
  { label: "Disposed", value: "disposed" },
  { label: "Traded", value: "traded" },
  { label: "Written Off", value: "written_off" },
];

interface Vehicle {
  _id: string;
  id?: string;
  customerId: string;
  vin: string;
  rego: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  odometer: number;
  status: VehicleStatus;
  deliveredAt: string;
  nextServiceDue: string;
  warrantyExpiry: string;
}

const ITEMS_PER_PAGE = 20;

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchVehicles = async (query = "", page = 1, status = "ALL") => {
    setIsLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let url = "";
      if (query.trim()) {
        url = `${API_URL}/vehicles/search?q=${encodeURIComponent(query.trim())}&page=${page}&limit=${ITEMS_PER_PAGE}`;
        if (status !== "ALL") {
          url += `&status=${encodeURIComponent(status)}`;
        }
      } else {
        url = `${API_URL}/vehicles?page=${page}&limit=${ITEMS_PER_PAGE}`;
        if (status !== "ALL") {
          url += `&status=${encodeURIComponent(status)}`;
        }
      }

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch vehicles");
      }

      const list = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setVehicles(list);

      // Extract total from backend meta/pagination
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
      fetchVehicles(searchQuery, currentPage, selectedStatus);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, currentPage, selectedStatus]);

  // Calculate pagination from backend total
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + vehicles.length;
  const paginatedVehicles = vehicles;

  const handleDelete = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete vehicle");
      }

      setVehicles((prev) => prev.filter((v) => (v._id || v.id) !== vehicleId));
    } catch (err: any) {
      alert(err.message || "Error deleting vehicle.");
    }
  };

  const handleOpenAddModal = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (vehicle: Vehicle, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const vid = vehicle._id || vehicle.id;
      if (vid) {
        const res = await fetch(`${API_URL}/vehicles/${vid}`, { headers });
        const data = await res.json();
        if (res.ok && data.data) {
          const vehicleData = Array.isArray(data.data) ? data.data[0] : data.data;
          if (vehicleData) {
            setSelectedVehicle(vehicleData);
            setIsModalOpen(true);
            return;
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch full vehicle details, falling back to basic data.", err);
    }

    // Fallback if fetch fails or no ID
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleRowClick = async (vehicle: Vehicle) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const vid = vehicle._id || vehicle.id;
      if (vid) {
        const res = await fetch(`${API_URL}/vehicles/${vid}`, { headers });
        const data = await res.json();
        if (res.ok && data.data) {
          const vehicleData = Array.isArray(data.data) ? data.data[0] : data.data;
          if (vehicleData) {
            setViewingVehicle(vehicleData);
            setIsDetailsModalOpen(true);
            return;
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch full vehicle details.", err);
    }

    // Fallback
    setViewingVehicle(vehicle);
    setIsDetailsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchVehicles(searchQuery, currentPage, selectedStatus);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
    setIsStatusDropdownOpen(false);
  };

  const selectedStatusLabel =
    STATUS_FILTER_OPTIONS.find((opt) => opt.value === selectedStatus)?.label ||
    "All Statuses";

  return (
    <div>
      <PageHeader
        title="All Vehicles"
        subtitle="Platform-wide vehicle records across all sites."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by rego, VIN..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-56 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
              >
                <span>{selectedStatusLabel}</span>
                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
                  {STATUS_FILTER_OPTIONS.map((opt) => {
                    const isSelected = selectedStatus === opt.value;
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

            {/* Add Vehicle Button */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Vehicle
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
              of <span className="font-semibold text-neutral-800">{totalItems}</span> vehicles
              {selectedStatus !== "ALL" && (
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
                    {["Vehicle", "Registration", "VIN", "Customer ID", "Odometer", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-neutral-500">
                        {searchQuery || selectedStatus !== "ALL"
                          ? "No vehicles matched your search or status filter."
                          : 'No vehicles found. Click "Add Vehicle" to create one.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedVehicles.map((v) => {
                      const id = v._id || v.id || Math.random().toString();
                      const rawCustomer = v.customerId || (v as any).customer;
                      const customerDisplay =
                        typeof rawCustomer === "object" && rawCustomer !== null
                          ? [rawCustomer.firstName, rawCustomer.lastName].filter(Boolean).join(" ") ||
                          rawCustomer.name ||
                          rawCustomer.email ||
                          rawCustomer._id ||
                          "-"
                          : rawCustomer || "-";

                      return (
                        <tr
                          key={id}
                          onClick={() => handleRowClick(v)}
                          className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                                <Car className="h-4 w-4 text-neutral-500" />
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900">{v.year} {v.make} {v.model}</p>
                                <p className="text-xs text-neutral-400">{v.colour || "No colour"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-neutral-700">{v.rego}</td>
                          <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{v.vin}</td>
                          <td className="px-5 py-3.5 text-neutral-600">{customerDisplay}</td>
                          <td className="px-5 py-3.5 text-neutral-500">
                            {v.odometer != null ? `${v.odometer} km` : "N/A"}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge tone={v.status ? (statusTone[v.status] || "neutral") : "neutral"}>
                              {v.status ? (statusLabel[v.status] || v.status) : "Unknown"}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleOpenEditModal(v, e)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                                title="Edit Vehicle"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(id);
                                }}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                title="Delete Vehicle"
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

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        vehicle={selectedVehicle}
      />

      <VehicleDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        vehicle={viewingVehicle}
      />
    </div>
  );
}
