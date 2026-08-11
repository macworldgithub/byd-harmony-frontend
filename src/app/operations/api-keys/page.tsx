import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel } from "@/components/dashboard/Panel";
import { ShoppingCart, Wrench, Truck, Shield, Globe, Copy, BookOpen, AlertTriangle } from "lucide-react";
import { apiBaseUrl, apiScopes } from "@/lib/data/admin-overview";

const scopeIcons: Record<string, React.ElementType> = {
  Sales: ShoppingCart,
  Service: Wrench,
  Delivery: Truck,
  Admin: Shield,
};

const scopeColors: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  orange: "bg-orange-50 border-orange-200 text-orange-800",
  green: "bg-emerald-50 border-emerald-200 text-emerald-800",
  purple: "bg-blue-50 border-blue-200 text-blue-800", // in screenshot Admin is blue
};

const scopeIconColors: Record<string, string> = {
  blue: "text-blue-500",
  orange: "text-orange-500",
  green: "text-emerald-500",
  purple: "text-blue-500", // in screenshot Admin is blue
};

export default function OperationsApiKeysPage() {
  return (
    <div>
      <PageHeader
        title="API Keys"
        subtitle="Manage API keys for external integrations, role-based apps, and webhook subscriptions."
        action={
          <a
            href="/operations/api-docs"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            API Docs
          </a>
        }
      />

      <div className="space-y-5">
        {/* REST API Base URL */}
        <Panel className="border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50">
                <Globe className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900">REST API Base URL</p>
                <code className="text-sm font-mono text-neutral-500">{apiBaseUrl}</code>
              </div>
            </div>
            <button className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-colors">
              <Copy className="h-3.5 w-3.5" />
              Copy URL
            </button>
          </div>
        </Panel>

        {/* API Scopes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {apiScopes.map((scope) => {
            const Icon = scopeIcons[scope.label] ?? Shield;
            return (
              <div
                key={scope.id}
                className={`rounded-xl border p-4 ${scopeColors[scope.color]}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`h-4 w-4 ${scopeIconColors[scope.color]}`} />
                  <p className="text-sm font-semibold">{scope.label}</p>
                </div>
                <p className="text-xs leading-relaxed opacity-80">{scope.description}</p>
              </div>
            );
          })}
        </div>

        {/* Auth warning — matches reference screenshot */}
        <Panel className="border-neutral-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 mt-0.5 text-rose-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-neutral-900">Admin Authentication Required</p>
              <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
                Enter an existing admin API key to view and manage all keys. The first key must be created manually via the REST API or database.
              </p>
              
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="password"
                  placeholder="gs_live_..."
                  className="w-full sm:flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:border-rose-300"
                />
                <button className="w-full sm:w-auto rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
                  Authenticate
                </button>
              </div>

              {/* First-time setup alert */}
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-bold text-amber-800 uppercase tracking-widest">First-time setup</h3>
                </div>
                <p className="mt-1 text-xs text-amber-700/90 mb-3">
                  To create your first admin key, run this against the REST API directly:
                </p>
                <code className="block rounded-lg bg-amber-100/50 p-3 text-[11px] font-mono text-amber-800 break-all border border-amber-200/50">
                  curl -X POST {apiBaseUrl}/keys \
                  -H "Authorization: Bearer YOUR_ADMIN_KEY" \
                  -H "Content-Type: application/json" \
                  -d '{`{"name":"Admin Key","role":"admin","scopes":["*"]}`}'
                </code>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
