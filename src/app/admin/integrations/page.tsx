import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { StatusPill } from "@/components/ui/StatusPill";
import { RefreshCw, MessageSquare, Phone, Sparkles, HardDrive, Wifi, Key, Server } from "lucide-react";
import { integrationHealth } from "@/lib/data/admin-overview";

const integrationDetails = [
  {
    id: "int-sms",
    icon: MessageSquare,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    name: "Live SMS",
    provider: "Mobile Message — Australian direct carrier",
    secrets: [
      { key: "MOBILEMESSAGE_API_USERNAME", description: "API username from your Mobile Message dashboard (Settings → API)" },
      { key: "MOBILEMESSAGE_API_PASSWORD", description: "API password paired with the username" },
      { key: "MOBILEMESSAGE_SENDER",       description: "Registered Sender ID — use your dedicated number for two-way replies" },
    ],
  },
  {
    id: "int-call",
    icon: Phone,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    name: "Click-to-call",
    provider: "AI voice demo call launcher",
    secrets: [
      { key: "VAPI_API_KEY",    description: "Your VAPI account API key" },
      { key: "VAPI_PHONE_ID",   description: "Phone number ID to call from" },
      { key: "VAPI_ASSISTANT_ID", description: "ID of the voice assistant to use" },
    ],
  },
  {
    id: "int-ai",
    icon: Sparkles,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    name: "AI / LLM",
    provider: "Built-in Forge API",
    secrets: [
      { key: "FORGE_API_KEY", description: "Internal API key for LLM model access" },
    ],
  },
  {
    id: "int-s3",
    icon: HardDrive,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    name: "S3 Storage",
    provider: "Manus Storage — document & file uploads",
    secrets: [
      { key: "S3_ACCESS_KEY",  description: "Storage access key" },
      { key: "S3_SECRET_KEY",  description: "Storage secret" },
      { key: "S3_BUCKET_NAME", description: "Target bucket name" },
      { key: "S3_REGION",      description: "Bucket region (e.g. ap-southeast-2)" },
    ],
  },
  {
    id: "int-smtp",
    icon: Server,
    iconBg: "bg-neutral-100",
    iconColor: "text-neutral-500",
    name: "SMTP Email",
    provider: "Nodemailer — transactional email delivery",
    secrets: [
      { key: "SMTP_HOST",     description: "Mail server hostname" },
      { key: "SMTP_PORT",     description: "Port (typically 587 or 465)" },
      { key: "SMTP_USER",     description: "SMTP username / email address" },
      { key: "SMTP_PASS",     description: "SMTP password or app password" },
      { key: "SMTP_FROM",     description: "From address shown to recipients" },
    ],
  },
];

export default function AdminIntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Configure external service connections."
        action={
          <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
            Re-test connections
          </button>
        }
      />

      {/* Live status row */}
      <Panel className="mb-5">
        <PanelHeader title="Connection Status" />
        <div className="space-y-0 -mt-2">
          {integrationHealth.map((item, i) => (
            <div key={item.name} className={`flex items-center justify-between py-3 ${i !== integrationHealth.length - 1 ? "border-b border-neutral-100" : ""}`}>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                <p className="text-xs text-neutral-500">{item.detail}</p>
              </div>
              <StatusPill status={item.status} />
            </div>
          ))}
        </div>
      </Panel>

      {/* Detail cards */}
      <div className="space-y-4">
        {integrationDetails.map((intg) => {
          const Icon = intg.icon;
          return (
            <Panel key={intg.id}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${intg.iconBg}`}>
                  <Icon className={`h-4.5 w-4.5 ${intg.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{intg.name}</p>
                  <p className="text-xs text-neutral-500">{intg.provider}</p>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  <Key className="h-3 w-3" />
                  Secret slots
                </p>
                <div className="space-y-3">
                  {intg.secrets.map((s) => (
                    <div key={s.key}>
                      <code className="text-[11px] font-mono font-semibold text-rose-600">{s.key}</code>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
