"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { AddLocation } from "@/components/location/AddLocation";
import {
  Building2,
  Phone,
  Mail,
  Plus,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { API_URL } from "@/lib/config";

interface Location {
  _id: string;
  name: string;
  type: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  capacity: number;
  isActive: boolean;
}

export default function AdminLocationsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/locations`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Failed to load locations.");
      } else {
        setLocations(data.data ?? []);
      }
    } catch {
      setError("Unable to reach the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleDelete = async (loc: Location) => {
    if (!window.confirm(`Are you sure you want to delete "${loc.name}"?`)) return;
    setDeletingId(loc._id);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/locations/${loc._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: "Bearer " + accessToken } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete location.");
      } else {
        fetchLocations();
      }
    } catch {
      alert("Unable to reach the server. Please check your connection.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatAddress = (loc: Location) => {
    const parts = [loc.address, loc.suburb, loc.state, loc.postcode].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div>
      <PageHeader
        title="Locations"
        subtitle="Manage sales, service, and delivery centres"
        action={
          <button
            id="open-add-location"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Location
          </button>
        }
      />

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm">Loading locations...</span>
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchLocations}
            className="ml-auto text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && locations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Building2 className="h-10 w-10 mb-3 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-500">No locations found</p>
          <p className="text-xs mt-1">Click &quot;Add Location&quot; to create your first one.</p>
        </div>
      )}

      {/* Location list */}
      {!isLoading && !error && locations.length > 0 && (
        <div className="space-y-4">
          {locations.map((loc) => (
            <Panel key={loc._id} padded={false}>
              <div className="flex items-start gap-4 p-5">
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
                  <Building2 className="h-5 w-5 text-neutral-400" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold text-neutral-900">
                      {loc.name}
                    </p>
                    <Badge tone="neutral">{loc.type}</Badge>
                    <Badge tone={loc.isActive ? "green" : "neutral"}>
                      {loc.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-neutral-500">{formatAddress(loc)}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    {loc.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-neutral-400" />
                        {loc.phone}
                      </span>
                    )}
                    {loc.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-neutral-400" />
                        {loc.email}
                      </span>
                    )}
                    <span className="text-neutral-400">
                      Capacity:{" "}
                      <span className="font-medium text-neutral-600">{loc.capacity}</span>
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Edit */}
                  <button
                    id={`edit-location-${loc._id}`}
                    title="Edit location"
                    onClick={() => setEditingLocation(loc)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    id={`delete-location-${loc._id}`}
                    title="Delete location"
                    onClick={() => handleDelete(loc)}
                    disabled={deletingId === loc._id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === loc._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* Add Location modal */}
      <AddLocation
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          fetchLocations();
        }}
      />

      {/* Edit Location modal */}
      <AddLocation
        isOpen={Boolean(editingLocation)}
        editLocation={editingLocation}
        onClose={() => setEditingLocation(null)}
        onSuccess={() => {
          setEditingLocation(null);
          fetchLocations();
        }}
      />
    </div>
  );
}
