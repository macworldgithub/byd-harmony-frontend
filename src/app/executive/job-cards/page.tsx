import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { Wrench } from "lucide-react";

type JobStatus = "Open" | "In Progress" | "Awaiting Parts" | "Completed";

const statusTone: Record<JobStatus, "blue" | "orange" | "neutral" | "green"> = {
  Open: "blue",
  "In Progress": "orange",
  "Awaiting Parts": "neutral",
  Completed: "green",
};

const jobCards = [
  { id: "JC-001", customer: "Lee Atkinson",   vehicle: "2024 BYD Atto 3",   description: "12,000 km scheduled service",        site: "Richmond",  status: "Open"           as JobStatus, created: "10 Aug 2026" },
  { id: "JC-002", customer: "John Smith",      vehicle: "2024 BYD Seal",      description: "Brake pad replacement",              site: "Richmond",  status: "In Progress"    as JobStatus, created: "10 Aug 2026" },
  { id: "JC-003", customer: "Sarah Mitchell",  vehicle: "2023 BYD Dolphin",   description: "Air con regas",                      site: "BYD 2",     status: "Awaiting Parts" as JobStatus, created: "9 Aug 2026"  },
];

export default function ExecutiveJobCardsPage() {
  return (
    <div>
      <PageHeader
        title="Job Cards"
        subtitle="Platform-wide service job cards overview."
        action={<Toolbar searchPlaceholder="Search job cards..." filterLabel="All Statuses" ctaLabel="New Job Card" />}
      />

      <Panel padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Job #", "Customer", "Vehicle", "Description", "Site", "Created", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobCards.map((job) => (
                <tr key={job.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50">
                        <Wrench className="h-3.5 w-3.5 text-orange-500" />
                      </div>
                      <span className="font-mono text-xs font-semibold text-neutral-700">{job.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-neutral-900">{job.customer}</td>
                  <td className="px-5 py-3.5 text-xs text-neutral-500">{job.vehicle}</td>
                  <td className="px-5 py-3.5 text-neutral-600 max-w-[180px] truncate">{job.description}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{job.site}</td>
                  <td className="px-5 py-3.5 text-xs text-neutral-400">{job.created}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={statusTone[job.status]}>{job.status}</Badge>
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
