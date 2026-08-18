// "use client";

// import { useState, useEffect, useRef, FormEvent } from "react";
// import { Modal } from "@/components/ui/Modal";
// import { Calendar, Loader2 } from "lucide-react";
// import { API_URL } from "@/lib/config";
// import toast from "react-hot-toast";

// export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
// export type BookingServiceType =
//   | "routine_service"
//   | "repair"
//   | "warranty"
//   | "inspection"
//   | "other";

// const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
//   { value: "pending", label: "Pending" },
//   { value: "confirmed", label: "Confirmed" },
//   { value: "in_progress", label: "In Progress" },
//   { value: "completed", label: "Completed" },
//   { value: "cancelled", label: "Cancelled" },
// ];

// const SERVICE_TYPE_OPTIONS: { value: BookingServiceType; label: string }[] = [
//   { value: "routine_service", label: "Routine Service" },
//   { value: "repair", label: "Repair" },
//   { value: "warranty", label: "Warranty" },
//   { value: "inspection", label: "Inspection" },
//   { value: "other", label: "Other" },
// ];

// const selectClass =
//   "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10";

// const inputClass =
//   "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10";

// function getAuthHeaders(): HeadersInit {
//   const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
//   const headers: HeadersInit = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   return headers;
// }

// interface BookingModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   booking?: any | null;
//   locationId: string;
// }

// export function BookingModal({
//   isOpen,
//   onClose,
//   onSuccess,
//   booking,
//   locationId,
// }: BookingModalProps) {
//   const isEdit = !!booking;

//   const [customerId, setCustomerId] = useState("");
//   const [vehicleId, setVehicleId] = useState("");
//   const [serviceType, setServiceType] = useState<BookingServiceType>("routine_service");
//   const [serviceDateTime, setServiceDateTime] = useState("");
//   const [estimatedDuration, setEstimatedDuration] = useState<number | "">("");
//   const [notes, setNotes] = useState("");
//   const [status, setStatus] = useState<BookingStatus>("pending");

//   const [customers, setCustomers] = useState<any[]>([]);
//   const [vehicles, setVehicles] = useState<any[]>([]);
//   const [isFetchingRelations, setIsFetchingRelations] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const firstFieldRef = useRef<HTMLSelectElement>(null);

//   useEffect(() => {
//     if (!isOpen) return;
//     setError(null);
//     setIsLoading(false);

//     if (isEdit && booking) {
//       setCustomerId(booking.customerId?._id || booking.customerId || "");
//       setVehicleId(booking.vehicleId?._id || booking.vehicleId || "");
//       setServiceType(booking.serviceType || "routine_service");
//       setStatus(booking.status || "pending");
//       setNotes(booking.notes || "");
//       setEstimatedDuration(booking.estimatedDuration || "");
//       if (booking.serviceDateTime) {
//         // Format as datetime-local (YYYY-MM-DDTHH:mm)
//         const d = new Date(booking.serviceDateTime);
//         const iso = d.toISOString().slice(0, 16);
//         setServiceDateTime(iso);
//       } else {
//         setServiceDateTime("");
//       }
//     } else {
//       setCustomerId("");
//       setVehicleId("");
//       setServiceType("routine_service");
//       setStatus("pending");
//       setNotes("");
//       setEstimatedDuration("");
//       setServiceDateTime("");
//     }

//     // Load customers and vehicles for dropdowns (scoped to location)
//     if (!isEdit) {
//       setIsFetchingRelations(true);
//       const headers: HeadersInit = {};
//       const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
//       if (token) headers["Authorization"] = `Bearer ${token}`;

//       const locQuery = locationId ? `?locationId=${encodeURIComponent(locationId)}&limit=200` : "?limit=200";

//       Promise.all([
//         fetch(`${API_URL}/customers${locQuery}`, { headers }).then((r) => (r.ok ? r.json() : {})),
//         fetch(`${API_URL}/vehicles?limit=200`, { headers }).then((r) => (r.ok ? r.json() : {})),
//       ])
//         .then(([custData, vehData]) => {
//           setCustomers(custData?.data ?? (Array.isArray(custData) ? custData : []));
//           setVehicles(vehData?.data ?? (Array.isArray(vehData) ? vehData : []));
//         })
//         .catch(() => {
//           setCustomers([]);
//           setVehicles([]);
//         })
//         .finally(() => setIsFetchingRelations(false));
//     }

//     setTimeout(() => firstFieldRef.current?.focus(), 80);
//   }, [isOpen, booking, isEdit, locationId]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!serviceDateTime) {
//       setError("Service date & time is required.");
//       return;
//     }
//     if (!isEdit && !customerId) {
//       setError("Please select a customer.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       let url = `${API_URL}/bookings`;
//       let method = "POST";
//       let payload: any = {};

//       if (isEdit) {
//         url = `${API_URL}/bookings/${booking._id || booking.id}`;
//         method = "PUT";
//         payload = {
//           serviceType,
//           serviceDateTime: new Date(serviceDateTime).toISOString(),
//           estimatedDuration: estimatedDuration || undefined,
//           notes: notes.trim() || undefined,
//           status,
//         };
//       } else {
//         payload = {
//           customerId,
//           vehicleId: vehicleId || undefined,
//           locationId,
//           serviceType,
//           serviceDateTime: new Date(serviceDateTime).toISOString(),
//           estimatedDuration: estimatedDuration || undefined,
//           notes: notes.trim() || undefined,
//           status,
//         };
//       }

//       const res = await fetch(url, {
//         method,
//         headers: getAuthHeaders(),
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         throw new Error(data?.message || `Failed to ${isEdit ? "update" : "create"} booking`);
//       }

//       toast.success(`Booking ${isEdit ? "updated" : "created"} successfully!`);
//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       const msg = err?.message || "An error occurred. Please try again.";
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={isEdit ? "Edit Booking" : "New Booking"}
//       subtitle={isEdit ? "Update booking details" : "Create a new service booking"}
//       headerIcon={<Calendar className="h-5 w-5" />}
//       maxWidth="max-w-2xl"
//     >
//       <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
//           {/* CREATE ONLY FIELDS */}
//           {!isEdit && (
//             <>
//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
//                   Customer <span className="text-rose-500">*</span>
//                 </label>
//                 <select
//                   required
//                   ref={firstFieldRef}
//                   value={customerId}
//                   onChange={(e) => setCustomerId(e.target.value)}
//                   disabled={isFetchingRelations}
//                   className={selectClass}
//                 >
//                   <option value="">
//                     {isFetchingRelations ? "Loading…" : "Select a customer"}
//                   </option>
//                   {customers.map((c: any) => {
//                     const id = c._id || c.id;
//                     const name =
//                       [c.firstName, c.lastName].filter(Boolean).join(" ") ||
//                       c.name ||
//                       id;
//                     return (
//                       <option key={id} value={id}>
//                         {name} {c.phone ? `(${c.phone})` : c.email ? `(${c.email})` : ""}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
//                   Vehicle (Optional)
//                 </label>
//                 <select
//                   value={vehicleId}
//                   onChange={(e) => setVehicleId(e.target.value)}
//                   disabled={isFetchingRelations}
//                   className={selectClass}
//                 >
//                   <option value="">
//                     {isFetchingRelations ? "Loading…" : "Select a vehicle"}
//                   </option>
//                   {vehicles.map((v: any) => {
//                     const id = v._id || v.id;
//                     const label = `${v.year || ""} ${v.make || ""} ${v.model || ""}`.trim() + (v.rego ? ` — ${v.rego}` : v.vin ? ` — ${v.vin}` : "");
//                     return (
//                       <option key={id} value={id}>
//                         {label}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//             </>
//           )}

//           {/* Service Date & Time */}
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
//               Service Date & Time <span className="text-rose-500">*</span>
//             </label>
//             <input
//               type="datetime-local"
//               required
//               value={serviceDateTime}
//               onChange={(e) => setServiceDateTime(e.target.value)}
//               disabled={isLoading}
//               className={inputClass}
//             />
//           </div>

//           {/* Service Type */}
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
//               Service Type
//             </label>
//             <select
//               value={serviceType}
//               onChange={(e) => setServiceType(e.target.value as BookingServiceType)}
//               disabled={isLoading}
//               className={selectClass}
//             >
//               {SERVICE_TYPE_OPTIONS.map((opt) => (
//                 <option key={opt.value} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Estimated Duration */}
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
//               Estimated Duration (mins)
//             </label>
//             <input
//               type="number"
//               min={0}
//               value={estimatedDuration}
//               onChange={(e) =>
//                 setEstimatedDuration(e.target.value ? Number(e.target.value) : "")
//               }
//               disabled={isLoading}
//               placeholder="e.g. 60"
//               className={inputClass}
//             />
//           </div>

//           {/* Status (Edit mode only) */}
//           {isEdit && (
//             <div>
//               <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
//                 Status
//               </label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value as BookingStatus)}
//                 disabled={isLoading}
//                 className={selectClass}
//               >
//                 {STATUS_OPTIONS.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Notes */}
//           <div className="sm:col-span-2">
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
//               Notes (Optional)
//             </label>
//             <textarea
//               rows={3}
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               disabled={isLoading}
//               placeholder="Any special instructions or details…"
//               className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-500/10 resize-none"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 pt-2">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={isLoading}
//             className="rounded-xl px-5 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isLoading || isFetchingRelations}
//             className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
//           >
//             {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
//             {isEdit ? "Save Changes" : "Create Booking"}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// }
