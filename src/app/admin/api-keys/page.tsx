import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { ShoppingCart, Wrench, Truck, Shield, Globe, Copy, Lock, ExternalLink } from "lucide-react";
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
  purple: "bg-purple-50 border-purple-200 text-purple-800",
};

const scopeIconColors: Record<string, string> = {
  blue: "text-blue-500",
  orange: "text-orange-500",
  green: "text-emerald-500",
  purple: "text-purple-500",
};

export default function AdminApiKeysPage() {
  return (
    <div>
      <PageHeader
        title="API Keys"
        subtitle="Manage API keys for external role-based applications."
        action={
          <a
            href={`${apiBaseUrl.replace("/v1", "")}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            API Docs
          </a>
        }
      />

      <div className="space-y-5">
        {/* REST API Base URL */}
        <Panel>
          <PanelHeader title="REST API Base URL" />
          <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="h-4 w-4 shrink-0 text-neutral-400" />
              <code className="truncate text-sm font-mono text-neutral-700">{apiBaseUrl}</code>
            </div>
            <button className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors">
              <Copy className="h-3.5 w-3.5" />
              Copy URL
            </button>
          </div>
        </Panel>

        {/* API Scopes */}
        <Panel>
          <PanelHeader title="Available Scopes" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        </Panel>

        {/* Auth warning — matches reference screenshot */}
        <Panel>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50">
              <Lock className="h-4 w-4 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Admin Authentication Required</p>
              <p className="mt-1 text-sm text-neutral-500 leading-relaxed">
                Enter an existing admin API key to view and manage all keys. The first key must be
                created manually via the REST API or database.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="password"
                  placeholder="Paste admin API key…"
                  className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
