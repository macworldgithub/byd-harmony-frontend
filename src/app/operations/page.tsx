import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import Link from "next/link";
import {
  Users,
  Car,
  Calendar,
  ClipboardList,
  MapPin,
  TrendingUp,
  Bell,
  Plus,
  Activity,
} from "lucide-react";

const stats = [
  { label: "Total Customers", value: 6, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Vehicles", value: 6, icon: Car, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Bookings Today", value: 0, icon: Calendar, color: "text-orange-500", bg: "bg-orange-50" },
  { label: "Open Jobs", value: 5, icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-50" },
];

const locations = [
  {
    name: "BYD Caroline Springs",
    type: "Combined · Caroline Springs",
    open: 5,
    upcoming: 5,
    revenue: "$0",
    initials: "C",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "BYD Harmony Service Centre",
    type: "Service · Richmond",
    open: 0,
    upcoming: 0,
    revenue: "$0",
    initials: "S",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "BYD Nunawading",
    type: "Combined · Nunawading",
    open: 0,
    upcoming: 0,
    revenue: "$0",
    initials: "C",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "BYD Test Location 1786423497775",
    type: "Service · Richmond",
    open: 0,
    upcoming: 0,
    revenue: "$0",
    initials: "S",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Denza Melbourne",
    type: "Combined · Melbourne",
    open: 0,
    upcoming: 0,
    revenue: "$0",
    initials: "C",
    color: "bg-rose-100 text-rose-700",
  },
];

const liveActivity = [
  { type: "System", message: "Customer profile created for John Smith", time: "9:44 am" },
  { type: "Job Updated", message: "BYD-00005 status: In_Progress", time: "9:44 am" },
  { type: "Job Created", message: "Job card BYD-00005 created", time: "9:44 am" },
  { type: "Booking Updated", message: "Booking 005 updated to: confirmed", time: "9:44 am" },
  { type: "Booking Created", message: "Service booking BYD-00004 — normal", time: "9:44 am" },
  { type: "Vehicle Added", message: "2025 BYD Seal (XYZ789)", time: "9:44 am" },
  { type: "Vehicle Added", message: "2025 BYD Atto 3 (ABC123)", time: "9:44 am" },
  { type: "System", message: "2025 BYD Atto 3 (ABC123) added", time: "9:44 am" },
  { type: "Note", message: "Customer profile created for John Smith", time: "9:43 am" },
  { type: "Job Updated", message: "BYD-00004 status: in_progress", time: "9:43 am" },
];

const quickActions = [
  { label: "Customers", icon: Users, href: "/operations/customers" },
  { label: "Bookings", icon: Calendar, href: "/operations/bookings" },
  { label: "Job Cards", icon: ClipboardList, href: "/operations/job-cards" },
  { label: "Documents", icon: ClipboardList, href: "/operations/documents" },
];

function getToday() {
  return new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OperationsDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Operations Dashboard"
        subtitle={getToday()}
        action={
          <div className="flex gap-2">
            <Link
              href="/operations/bookings"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              New Booking
            </Link>
            <Link
              href="/operations/customers"
              className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Customer
            </Link>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{s.label}</p>
                  <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Location Performance + Right panel */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Location Performance */}
        <div className="lg:col-span-2">
          <Panel>
            <PanelHeader
              title="📍 Location Performance"
              action={
                <Link href="/operations/locations" className="text-xs font-semibold text-rose-600 hover:underline">
                  Manage
                </Link>
              }
            />
            <div className="divide-y divide-neutral-100">
              {locations.map((loc) => (
                <div key={loc.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${loc.color}`}>
                      {loc.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{loc.name}</p>
                      <p className="text-xs text-neutral-500">{loc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-neutral-500">
                    <span>
                      <span className="font-semibold text-neutral-800">{loc.open}</span> open
                    </span>
                    <span>
                      <span className="font-semibold text-neutral-800">{loc.upcoming}</span> upcoming
                    </span>
                    <span className="font-semibold text-neutral-700">{loc.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Reminders */}
          <Panel>
            <PanelHeader
              title="🔔 Reminders"
              action={
                <button className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </button>
              }
            />
            <p className="text-sm text-neutral-400">All clear — no open reminders.</p>
          </Panel>

          {/* Live Activity */}
          <Panel className="flex-1">
            <PanelHeader
              title="Live Activity"
              action={
                <span className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                  <Activity className="h-3.5 w-3.5 animate-pulse" />
                  Live
                </span>
              }
            />
            <div className="max-h-64 space-y-1 overflow-y-auto text-xs">
              {liveActivity.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-2 py-1.5 border-b border-neutral-50 last:border-0">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                    <div>
                      <span className="font-semibold text-neutral-700">{item.type}</span>
                      <span className="text-neutral-500"> — {item.message}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-neutral-400">{item.time}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-5">
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <Link
                key={qa.label}
                href={qa.href}
                className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-5 text-center shadow-sm hover:border-rose-200 hover:bg-rose-50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                  <Icon className="h-5 w-5 text-rose-600" />
                </div>
                <span className="text-sm font-medium text-neutral-700">{qa.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
