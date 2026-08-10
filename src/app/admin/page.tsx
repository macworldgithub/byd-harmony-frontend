import { PageHeader } from "@/components/dashboard/PageHeader";
import { IconStatCardGrid } from "@/components/dashboard/StatCard";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { IntegrationRow } from "@/components/dashboard/IntegrationRow";
import { LocationListItem } from "@/components/dashboard/LocationCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Radio, ArrowRight } from "lucide-react";
import Link from "next/link";
import { adminStats, integrationHealth, adminLocations, adminQuickActions } from "@/lib/data/admin-overview";

export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader
        title="Platform Overview"
        subtitle="Good Showroom DMS · BYD Harmony Automotive · Super Admin"
      />

      <IconStatCardGrid stats={adminStats} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title=""
            action={
              <span className="flex items-center gap-2 text-[15px] font-bold text-neutral-900">
                <Radio className="h-4 w-4 text-rose-500" />
                Integration Health
              </span>
            }
          />
          <div className="-mt-2">
            {integrationHealth.map((item, i) => (
              <IntegrationRow key={item.name} item={item} last={i === integrationHealth.length - 1} />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            title="Locations"
            action={
              <Link
                href="/admin/locations"
                className="flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="space-y-3">
            {adminLocations.map((loc) => (
              <LocationListItem key={loc.name} {...loc} />
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminQuickActions.map((action) => (
          <QuickActionCard key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
}
