"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { Calendar, Loader2, Edit2, Trash2 } from "lucide-react";
import { NewBookingModal } from "@/components/booking/NewBookingModal";
import { BookingDetailsModal } from "@/components/booking/BookingDetailsModal";
import { API_URL } from "@/lib/config";

// Ensure we match the statuses coming from the backend or fallback nicely
type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled" | "scheduled" | "pending" | "in_progress" | "completed" | "cancelled";

const statusTone: Record<string, "green" | "orange" | "blue" | "neutral"> = {
  Confirmed: "green",
  Pending: "orange",
  Completed: "blue",
  Cancelled: "neutral",
  scheduled: "blue",
  pending: "orange",
  in_progress: "blue",
  completed: "green",
  cancelled: "neutral"
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export default function ExecutiveBookingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [viewBookingId, setViewBookingId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.data || []);
      } else {
        setError(data.message || "Failed to fetch bookings");
      }
    } catch (err) {
      setError("Unable to reach the server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchBookings();
      } else {
        alert("Failed to delete booking.");
      }
    } catch (err) {
      alert("Unable to reach the server.");
    }
  };

  const getCustomerName = (customerId: any) => {
    if (!customerId) return "Unknown";
    if (typeof customerId === "object") {
      return `${customerId.firstName || ""} ${customerId.lastName || ""}`.trim() || "Unknown";
    }
    return "Unknown";
  };

  const getLocationName = (locationId: any) => {
    if (!locationId) return "Unknown";
    if (typeof locationId === "object") {
      return locationId.name || "Unknown";
    }
    return "Unknown";
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return { date: "-", time: "-" };
    const dateObj = new Date(dateString);
    return {
      date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Platform-wide bookings overview."
        action={
          <Toolbar 
            searchPlaceholder="Search bookings..." 
            filterLabel="All Types" 
            ctaLabel="New Booking" 
            onCtaClick={() => {
              setSelectedBooking(null);
              setIsModalOpen(true);
            }}
          />
        }
      />

      <Panel padded={false}>
        <div className="overflow-x-auto">
          {error && <div className="p-4 text-sm text-red-600 bg-red-50">{error}</div>}
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Booking #", "Customer", "Type", "Date", "Time", "Site", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-neutral-500">
                    <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" /> Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-neutral-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const { date, time } = formatDateTime(booking.serviceDateTime || booking.scheduledAt);
                  const displayStatus = booking.status || "Pending";
                  const tone = statusTone[displayStatus] || "neutral";
                  
                  return (
                    <tr 
                      key={booking._id} 
                      onClick={() => setViewBookingId(booking._id)}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                          </div>
                          <span className="font-mono text-xs font-semibold text-neutral-700">
                            {booking._id.substring(0, 8)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-neutral-900">
                        {getCustomerName(booking.customerId)}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600 capitalize">
                        {(booking.serviceType || "Unknown").replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-3.5 text-neutral-500">{date}</td>
                      <td className="px-5 py-3.5 text-neutral-500">{time}</td>
                      <td className="px-5 py-3.5 text-neutral-500">
                        {getLocationName(booking.locationId)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={tone}>
                          <span className="capitalize">{displayStatus}</span>
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(booking);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Booking"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBooking(booking._id);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Booking"
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

      <NewBookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        booking={selectedBooking}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchBookings(); // Refresh list after successful creation or update
        }}
      />

      <BookingDetailsModal 
        isOpen={!!viewBookingId} 
        onClose={() => setViewBookingId(null)} 
        bookingId={viewBookingId} 
      />
    </div>
  );
}
