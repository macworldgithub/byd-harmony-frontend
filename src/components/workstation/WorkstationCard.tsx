import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { accentMap } from "@/lib/accent";
import type { Workstation } from "@/lib/types";

export function WorkstationCard({ workstation }: { workstation: Workstation }) {
  const a = accentMap[workstation.accent];
  const Icon = workstation.icon;

  return (
    <Link
      href={workstation.href}
      className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.iconBg}`}>
          <Icon className={`h-5 w-5 ${a.iconText}`} />
        </div>
        <ChevronRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-neutral-500" />
      </div>

      <h3 className="mt-4 text-[17px] font-bold text-neutral-900">{workstation.name}</h3>
      <p className="mt-1 text-sm leading-snug text-neutral-500">{workstation.description}</p>

      <ul className="mt-4 space-y-1.5">
        {workstation.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-[13px] text-neutral-600">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
            {bullet}
          </li>
        ))}
      </ul>
    </Link>
  );
}
