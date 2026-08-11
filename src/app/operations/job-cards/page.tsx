import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";
import { ClipboardList, DollarSign, Calendar, Plus } from "lucide-react";

const jobCards = [
  { id: "BYD-00006", status: "IN PROGRESS", description: "12,000km routine service", price: 299.0, date: "11/08/2026" },
  { id: "BYD-00005", status: "IN PROGRESS", description: "12,000km routine service", price: 299.0, date: "11/08/2026" },
  { id: "BYD-00004", status: "IN PROGRESS", description: "12,000km routine service", price: 299.0, date: "11/08/2026" },
  { id: "BYD-00003", status: "IN PROGRESS", description: "12,000km routine service", price: 299.0, date: "11/08/2026" },
  { id: "BYD-00002", status: "IN PROGRESS", description: "12,000km routine service", price: 299.0, date: "11/08/2026" },
  { id: "BYD-00001", status: "IN PROGRESS", description: "12,000km routine service", price: 299.0, date: "11/08/2026" },
];

export default function OperationsJobCardsPage() {
  return (
    <div>
      <PageHeader
        title="Job Cards"
        subtitle="Service work orders with unique order numbers"
        action={
          <Link
            href="/operations/job-cards/new"
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Job Card
          </Link>
        }
      />

      <div className="space-y-3">
        {jobCards.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center gap-3">
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
                <ClipboardList className="h-6 w-6 text-rose-500" />
              </div>

              {/* Info */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold text-neutral-900">{job.id}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                    {job.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-neutral-600">{job.description}</p>
                <div className="mt-2 flex items-center justify-center gap-4 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {job.price.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {job.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
