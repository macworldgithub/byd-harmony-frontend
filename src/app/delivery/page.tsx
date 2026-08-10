import { PageHeader } from "@/components/dashboard/PageHeader";
import { BigStatCard } from "@/components/dashboard/StatCard";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { DeliveryListItem } from "@/components/queue/DeliveryListItem";
import { Truck, Plus } from "lucide-react";
import { todaysDeliveries, deliveryStats } from "@/lib/data/queues";

export default function DeliveryQueuePage() {
  return (
    <div>
      <PageHeader
        title="Delivery Queue"
        subtitle={`${deliveryStats.today} today · 0 upcoming`}
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">
            <Plus className="h-4 w-4" />
            Schedule Delivery
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BigStatCard value={String(deliveryStats.today)} label="Today" />
        <BigStatCard
          value={String(deliveryStats.thisWeek)}
          label="This Week"
          colorClassName="text-amber-600"
        />
        <BigStatCard value={String(deliveryStats.totalScheduled)} label="Total Scheduled" />
      </div>

      <div className="mt-5">
        <Panel padded={false}>
          <div className="border-b border-neutral-100 px-5 py-4">
            <PanelHeader
              title="Today's Deliveries"
              action={<Truck className="h-4 w-4 text-rose-500" />}
            />
          </div>
          <div>
            {todaysDeliveries.map((item) => (
              <DeliveryListItem key={item.id} item={item} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
