import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";

const customers = [
  { id: "c-1", name: "Lee Atkinson", contact: "6411111111", stage: "prospect" },
  { id: "c-2", name: "John Smith", contact: "0412345678", stage: "service" },
  { id: "c-3", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-4", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-5", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-6", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-7", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-8", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-9", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-10", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-11", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-12", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-13", name: "John Smith", contact: "0412345678", stage: "active" },
  { id: "c-14", name: "John Smith", contact: "0412345678", stage: "active" },
];

export default function SiteCustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        action={<Toolbar searchPlaceholder="Search..." />}
      />

      <Panel padded={false} className="mt-6 border-neutral-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{c.name}</td>
                  <td className="px-6 py-4 text-neutral-500">{c.contact}</td>
                  <td className="px-6 py-4">
                    <Badge tone="blue">{c.stage}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
