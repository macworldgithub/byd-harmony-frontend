import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { IntegrationStatus } from "@/lib/types";

const config: Record<IntegrationStatus["status"], { label: string; classes: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "connected", classes: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  configured: { label: "configured", classes: "bg-blue-50 text-blue-700", icon: AlertCircle },
  active: { label: "active", classes: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
};

export function StatusPill({ status }: { status: IntegrationStatus["status"] }) {
  const { label, classes, icon: Icon } = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", classes)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
