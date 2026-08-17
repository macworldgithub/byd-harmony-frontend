"use client";

import { useState, useEffect } from "react";
import { X, Loader2, User, Car, MapPin, Calendar, Clock } from "lucide-react";
import { API_URL } from "@/lib/config";
import { Modal } from "@/components/ui/Modal";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export function BookingDetailsModal({ isOpen, onClose, bookingId }: BookingDetailsModalProps) {
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    const fetchBookingDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          setBookingData(data.data);
        } else {
          setError(data.message || "Failed to load booking details");
        }
      } catch (err) {
        setError("Unable to reach the server. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  const customer = bookingData?.customerId || {};
  const vehicle = bookingData?.vehicleId || {};
  const location = bookingData?.locationId || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        role="dialog"
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{ animation: "detailsModalIn 0.2s ease-out forwards" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">
              Booking Details
            </h2>
            {bookingData && (
              <p className="text-sm text-neutral-500 mt-0.5">
                Ref: {bookingData._id.substring(0, 8).toUpperCase()} •{" "}
                <span className="capitalize text-neutral-600 font-medium">
                  {bookingData.status}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-neutral-500 font-medium">Loading booking details...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 border border-red-100">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          ) : bookingData ? (
            <div className="space-y-8">
              
              {/* Customer Section */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
                  <User className="h-4 w-4 text-blue-500" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Name</p>
                    <p className="text-sm font-medium text-neutral-900">{customer.firstName} {customer.lastName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-medium text-neutral-900">{customer.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm font-medium text-neutral-900">{customer.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm font-medium text-neutral-900">{customer.address || "—"}</p>
                  </div>
                </div>
              </section>

              {/* Vehicle Section */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
                  <Car className="h-4 w-4 text-emerald-500" />
                  Vehicle Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Make</p>
                    <p className="text-sm font-medium text-neutral-900">{vehicle.make || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Model</p>
                    <p className="text-sm font-medium text-neutral-900">{vehicle.model || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Year</p>
                    <p className="text-sm font-medium text-neutral-900">{vehicle.year || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Rego</p>
                    <p className="text-sm font-medium text-neutral-900">{vehicle.rego || "—"}</p>
                  </div>
                </div>
              </section>

              {/* Location & Service Section */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  Service & Location
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 rounded-xl border border-neutral-100 bg-neutral-50/50 p-5">
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Location Name</p>
                    <p className="text-sm font-medium text-neutral-900">{location.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">State</p>
                    <p className="text-sm font-medium text-neutral-900">{location.state || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Service Type</p>
                    <p className="text-sm font-medium text-neutral-900 capitalize">
                      {(bookingData.serviceType || "—").replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1">Scheduled At</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {bookingData.scheduledAt 
                        ? new Date(bookingData.scheduledAt).toLocaleString() 
                        : bookingData.serviceDateTime
                          ? new Date(bookingData.serviceDateTime).toLocaleString()
                          : "—"}
                    </p>
                  </div>
                </div>
              </section>

            </div>
          ) : null}
        </div>
        
        {/* Footer */}
        <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-white border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
      
      <style
        dangerouslySetInnerHTML={{
          __html:
            "@keyframes detailsModalIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }",
        }}
      />
    </div>
  );
}
