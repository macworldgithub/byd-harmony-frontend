import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";
import { Search, Plus, ChevronRight, Phone, Mail, MessageSquare, Clock } from "lucide-react";

const customers = [
  {
    id: "c-1",
    name: "John Smith",
    initials: "JS",
    status: "ACTIVE",
    phone: "0412345678",
    email: "john@example.com",
    tag: "Service",
    messages: 1,
    activities: [
      { text: "Customer called to confirm service appointment", time: "less than a minute ago" },
      { text: "Job BYD-00006 status: in_progress", time: "less than a minute ago" },
      { text: "Job card BYD-00006 created — normal priority", time: "less than a minute ago" },
    ],
    lastSeen: "less than a minute ago",
    hasNote: true,
    isAuto: false,
  },
  {
    id: "c-2",
    name: "John Smith",
    initials: "JS",
    status: "ACTIVE",
    phone: "0412345678",
    email: "john@example.com",
    tag: "Service",
    messages: 1,
    activities: [
      { text: "Customer called to confirm service appointment", time: "1 minute ago" },
      { text: "Job BYD-00005 status: in_progress", time: "1 minute ago" },
      { text: "Job card BYD-00005 created — normal priority", time: "1 minute ago" },
    ],
    lastSeen: "1 minute ago",
    hasNote: true,
    isAuto: false,
  },
  {
    id: "c-3",
    name: "John Smith",
    initials: "JS",
    status: "ACTIVE",
    phone: "0412345678",
    email: "john@example.com",
    tag: "Service",
    messages: 1,
    activities: [
      { text: "Customer called to confirm service appointment", time: "1 minute ago" },
      { text: "Job BYD-00004 status: in_progress", time: "1 minute ago" },
      { text: "Job card BYD-00004 created — normal priority", time: "1 minute ago" },
    ],
    lastSeen: "1 minute ago",
    hasNote: true,
    isAuto: false,
  },
  {
    id: "c-4",
    name: "John Smith",
    initials: "JS",
    status: "ACTIVE",
    phone: "0412345678",
    email: "john@example.com",
    tag: "Service",
    messages: 1,
    activities: [
      { text: "Customer called to confirm service appointment", time: "about 4 hours ago" },
      { text: "Job BYD-00002 status: in_progress", time: "about 4 hours ago" },
      { text: "Job card BYD-00002 created — normal priority", time: "about 4 hours ago" },
    ],
    lastSeen: "about 4 hours ago",
    hasNote: true,
    isAuto: false,
  },
  {
    id: "c-5",
    name: "John Smith",
    initials: "JS",
    status: "ACTIVE",
    phone: "0412345678",
    email: "john@example.com",
    tag: "Service",
    messages: 1,
    activities: [
      { text: "Customer called to confirm service appointment", time: "about 4 hours ago" },
      { text: "Job BYD-00003 status: in_progress", time: "about 4 hours ago" },
      { text: "Job card BYD-00003 created — normal priority", time: "about 4 hours ago" },
    ],
    lastSeen: "about 4 hours ago",
    hasNote: true,
    isAuto: false,
  },
  {
    id: "c-6",
    name: "John Smith",
    initials: "JS",
    status: "ACTIVE",
    phone: "0412345678",
    email: "john@example.com",
    tag: "Service",
    messages: 1,
    activities: [
      { text: "Booking status updated to: confirmed", time: "less than a minute ago" },
      { text: "Booking status updated to: confirmed", time: "1 minute ago" },
      { text: "Booking status updated to: confirmed", time: "2 minutes ago" },
    ],
    lastSeen: "less than a minute ago",
    hasNote: false,
    isAuto: true,
  },
];

const stages = ["All Stages", "Prospect", "Active", "Service"];

export default function OperationsCustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Unified profiles, vehicle history, and communication threads"
        action={
          <Link
            href="/operations/customers/new"
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Link>
        }
      />

      {/* Search + filter */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or suburb..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-700 shadow-sm outline-none placeholder:text-neutral-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <select className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 shadow-sm outline-none focus:border-rose-300">
          {stages.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-neutral-500">
        <span className="font-semibold text-neutral-800">{customers.length}</span> customers
      </p>

      {/* Customer cards grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {customers.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {c.initials}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">{c.name}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {c.status}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {c.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {c.email}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {c.messages}
                </span>
                <ChevronRight className="h-4 w-4 text-neutral-300" />
              </div>
            </div>

            {/* Tag */}
            <div className="mt-3">
              <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
                {c.tag}
              </span>
            </div>

            {/* Activity list */}
            <div className="mt-3 space-y-1.5">
              {c.activities.map((act, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                    <span className="text-xs text-neutral-600">{act.text}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-neutral-400">{act.time}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
              <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                <Clock className="h-3 w-3" />
                {c.lastSeen}
              </span>
              <div className="flex gap-2">
                {c.hasNote && (
                  <button className="rounded-md border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
                    📝 Note
                  </button>
                )}
                {c.isAuto && (
                  <span className="rounded-md border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                    Auto
                  </span>
                )}
                <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <MessageSquare className="h-3 w-3" />
                  {c.messages}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
