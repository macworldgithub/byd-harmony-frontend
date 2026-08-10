import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { Code2, ExternalLink, Copy } from "lucide-react";

const endpoints = [
  { method: "GET",    path: "/api/v1/customers",           description: "List all customers" },
  { method: "POST",   path: "/api/v1/customers",           description: "Create a customer" },
  { method: "GET",    path: "/api/v1/customers/:id",       description: "Get customer by ID" },
  { method: "PUT",    path: "/api/v1/customers/:id",       description: "Update customer" },
  { method: "DELETE", path: "/api/v1/customers/:id",       description: "Delete customer" },
  { method: "GET",    path: "/api/v1/vehicles",            description: "List all vehicles" },
  { method: "POST",   path: "/api/v1/vehicles",            description: "Register a vehicle" },
  { method: "GET",    path: "/api/v1/job-cards",           description: "List all job cards" },
  { method: "POST",   path: "/api/v1/job-cards",           description: "Create a job card" },
  { method: "GET",    path: "/api/v1/bookings",            description: "List all bookings" },
  { method: "POST",   path: "/api/v1/bookings",            description: "Create a booking" },
  { method: "GET",    path: "/api/v1/documents",           description: "List all documents" },
  { method: "POST",   path: "/api/v1/documents/upload",    description: "Upload a document" },
  { method: "GET",    path: "/api/v1/activity",            description: "System activity log" },
];

const methodColor: Record<string, string> = {
  GET:    "bg-blue-50 text-blue-700",
  POST:   "bg-green-50 text-green-700",
  PUT:    "bg-amber-50 text-amber-700",
  DELETE: "bg-rose-50 text-rose-700",
};

const baseUrl = "https://goodcrm-2bvrst5w.manus.space/api/v1";

export default function AdminApiDocsPage() {
  return (
    <div>
      <PageHeader
        title="API Docs"
        subtitle="REST API reference for external integrations and role-based apps."
        action={
          <a
            href={`${baseUrl}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in browser
          </a>
        }
      />

      {/* Base URL */}
      <Panel className="mb-5">
        <PanelHeader title="Base URL" />
        <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
          <code className="truncate text-sm font-mono text-neutral-700">{baseUrl}</code>
          <button className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </Panel>

      {/* Authentication */}
      <Panel className="mb-5">
        <PanelHeader title="Authentication" />
        <p className="text-sm text-neutral-500 leading-relaxed">
          All requests must include an{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-700">Authorization</code>{" "}
          header with a valid API key:
        </p>
        <div className="mt-3 rounded-xl bg-neutral-900 px-4 py-3">
          <code className="block text-xs font-mono text-emerald-400">
            Authorization: Bearer YOUR_API_KEY
          </code>
        </div>
      </Panel>

      {/* Endpoints */}
      <Panel padded={false}>
        <div className="border-b border-neutral-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-neutral-400" />
            <h2 className="text-[15px] font-bold text-neutral-900">Endpoints</h2>
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {endpoints.map((ep, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-neutral-50 transition-colors">
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold ${methodColor[ep.method]}`}>
                {ep.method}
              </span>
              <code className="flex-1 text-sm font-mono text-neutral-700">{ep.path}</code>
              <span className="text-xs text-neutral-400">{ep.description}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
