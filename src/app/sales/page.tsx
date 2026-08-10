import { PageHeader } from "@/components/dashboard/PageHeader";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { LeadCard } from "@/components/kanban/LeadCard";
import { activeCustomers, serviceClients } from "@/lib/data/queues";

export default function SalesPipelinePage() {
  const total = activeCustomers.length + serviceClients.length;

  return (
    <div>
      <PageHeader
        title="Sales Pipeline"
        subtitle={`${total} total in pipeline`}
        action={<Toolbar searchPlaceholder="Search..." ctaLabel="Add Lead" />}
      />

      <div className="flex gap-4 overflow-x-auto pb-2">
        <KanbanColumn title="Prospects" count={0} accent="blue" emptyLabel="No prospects" />
        <KanbanColumn title="Active Customers" count={activeCustomers.length} accent="green" emptyLabel="No customers">
          {activeCustomers.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </KanbanColumn>
        <KanbanColumn title="Service Clients" count={serviceClients.length} accent="orange" emptyLabel="No clients">
          {serviceClients.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </KanbanColumn>
      </div>
    </div>
  );
}
