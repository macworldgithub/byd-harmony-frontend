import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricStatCardGrid } from "@/components/dashboard/StatCard";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { siteExecutiveStats, recentActivity } from "@/lib/data/dashboards";

export default function SiteExecutiveDashboardPage() {
  return (
    <div>
      <PageHeader title="BYD Harmony Automotive — Richmond" subtitle="Monday 10 August 2026" />

      <MetricStatCardGrid stats={siteExecutiveStats} />

      <div className="mt-5">
        <Panel>
          <PanelHeader title="Revenue Trend — 30 days" />
          <ChartPlaceholder message="No revenue data yet" />
        </Panel>
      </div>

      <div className="mt-5">
        <Panel>
          <PanelHeader title="Recent Activity" />
          <ActivityFeed items={recentActivity} />
        </Panel>
      </div>
    </div>
  );
}
