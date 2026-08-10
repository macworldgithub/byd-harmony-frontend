import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

const bookings = Array(10).fill(null).map((_, i) => ({
  id: i,
  time: "02:00 pm",
  type: "-- routine",
  status: i % 5 === 4 ? "confirmed" : "scheduled",
}));

export default function ServiceBookingCalendarPage() {
  return (
    <div>
      <PageHeader
        title="Booking Calendar"
        subtitle="16 today · 0 upcoming"
        action={
          <button className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors">
            + New Booking
          </button>
        }
      />

      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-4">
          <Clock className="h-4 w-4 text-rose-600" />
          Today — Monday 10 August
        </h3>

        <div className="space-y-3">
          {bookings.map((booking) => (
            <Panel key={booking.id} padded={false} className="border-neutral-200">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-8">
                  <div className="font-semibold text-rose-600 w-20">{booking.time}</div>
                  <div className="text-neutral-500 text-sm">{booking.type}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge tone={booking.status === "confirmed" ? "green" : "blue"}>
                    {booking.status}
                  </Badge>
                  {booking.status === "confirmed" && (
                    <button className="rounded-md border border-neutral-200 px-3 py-1 text-sm font-medium hover:bg-neutral-50 transition-colors text-neutral-700">
                      Start
                    </button>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
