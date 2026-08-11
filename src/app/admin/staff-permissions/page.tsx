import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Search,
  Building2,
  ChevronUp,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";

const staffList = [
  {
    id: "s-1",
    name: "Antony Silic",
    initials: "AS",
    role: "Sales Consultant",
    email: "Antony.Silic@bydcarolinesprings.com.au",
    tag: "SALES",
    status: "PENDING",
  },
  {
    id: "s-2",
    name: "Barnali Hazarika Das",
    initials: "BH",
    role: "Delivery Coordinator",
    email: "Kia.Das@bydcarolinesprings.com.au",
    tag: "DELIVERY",
    status: "PENDING",
  },
  {
    id: "s-3",
    name: "Charlotte Rose Davis",
    initials: "CR",
    role: "Delivery Coordinator",
    email: "Charlotte.Davis@bydcarolinesprings.com.au",
    tag: "DELIVERY",
    status: "PENDING",
  },
  {
    id: "s-4",
    name: "Craig Victor Dixon",
    initials: "CV",
    role: "Delivery Coordinator",
    email: "Craig.Dixon@bydcarolinesprings.com.au",
    tag: "DELIVERY",
    status: "PENDING",
  },
  {
    id: "s-5",
    name: "Gary Seng Boon Goh",
    initials: "GS",
    role: "Sales Consultant",
    email: "gary.goh@bydcarolinesprings.com.au",
    tag: "SALES",
    status: "PENDING",
  },
  {
    id: "s-6",
    name: "George Laurence Aletras",
    initials: "GL",
    role: "Sales Consultant",
    email: "George.Aletras@bydcarolinesprings.com.au",
    tag: "SALES",
    status: "PENDING",
  },
  {
    id: "s-7",
    name: "Gunesh Stanley Emmanuel Ramu",
    initials: "GS",
    role: "Sales Consultant",
    email: "gunesh.ram@bydcarolinesprings.com.au",
    tag: "SALES",
    status: "PENDING",
  },
  {
    id: "s-8",
    name: "Harsheen Singh",
    initials: "HS",
    role: "Sales Consultant",
    email: "Harry.Singh@bydcarolinesprings.com.au",
    tag: "SALES",
    status: "PENDING",
  },
  {
    id: "s-9",
    name: "Helen Tran",
    initials: "HT",
    role: "Admin & Stock Coordinator",
    email: "helen.tran@bydmelbourne.com.au",
    tag: "DELIVERY",
    status: "PENDING",
    isFlagged: true,
  },
];

export default function StaffPermissionsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[26px]">
          <Users className="h-7 w-7 text-rose-600" />
          Staff & Permissions
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage staff roles, site assignments, and access permissions across all
          BYD Harmony Group locations. No live accounts are active — this is the
          role mapping and permissions planning view.
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-6 flex gap-8">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-neutral-800">64</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Total
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-emerald-500">0</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
            Approved
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-orange-400">64</span>
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
            Pending
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-rose-500">21</span>
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
            Flagged
          </span>
        </div>
      </div>

      {/* Development Mode Alert */}
      <div className="mb-6 flex gap-3 rounded-xl border border-orange-200 bg-orange-50/50 p-4 text-orange-800">
        <AlertCircle className="h-5 w-5 shrink-0 text-orange-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-orange-800">
            Development Mode — No Live Accounts
          </h3>
          <p className="mt-0.5 text-sm text-orange-700/90 leading-relaxed">
            All 64 staff profiles have been mapped from the spreadsheet. Roles and
            site assignments can be reviewed and adjusted here. When authentication
            is enabled, each approved profile will be matched to their login
            account. <strong className="font-bold">Flagged</strong> records have
            email domain mismatches that need confirmation before going live.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, email, or title..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-700 shadow-sm outline-none placeholder:text-neutral-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <select className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 shadow-sm outline-none focus:border-rose-300">
          <option>All roles</option>
        </select>
        <select className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 shadow-sm outline-none focus:border-rose-300">
          <option>All sites</option>
        </select>
        <select className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-700 shadow-sm outline-none focus:border-rose-300">
          <option>All status</option>
        </select>
      </div>

      {/* Site Group */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {/* Group Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-bold text-neutral-900">
              BYD Caroline Springs
            </h2>
            <span className="text-xs text-neutral-500">23 staff</span>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
              2 flagged
            </span>
            <span className="text-xs text-neutral-400">0/23 approved</span>
          </div>
          <ChevronUp className="h-5 w-5 text-neutral-400" />
        </div>

        {/* Staff List */}
        <div className="divide-y divide-neutral-100">
          {staffList.map((staff) => (
            <div
              key={staff.id}
              className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-500">
                  {staff.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-900">
                      {staff.name}
                    </span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                      {staff.status}
                    </span>
                    {staff.isFlagged && (
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                    )}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {staff.role} · {staff.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    staff.tag === "SALES"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {staff.tag}
                </span>

                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
                    Approve
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
