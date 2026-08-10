import { TrendingUp } from "lucide-react";
import { accentMap } from "@/lib/accent";
import type { StatCardData } from "@/lib/types";

/** Icon + number card, used on the Super Admin overview page. */
export function IconStatCard({ stat }: { stat: StatCardData }) {
  const a = accentMap[stat.accent];
  const Icon = stat.icon;

  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}>
        <Icon className={`h-5 w-5 ${a.iconText}`} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-tight tracking-tight text-neutral-900">{stat.value}</p>
        <p className="truncate text-sm text-neutral-500">{stat.label}</p>
      </div>
    </div>
  );
}

export function IconStatCardGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <IconStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

/** Caps label + big colored number card, used on Executive / Site Executive dashboards. */
export function MetricStatCard({ stat }: { stat: StatCardData }) {
  const a = accentMap[stat.accent];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-[11px] font-bold tracking-widest text-neutral-400">{stat.label.toUpperCase()}</p>
      <p className={`mt-2 text-[28px] font-bold leading-none tracking-tight ${stat.valueClassName ?? a.valueText}`}>
        {stat.value}
      </p>
      {stat.helper && (
        <p
          className={`mt-2 text-xs ${
            stat.helperAccent ? "flex items-center gap-1 font-medium text-emerald-600" : "text-neutral-400"
          }`}
        >
          {stat.helperAccent && <TrendingUp className="h-3.5 w-3.5" />}
          {stat.helper}
        </p>
      )}
    </div>
  );
}

export function MetricStatCardGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <MetricStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

export function BigStatCard({
  value,
  label,
  colorClassName = "text-neutral-900",
}: {
  value: string;
  label: string;
  colorClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-6 text-center shadow-sm">
      <p className={`text-4xl font-bold tracking-tight ${colorClassName}`}>{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
    </div>
  );
}