import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";

const customers = [
  {
    id: "c-1",
    name: "Lee Atkinson",
    phone: "6411111111",
    email: "lee@atkinson.com",
    stage: "prospect",
    source: "walk-in",
  },
  {
    id: "c-2",
    name: "John Smith",
    phone: "0412345678",
    email: "john@example.com",
    stage: "service",
    source: "-",
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `c-${i + 3}`,
    name: "John Smith",
    phone: "0412345678",
    email: "john@example.com",
    stage: "active",
    source: "-",
  })),
];

export default function SalesCustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        action={
          <div className="flex gap-4">
            <Toolbar searchPlaceholder="Search..." />
            <select className="border border-neutral-200 rounded-md px-3 text-sm focus:outline-none focus:border-rose-500 bg-white text-neutral-700">
              <option>All stages</option>
              <option>prospect</option>
              <option>service</option>
              <option>active</option>
              <option>inactive</option>
              <option>archived</option>
            </select>
          </div>
        }
      />

      <Panel padded={false} className="mt-6 border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {c.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-neutral-700">{c.phone}</div>
                    <div className="text-neutral-500">{c.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      tone={
                        c.stage === "prospect"
                          ? "blue"
                          : c.stage === "service"
                            ? "orange"
                            : "green"
                      }
                    >
                      {c.stage}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{c.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
