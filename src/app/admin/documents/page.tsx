import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { Badge } from "@/components/ui/Badge";
import { Toolbar } from "@/components/dashboard/Toolbar";
import { FileText, Download } from "lucide-react";

type DocType = "Invoice" | "Service Report" | "Delivery Checklist" | "Quote" | "Warranty";

const typeTone: Record<DocType, "blue" | "orange" | "green" | "neutral" | "purple"> = {
  Invoice: "blue",
  "Service Report": "orange",
  "Delivery Checklist": "green",
  Quote: "neutral",
  Warranty: "purple",
};

const documents = [
  { id: "DOC-001", name: "Service Invoice — JC-001",           type: "Invoice"            as DocType, customer: "Lee Atkinson",   site: "Richmond", size: "84 KB",  date: "10 Aug 2026" },
  { id: "DOC-002", name: "12,000 km Service Report — JC-001",  type: "Service Report"     as DocType, customer: "Lee Atkinson",   site: "Richmond", size: "210 KB", date: "10 Aug 2026" },
  { id: "DOC-003", name: "Pre-Delivery Inspection — JC-006",   type: "Delivery Checklist" as DocType, customer: "Emma Wilson",    site: "Richmond", size: "145 KB", date: "7 Aug 2026"  },
  { id: "DOC-004", name: "BYD Atto 3 Quote",                  type: "Quote"              as DocType, customer: "Priya Sharma",   site: "BYD 2",   size: "56 KB",  date: "5 Aug 2026"  },
  { id: "DOC-005", name: "Brake Service Invoice — JC-002",     type: "Invoice"            as DocType, customer: "John Smith",     site: "Richmond", size: "92 KB",  date: "10 Aug 2026" },
  { id: "DOC-006", name: "Battery Warranty Certificate",       type: "Warranty"           as DocType, customer: "James Tran",     site: "Richmond", size: "178 KB", date: "9 Aug 2026"  },
  { id: "DOC-007", name: "Service Report — JC-005",           type: "Service Report"     as DocType, customer: "David Lee",      site: "BYD 2",   size: "195 KB", date: "8 Aug 2026"  },
];

export default function AdminDocumentsPage() {
  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Platform-wide documents — invoices, reports, and checklists."
        action={<Toolbar searchPlaceholder="Search documents..." filterLabel="All Types" ctaLabel="Upload Document" />}
      />

      <p className="mb-4 text-sm text-neutral-500">{documents.length} documents</p>

      <Panel padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Document", "Type", "Customer", "Site", "Size", "Date", ""].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs font-semibold tracking-wide text-neutral-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                        <FileText className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{doc.name}</p>
                        <p className="text-xs font-mono text-neutral-400">{doc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={typeTone[doc.type]}>{doc.type}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{doc.customer}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{doc.site}</td>
                  <td className="px-5 py-3.5 text-xs text-neutral-400">{doc.size}</td>
                  <td className="px-5 py-3.5 text-xs text-neutral-400">{doc.date}</td>
                  <td className="px-5 py-3.5">
                    <button className="flex items-center gap-1 rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-50 transition-colors">
                      <Download className="h-3 w-3" />
                      Download
                    </button>
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
