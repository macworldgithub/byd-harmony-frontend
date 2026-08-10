import { accentMap } from "@/lib/accent";
import type { AccentColor } from "@/lib/types";

const topBorder: Record<AccentColor, string> = {
  blue: "border-t-blue-500",
  orange: "border-t-amber-500",
  green: "border-t-emerald-500",
  purple: "border-t-violet-500",
  red: "border-t-rose-500",
};

export function KanbanColumn({
  title,
  count,
  accent,
  children,
  emptyLabel,
}: {
  title: string;
  count: number;
  accent: AccentColor;
  children?: React.ReactNode;
  emptyLabel: string;
}) {
  void accentMap;
  return (
    <div className="flex min-w-[260px] flex-1 flex-col">
      <div className={`flex items-center justify-between rounded-t-xl border-t-[3px] bg-white px-4 py-3 ${topBorder[accent]}`}>
        <p className="text-xs font-bold tracking-wide text-neutral-700">{title.toUpperCase()}</p>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-100 px-1.5 text-[11px] font-semibold text-neutral-600">
          {count}
        </span>
      </div>
      <div className="flex-1 space-y-3 rounded-b-xl bg-neutral-50/60 p-3">
        {count === 0 ? (
          <p className="pt-6 text-center text-sm text-neutral-400">{emptyLabel}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
