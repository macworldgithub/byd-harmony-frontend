import { Search, ChevronDown, Plus } from "lucide-react";

export function Toolbar({
  searchPlaceholder,
  filterLabel,
  ctaLabel,
}: {
  searchPlaceholder: string;
  filterLabel?: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-56 rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none"
        />
      </div>
      {filterLabel && (
        <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
          {filterLabel}
          <ChevronDown className="h-4 w-4 text-neutral-400" />
        </button>
      )}
      <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
        <Plus className="h-4 w-4" />
        {ctaLabel}
      </button>
    </div>
  );
}
