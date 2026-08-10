import { Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Lead } from "@/lib/types";

const stageTone = { prospect: "neutral", active: "blue", service: "neutral" } as const;

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3.5 shadow-sm">
      <p className="text-sm font-bold text-neutral-900">{lead.name}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <Phone className="h-3 w-3" /> {lead.phone}
        </span>
        <span className="flex items-center gap-1">
          <Mail className="h-3 w-3" /> {lead.email}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {lead.tags.map((tag) => (
          <Badge key={tag} tone={stageTone[tag]}>
            → {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
