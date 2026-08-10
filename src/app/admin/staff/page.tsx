import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Users, UserCircle2 } from "lucide-react";
import { staffMembers } from "@/lib/data/admin-overview";

const roleBadgeTone: Record<string, "blue" | "green" | "neutral"> = {
  "Super Admin": "neutral",
  Sales: "blue",
  Service: "neutral",
  "Delivery Manager": "green",
  Executive: "green",
};

export default function AdminStaffPage() {
  return (
    <div>
      <PageHeader
        title="Staff & Roles"
        subtitle="Manage staff accounts and assign workstation roles across all sites."
      />

      {/* Staff table */}
      <Panel padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                  Name
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                  Site
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((member, i) => (
                <tr
                  key={member.id}
                  className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${i % 2 === 0 ? "" : "bg-neutral-50/30"}`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200">
                        <UserCircle2 className="h-4.5 w-4.5 text-neutral-500" />
                      </div>
                      <span className="font-medium text-neutral-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-500">{member.email}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={roleBadgeTone[member.role] ?? "neutral"}>
                      {member.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{member.site}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={member.status === "Active" ? "green" : "neutral"}>
                      {member.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Info box — matches the reference screenshot */}
      <div className="mt-6">
        <Panel>
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <Users className="h-6 w-6 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Staff management</p>
              <p className="mt-1 max-w-md text-sm text-neutral-500 leading-relaxed">
                Staff are managed via the OAuth system. Role assignments are stored in the users table.
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                To assign a role, update the{" "}
                <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600">
                  staffRole
                </code>{" "}
                field in the database for the relevant user.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
