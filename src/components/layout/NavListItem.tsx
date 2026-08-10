"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function NavListItem({
  href,
  label,
  icon,
  activeBg,
  activeText,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  activeBg: string;
  activeText: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
          isActive ? `${activeBg} ${activeText}` : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        )}
      >
        {icon}
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}
