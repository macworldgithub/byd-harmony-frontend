// import { PageHeader } from "@/components/dashboard/PageHeader";
// import { Panel } from "@/components/dashboard/Panel";
// import { Badge } from "@/components/ui/Badge";
// import { Toolbar } from "@/components/dashboard/Toolbar";
// import { UserCircle2, Phone, Mail, Clock, MessageSquare } from "lucide-react";

// type Stage = "Prospect" | "Active" | "Service" | "Inactive";

// const stageTone: Record<Stage, "blue" | "green" | "orange" | "neutral"> = {
//   Prospect: "blue",
//   Active: "green",
//   Service: "orange",
//   Inactive: "neutral",
// };

// const customers = [
//   { id: "c-1",  initials: "LA", color: "bg-purple-600", name: "Lee Atkinson",   stage: "Prospect" as Stage, phone: "6411111111",  email: "lee@atkinson.com",  location: "nyc",       lastActivity: "3 minutes ago", unread: 0 },
//   { id: "c-2",  initials: "JS", color: "bg-orange-500", name: "John Smith",      stage: "Service"  as Stage, phone: "0412345678",  email: "john@example.com",  location: "",          lastActivity: "1 hour ago",    unread: 1 },
//   { id: "c-3",  initials: "SM", color: "bg-blue-600",   name: "Sarah Mitchell",  stage: "Active"   as Stage, phone: "0423456789",  email: "sarah@email.com",   location: "Richmond",  lastActivity: "2 hours ago",   unread: 0 },
//   { id: "c-4",  initials: "JT", color: "bg-green-600",  name: "James Tran",      stage: "Active"   as Stage, phone: "0434567890",  email: "james@email.com",   location: "Richmond",  lastActivity: "4 hours ago",   unread: 2 },
//   { id: "c-5",  initials: "PS", color: "bg-rose-600",   name: "Priya Sharma",    stage: "Prospect" as Stage, phone: "0445678901",  email: "priya@email.com",   location: "BYD 2",     lastActivity: "1 day ago",     unread: 0 },
//   { id: "c-6",  initials: "DL", color: "bg-cyan-600",   name: "David Lee",       stage: "Service"  as Stage, phone: "0456789012",  email: "david@email.com",   location: "Richmond",  lastActivity: "2 days ago",    unread: 0 },
//   { id: "c-7",  initials: "EW", color: "bg-violet-600", name: "Emma Wilson",     stage: "Active"   as Stage, phone: "0467890123",  email: "emma@email.com",    location: "",          lastActivity: "3 days ago",    unread: 0 },
//   { id: "c-8",  initials: "TN", color: "bg-amber-600",  name: "Tom Nguyen",      stage: "Inactive" as Stage, phone: "0478901234",  email: "tom@email.com",     location: "BYD 2",     lastActivity: "1 week ago",    unread: 0 },
// ];

// export default function AdminCustomersPage() {
//   return (
//     <div>
//       <PageHeader
//         title="All Customers"
//         subtitle="Platform-wide customer records across all sites."
//         action={<Toolbar searchPlaceholder="Search by name, email, phone..." filterLabel="All Stages" ctaLabel="Add Customer" />}
//       />

//       <p className="mb-4 text-sm text-neutral-500">{customers.length} customers</p>

//       <div className="space-y-3">
//         {customers.map((c) => (
//           <Panel key={c.id} padded={false}>
//             <div className="flex items-start gap-4 p-4">
//               {/* Avatar */}
//               <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${c.color} text-sm font-bold text-white`}>
//                 {c.initials}
//               </div>

//               {/* Main info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <p className="text-sm font-semibold text-neutral-900">{c.name}</p>
//                   <Badge tone={stageTone[c.stage]}>{c.stage.toUpperCase()}</Badge>
//                   {c.unread > 0 && (
//                     <span className="flex items-center gap-1 text-xs text-neutral-400">
//                       <MessageSquare className="h-3.5 w-3.5" />
//                       {c.unread}
//                     </span>
//                   )}
//                 </div>

//                 <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
//                   <span className="flex items-center gap-1">
//                     <Phone className="h-3 w-3 text-neutral-400" />
//                     {c.phone}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Mail className="h-3 w-3 text-neutral-400" />
//                     {c.email}
//                   </span>
//                   {c.location && (
//                     <span className="text-rose-500">{c.location}</span>
//                   )}
//                 </div>

//                 <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-400">
//                   <Clock className="h-3 w-3" />
//                   {c.lastActivity}
//                 </div>
//               </div>
//             </div>
//           </Panel>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { AddCustomerModal } from "@/components/customers/AddCustomerModal";
import { Phone, Mail, Clock, MessageSquare, Users } from "lucide-react";

type Stage = "Prospect" | "Active" | "Service" | "Inactive" | "Archived";

const stageTone: Record<Stage, "blue" | "green" | "orange" | "neutral"> = {
  Prospect: "blue",
  Active: "green",
  Service: "orange",
  Inactive: "neutral",
  Archived: "neutral",
};

function toDisplayStage(stage?: string): Stage {
  const map: Record<string, Stage> = {
    prospect: "Prospect",
    active: "Active",
    service: "Service",
    inactive: "Inactive",
    archived: "Archived",
  };
  return map[stage?.toLowerCase() ?? ""] ?? "Prospect";
}

export default function AdminCustomersPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [listMessage, setListMessage] = useState(
    "No customers loaded yet. Add a customer or integrate the GET API next."
  );

  const handleCreated = (created: unknown) => {
    if (created && typeof created === "object") {
      setCustomers((prev) => [created as any, ...prev]);
      setListMessage("");
    }
  };

  return (
    <div>
      <PageHeader
        title="All Customers"
        subtitle="Platform-wide customer records across all sites."
        action={
       <Toolbar
  searchPlaceholder="Search by name, email, phone..."
  filterLabel="All Stages"
  ctaLabel="Add Customer"
  onCtaClick={() => setIsAddOpen(true)}
/>
        }
      />

      <p className="mb-4 text-sm text-neutral-500">
        {customers.length > 0 ? `${customers.length} customers` : listMessage}
      </p>

      {customers.length === 0 ? (
        <Panel>
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Users className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-neutral-700">No customers yet</p>
            <p className="max-w-sm text-xs text-neutral-500">
              Click <strong>Add Customer</strong> to create the first record via the API.
              The list will be filled when the GET endpoint is integrated.
            </p>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="mt-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                boxShadow: "0 4px 14px rgba(109,40,217,0.3)",
              }}
            >
              Add Customer
            </button>
          </div>
        </Panel>
      ) : (
        <div className="space-y-3">
          {customers.map((c: any) => {
  const stage = toDisplayStage(c.lifecycleStage ?? c.stage);

  const name =
    c.name ??
    ([c.firstName, c.lastName].filter(Boolean).join(" ") || "—");

  const initials =
    c.initials ??
    (name
      .split(" ")
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?");

  const color = c.color ?? "bg-violet-600";
  const unread = c.unread ?? 0;
  const location = c.location ?? c.suburb ?? c.preferredLocationId ?? "";
  const lastActivity = c.lastActivity ?? c.updatedAt ?? c.createdAt ?? "";

            return (
              <Panel key={c.id ?? c._id ?? name} padded={false}>
                <div className="flex items-start gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-sm font-bold text-white`}
                  >
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{name}</p>
                      <Badge tone={stageTone[stage]}>{stage.toUpperCase()}</Badge>
                      {unread > 0 && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {unread}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-neutral-400" />
                          {c.phone}
                        </span>
                      )}
                      {c.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-neutral-400" />
                          {c.email}
                        </span>
                      )}
                      {location && <span className="text-rose-500">{location}</span>}
                    </div>

                    {lastActivity && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-400">
                        <Clock className="h-3 w-3" />
                        {typeof lastActivity === "string"
                          ? lastActivity
                          : new Date(lastActivity).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <AddCustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}