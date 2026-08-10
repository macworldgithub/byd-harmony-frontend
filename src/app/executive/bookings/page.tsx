import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { Calendar } from "lucide-react";

type BookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

const statusTone: Record<BookingStatus, "green" | "orange" | "blue" | "neutral"> = {
  Confirmed: "green",
  Pending: "orange",
  Completed: "blue",
  Cancelled: "neutral",
};

const bookings = [
  { id: "B-001", customer: "Lee Atkinson",   type: "Service",   date: "10 Aug 2026", time: "09:00 AM", site: "Richmond",  status: "Confirmed" as BookingStatus },
  { id: "B-002", customer: "John Smith",      type: "Delivery",  date: "10 Aug 2026", time: "11:30 AM", site: "Richmond",  status: "Confirmed" as BookingStatus },
  { id: "B-003", customer: "Sarah Mitchell",  type: "Service",   date: "11 Aug 2026", time: "10:00 AM", site: "BYD 2",     status: "Pending"   as BookingStatus },
];

export default function ExecutiveBookingsPage() {
  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Platform-wide bookings overview."
        action={<Toolbar searchPlaceholder="Search bookings..." filterLabel="All Types" ctaLabel="New Booking" />}
      />

      <Panel padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Booking #", "Customer", "Type", "Date", "Time", "Site", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-neutral-700">{booking.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-neutral-900">{booking.customer}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{booking.type}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{booking.date}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{booking.time}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{booking.site}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={statusTone[booking.status]}>{booking.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
