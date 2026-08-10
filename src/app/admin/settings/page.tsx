import { PageHeader } from "@/components/dashboard/PageHeader";
import { Panel, PanelHeader } from "@/components/dashboard/Panel";
import { Settings, Bell, Shield, Palette, Globe, Database } from "lucide-react";

const sections = [
  {
    id: "general",
    icon: Globe,
    title: "General",
    description: "Platform name, timezone, and locale settings.",
    fields: [
      { label: "Platform Name",  value: "Good Showroom DMS",        type: "text" },
      { label: "Timezone",       value: "Australia/Melbourne (AEST)", type: "select" },
      { label: "Date Format",    value: "DD MMM YYYY",               type: "select" },
    ],
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Control system-wide notification preferences.",
    fields: [
      { label: "Email Notifications", value: "Enabled",  type: "toggle" },
      { label: "SMS Notifications",   value: "Enabled",  type: "toggle" },
      { label: "Audit Alerts",        value: "Disabled", type: "toggle" },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    description: "Authentication and access control configuration.",
    fields: [
      { label: "Session Timeout",   value: "8 hours",   type: "select" },
      { label: "2FA Requirement",   value: "Admin only", type: "select" },
      { label: "IP Allowlist",      value: "Disabled",   type: "toggle" },
    ],
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Appearance",
    description: "Branding and UI customisation options.",
    fields: [
      { label: "Primary Colour", value: "#E11D48 (Rose 600)", type: "text" },
      { label: "Logo",           value: "/logo.png",           type: "text" },
      { label: "Dark Mode",      value: "System",              type: "select" },
    ],
  },
  {
    id: "data",
    icon: Database,
    title: "Data & Privacy",
    description: "Data retention and privacy settings.",
    fields: [
      { label: "Audit Log Retention", value: "90 days",     type: "select" },
      { label: "Data Export",         value: "Enabled",     type: "toggle" },
      { label: "GDPR Mode",           value: "Disabled",    type: "toggle" },
    ],
  },
];

const typeLabel: Record<string, string> = {
  text:   "text",
  select: "select",
  toggle: "toggle",
};

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Platform-wide configuration for Good Showroom DMS."
        action={
          <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
            <Settings className="h-4 w-4" />
            Save Changes
          </button>
        }
      />

      <div className="space-y-5">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Panel key={section.id}>
              <PanelHeader
                title=""
                action={
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                      <Icon className="h-4 w-4 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-neutral-900">{section.title}</p>
                      <p className="text-xs text-neutral-400">{section.description}</p>
                    </div>
                  </div>
                }
              />

              <div className="space-y-3">
                {section.fields.map((field) => (
                  <div key={field.label} className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{field.label}</p>
                      <p className="text-[11px] text-neutral-400 capitalize">{typeLabel[field.type]}</p>
                    </div>
                    {field.type === "toggle" ? (
                      <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${field.value === "Enabled" ? "bg-rose-500" : "bg-neutral-200"}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${field.value === "Enabled" ? "translate-x-4" : "translate-x-1"}`} />
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-neutral-600">{field.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
