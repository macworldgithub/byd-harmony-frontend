import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Phone, Mail, Clock, MessageSquare, Plus, ChevronDown, Search } from "lucide-react";

type Stage = "Prospect" | "Active" | "Service" | "Inactive";

const stageTone: Record<Stage, "blue" | "green" | "orange" | "neutral"> = {
  Prospect: "blue",
  Active: "green",
  Service: "orange",
  Inactive: "neutral",
};

const customers = [
  { id: "c-1",  initials: "LA", color: "bg-purple-600", name: "Lee Atkinson",   stage: "Prospect" as Stage, phone: "6411111111",  email: "lee@atkinson.com",  location: "nyc",       lastActivity: "Customer profile created for Lee Atkinson", time: "31 minutes ago", source: "Auto" },
  { id: "c-2",  initials: "JS", color: "bg-orange-500", name: "John Smith",      stage: "Service"  as Stage, phone: "0412345678",  email: "john@example.com",  location: "",          lastActivity: "Customer called to confirm service appointment", time: "4 days ago", source: "Note", events: ["Job BYD-00015 status: in_progress", "Job card BYD-00015 created - normal priority"] },
  { id: "c-3",  initials: "JS", color: "bg-orange-500", name: "John Smith",      stage: "Active"   as Stage, phone: "0412345678",  email: "john@example.com",  location: "",          lastActivity: "Customer called to confirm service appointment", time: "4 days ago", source: "Note", events: ["Job BYD-00016 status: in_progress", "Job card BYD-00016 created - normal priority"] },
  { id: "c-4",  initials: "JS", color: "bg-orange-500", name: "John Smith",      stage: "Active"   as Stage, phone: "0412345678",  email: "john@example.com",  location: "",          lastActivity: "Customer called to confirm service appointment", time: "4 days ago", source: "Note", events: ["Job BYD-00014 status: in_progress", "Job card BYD-00014 created - normal priority"] },
];

export default function ExecutiveCustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Unified profiles, vehicle history, and communication threads"
        action={
            <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                <Plus className="h-4 w-4" />
                Add Customer
            </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or suburb..."
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
          />
        </div>
        <button className="flex items-center justify-between w-32 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
          All Stages
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        </button>
      </div>

      <p className="mb-4 text-sm text-neutral-500">17 customers</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map((c, idx) => (
          <Panel key={idx} padded={false} className="flex flex-col">
            <div className="flex items-start gap-3 p-4 flex-1">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${c.color} text-sm font-bold text-white`}>
                {c.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-bold text-neutral-900">{c.name}</p>
                        <Badge tone={stageTone[c.stage]}>{c.stage.toUpperCase()}</Badge>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-600">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-[13px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    {c.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                    {c.email}
                  </span>
                  {c.location && (
                    <span className="text-neutral-500">{c.location}</span>
                  )}
                </div>

                {c.stage === "Service" && (
                    <div className="mt-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="mr-1">🔧</span> Service
                        </span>
                    </div>
                )}
              </div>
            </div>

            <div className="border-t border-neutral-100 p-4 bg-neutral-50/50 rounded-b-2xl">
                <ul className="space-y-1.5 mb-3">
                    <li className="flex items-start gap-2 text-[13px]">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                        <span className="text-neutral-700 flex-1">{c.lastActivity}</span>
                        <span className="text-neutral-400 text-xs whitespace-nowrap ml-2">{c.time}</span>
                    </li>
                    {c.events?.map((evt, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px]">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
                            <span className="text-neutral-600 flex-1">{evt}</span>
                            <span className="text-neutral-400 text-xs whitespace-nowrap ml-2">{c.time}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-neutral-400">{c.time}</span>
                    <div className="flex items-center gap-2">
                         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            Note
                        </span>
                        {c.source === "Auto" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                                <Clock className="h-3 w-3" /> Auto
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                            <MessageSquare className="h-3.5 w-3.5" /> 1
                        </span>
                    </div>
                </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
