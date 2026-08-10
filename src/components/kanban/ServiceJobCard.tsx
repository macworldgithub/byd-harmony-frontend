import { Badge } from "@/components/ui/Badge";
import type { ServiceJob } from "@/lib/types";

export function ServiceJobCard({ job }: { job: ServiceJob }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-rose-600">{job.code}</p>
        <Badge tone="blue">{job.priority}</Badge>
      </div>
      <p className="mt-1.5 text-sm text-neutral-400">—</p>
      <p className="text-sm text-neutral-400">—</p>
      <p className="mt-1 text-sm text-neutral-600">{job.detail}</p>
      {job.completeBadge && (
        <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
          Complete ✓
        </span>
      )}
    </div>
  );
}
