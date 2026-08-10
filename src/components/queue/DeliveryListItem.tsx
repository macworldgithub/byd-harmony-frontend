import type { DeliveryItem } from "@/lib/types";

export function DeliveryListItem({ item }: { item: DeliveryItem }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4 last:border-b-0">
      <div className="flex items-center gap-6">
        <p className="w-20 shrink-0 text-sm font-bold text-rose-600">{item.time}</p>
        <div>
          <p className="text-sm text-neutral-400">—</p>
          <p className="text-sm text-neutral-400">—</p>
          <p className="text-sm text-neutral-600">{item.detail}</p>
        </div>
      </div>
      <button className="shrink-0 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
        Confirm
      </button>
    </div>
  );
}
