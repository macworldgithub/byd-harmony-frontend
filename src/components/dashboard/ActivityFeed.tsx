import type { ActivityItem } from "@/lib/types";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="max-h-72 space-y-0 overflow-y-auto pr-1">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`flex items-start justify-between gap-4 py-2.5 ${
            i !== items.length - 1 ? "border-b border-neutral-100" : ""
          }`}
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
            <p className="text-sm text-neutral-700">{item.message}</p>
          </div>
          <span className="shrink-0 text-xs text-neutral-400">{item.timestamp}</span>
        </div>
      ))}
    </div>
  );
}
