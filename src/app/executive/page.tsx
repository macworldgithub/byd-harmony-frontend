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

export default function ExecutiveDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Business Intelligence"
        subtitle="Cross-site performance · All departments · Live data · Monday 10 August 2026"
      />

      <MetricStatCardGrid stats={executiveStats} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Revenue Trend — 30 days" />
          <ChartPlaceholder message="No revenue data yet — add job cards with costs to see trends" />
        </Panel>
        <Panel>
          <PanelHeader title="Customer Acquisition — 30 days" />
          <AxisPlaceholder />
        </Panel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Location Performance"
            action={
              <Link
                href="/executive/site-comparison"
                className="flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <LocationPerformanceBar {...locationPerformance} />
        </Panel>

        <Panel>
          <PanelHeader title="Response Time Metrics" />
          <div className="grid grid-cols-2 gap-3">
            {responseTimeMetrics.map((m) => (
              <div key={m.label} className="rounded-xl bg-neutral-50 p-4 text-center">
                <p className={`text-2xl font-bold ${m.accent}`}>{m.value}</p>
                <p className="mt-1 text-xs text-neutral-500">{m.label}</p>
              </div>
            ))}
          </div>

          <p className="mb-2 mt-5 text-[11px] font-bold tracking-widest text-neutral-400">
            RECENT ACTIVITY
          </p>
          <ActivityFeed items={recentActivity} />
        </Panel>
      </div>
    </div>
  );
}
