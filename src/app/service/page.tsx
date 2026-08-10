import { PageHeader } from "@/components/dashboard/PageHeader";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { ServiceJobCard } from "@/components/kanban/ServiceJobCard";
import { serviceJobs, serviceColumns } from "@/lib/data/service-jobs";

export default function ServiceQueuePage() {
  const jobsByStatus = (status: string) => serviceJobs.filter((j) => j.status === status);

  return (
    <div>
      <PageHeader
        title="Service Queue"
        subtitle={`${serviceJobs.length} total jobs`}
        action={
          <Toolbar searchPlaceholder="Search jobs..." filterLabel="All statuses" ctaLabel="New Job" />
        }
      />

      <div className="flex gap-4 overflow-x-auto pb-2">
        {serviceColumns.map((col) => {
          const jobs = jobsByStatus(col.key);
          return (
            <KanbanColumn
              key={col.key}
              title={col.label}
              count={jobs.length}
              accent={col.accent}
              emptyLabel="No jobs"
            >
              {jobs.map((job) => (
                <ServiceJobCard key={job.id} job={job} />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
    </div>
  );
}
