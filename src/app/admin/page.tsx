"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { IconStatCard } from "@/components/dashboard/StatCard";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { IntegrationRow } from "@/components/dashboard/IntegrationRow";
import { LocationListItem } from "@/components/dashboard/LocationCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { Badge } from "@/components/ui/Badge";
import {
  Radio,
  ArrowRight,
  Users,
  Car,
  ClipboardList,
  MapPin,
  CalendarDays,
  Clock,
  Activity,
  Loader2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { integrationHealth, adminLocations, adminQuickActions } from "@/lib/data/admin-overview";
import { API_URL } from "@/lib/config";

const statusTone: Record<string, "blue" | "orange" | "neutral" | "green" | "red"> = {
  open: "blue",
  in_progress: "orange",
  awaiting_parts: "neutral",
  completed: "green",
  quality_check: "orange",
  invoiced: "green",
  closed: "neutral"
};

const priorityColor: Record<string, string> = {
  low: "bg-neutral-100 text-neutral-800",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/analytics/dashboard`, { headers });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to fetch dashboard analytics");
        }
        setData(json.data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cleanCustomerName = (name: string) => {
    if (!name || name.includes("${") || name.includes("undefined")) {
      return "Unknown Customer";
    }
    return name;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const stats = data ? [
    { label: "Total Customers", value: String(data.totalCustomers ?? 0), icon: Users, accent: "red" as const, helper: "Live data" },
    { label: "Active Vehicles", value: String(data.activeVehicles ?? 0), icon: Car, accent: "orange" as const, helper: "Live data" },
    { label: "Open Jobs", value: String(data.openJobs ?? 0), icon: ClipboardList, accent: "green" as const, helper: "Live data" },
    { label: "Total Locations", value: String(data.totalLocations ?? 0), icon: MapPin, accent: "purple" as const, helper: "Live data" },
    { label: "Bookings Today", value: String(data.bookingsToday ?? 0), icon: CalendarDays, accent: "blue" as const, helper: "Live data" },
    { label: "Pending Bookings", value: String(data.pendingBookings ?? 0), icon: Clock, accent: "purple" as const, helper: "Live data" }
  ] : [];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2.5 text-neutral-500">
          <Loader2 className="h-7 w-7 animate-spin text-rose-600" />
          <p className="text-sm font-semibold">Loading platform overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-lg font-bold text-neutral-900">Unable to load dashboard</h3>
          <p className="mt-1.5 text-sm text-neutral-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Platform Overview"
        subtitle="Good Showroom DMS · BYD Harmony Automotive · Super Admin"
      />

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <IconStatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Job Activity Panel */}
        <Panel>
          <PanelHeader
            title=""
            action={
              <span className="flex items-center gap-2 text-[15px] font-bold text-neutral-900">
                <Activity className="h-4 w-4 text-emerald-500" />
                Recent Job Activity
              </span>
            }
          />
          <div className="divide-y divide-neutral-100 max-h-[300px] overflow-y-auto pr-1">
            {!data?.recentActivity || data.recentActivity.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">No recent activity found.</p>
            ) : (
              data.recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-3">
                    <p className="font-semibold text-sm text-neutral-900 truncate">
                      {cleanCustomerName(activity.customerName)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Order: <span className="font-mono font-medium text-neutral-700">{activity.orderNumber || "N/A"}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge tone={activity.status ? (statusTone[activity.status] || "neutral") : "neutral"}>
                      {activity.status ? (activity.status.replace("_", " ")) : "unknown"}
                    </Badge>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {formatDate(activity.updatedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Job Breakdown Panel */}
        <Panel>
          <PanelHeader title="Jobs Breakdown" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 -mt-1">
            {/* Status Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">By Status</h4>
              <div className="space-y-3">
                {Object.entries(data?.jobsByStatus || {}).map(([status, count]: [string, any]) => {
                  const total = Object.values(data?.jobsByStatus || {}).reduce((a: any, b: any) => a + b, 0) as number;
                  const pct = total > 0 ? ((count / total) * 100).toFixed(0) : "0";
                  return (
                    <div key={status} className="text-sm">
                      <div className="flex justify-between text-neutral-600 mb-1 font-medium capitalize text-xs">
                        <span>{status.replace("_", " ")}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priority Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">By Priority</h4>
              <div className="space-y-3.5">
                {Object.entries(data?.jobsByPriority || {}).map(([priority, count]: [string, any]) => (
                  <div key={priority} className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${priorityColor[priority] || "bg-neutral-100 text-neutral-800"}`}>
                      {priority}
                    </span>
                    <span className="font-bold text-neutral-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
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
      </div> */}

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminQuickActions.map((action) => (
          <QuickActionCard key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
}
