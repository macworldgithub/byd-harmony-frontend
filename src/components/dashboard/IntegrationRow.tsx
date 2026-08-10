import { StatusPill } from "@/components/ui/StatusPill";
import type { IntegrationStatus } from "@/lib/types";

export function IntegrationRow({ item, last }: { item: IntegrationStatus; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-3 ${!last ? "border-b border-neutral-100" : ""}`}>
      <div>
        <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
        <p className="text-xs text-neutral-500">{item.detail}</p>
      </div>
      <StatusPill status={item.status} />
    </div>
  );
}
