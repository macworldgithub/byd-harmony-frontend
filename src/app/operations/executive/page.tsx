import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricStatCardGrid } from "@/components/dashboard/StatCard";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { ChartPlaceholder, AxisPlaceholder } from "@/components/dashboard/ChartPlaceholder";
import { LocationPerformanceBar } from "@/components/dashboard/LocationCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  executiveStats,
  locationPerformance,
  responseTimeMetrics,
  recentActivity,
} from "@/lib/data/dashboards";

export default function OperationsExecutivePage() {
  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        subtitle="Live business performance across all BYD Harmony Group locations"
      />

      <MetricStatCardGrid stats={executiveStats} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Revenue Over Time (30 days)" />
          <ChartPlaceholder message="Revenue data will appear as jobs are completed and invoiced." />
        </Panel>
        <Panel>
          <PanelHeader title="Customer Acquisition (30 days)" />
          <AxisPlaceholder />
        </Panel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Bookings Over Time (30 days)" />
          <AxisPlaceholder />
        </Panel>
        <Panel>
          <PanelHeader title="Work Distribution" />
          <AxisPlaceholder />
        </Panel>
      </div>
    </div>
  );
}
