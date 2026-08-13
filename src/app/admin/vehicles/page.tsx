"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { Car, Pencil, Trash2, Loader2 } from "lucide-react";
import { VehicleModal } from "@/components/vehicles/VehicleModal";
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

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVehicles = async (query = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = query.trim() ? `${API_URL}/vehicles/search?q=${encodeURIComponent(query.trim())}` : `${API_URL}/vehicles`;
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch vehicles");
      }

      setVehicles(data.data || data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchVehicles(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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

  const handleOpenEditModal = async (vehicle: Vehicle) => {
    // If the vehicle came from a search result, it might only have partial data.
    // Let's fetch the full vehicle details by ID before editing.
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const vid = vehicle._id || vehicle.id;
      if (vid) {
        const res = await fetch(`${API_URL}/vehicles/${vid}`, { headers });
        const data = await res.json();
        if (res.ok && data.data) {
          setSelectedVehicle(data.data);
          setIsModalOpen(true);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to fetch full vehicle details, falling back to basic data.", err);
    }
    
    // Fallback if fetch fails or no ID
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchVehicles(searchQuery);
  };

  return (
    <div>
      <PageHeader
        title="All Vehicles"
        subtitle="Platform-wide vehicle records across all sites."
        action={
          <Toolbar
            searchPlaceholder="Search by rego, VIN..."
            filterLabel="All Statuses"
            ctaLabel="Add Vehicle"
            onCtaClick={handleOpenAddModal}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />
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
          <p className="mb-4 text-sm text-neutral-500">{vehicles.length} vehicles</p>
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
                  {vehicles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-neutral-500">
                        No vehicles found. Click "Add Vehicle" to create one.
                      </td>
                    </tr>
                  ) : (
                    vehicles.map((v) => {
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
                        <tr key={id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
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
                                onClick={() => handleOpenEditModal(v)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                                title="Edit Vehicle"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
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
        </>
      )}

      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
