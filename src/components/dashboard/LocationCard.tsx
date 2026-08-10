import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function LocationListItem({
  name,
  detail,
  status,
}: {
  name: string;
  detail: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
          <Building2 className="h-4 w-4 text-neutral-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">{detail}</p>
        </div>
      </div>
      <Badge tone="green">{status}</Badge>
    </div>
  );
}

export function LocationPerformanceBar({
  name,
  detail,
  utilisation,
  openJobs,
  upcomingBookings,
  revenue,
}: {
  name: string;
  detail: string;
  utilisation: number;
  openJobs: number;
  upcomingBookings: number;
  revenue: string;
}) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">{detail}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-bold text-neutral-900">{utilisation}%</p>
          <p className="text-xs text-neutral-400">utilisation</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full bg-amber-500" style={{ width: `${utilisation}%` }} />
      </div>
      <div className="mt-2.5 flex items-center gap-4 text-xs text-neutral-500">
        <span>{openJobs} open jobs</span>
        <span>{upcomingBookings} upcoming bookings</span>
        <span>{revenue} revenue</span>
      </div>
    </div>
  );
}
