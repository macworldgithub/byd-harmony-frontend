import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function QuickActionCard({
  label,
  icon: Icon,
  href,
}: {
  label: string;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm font-semibold text-neutral-800 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50"
    >
      <Icon className="h-[18px] w-[18px] text-neutral-500" />
      {label}
    </Link>
  );
}
