import Link from "next/link";
import { LogOut } from "lucide-react";
import { RoleBadge } from "./RoleBadge";
import { NavListItem } from "./NavListItem";
import { accentMap } from "@/lib/accent";
import type { RoleConfig } from "@/lib/types";
import Image from "next/image";


export function Sidebar({ role }: { role: RoleConfig }) {
  const a = accentMap[role.accent];

  return (
    <aside className="flex h-screen w-[218px] shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="px-5 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Good Showroom"
            width={120}
            height={24}
            priority
            className="h-8 w-auto"
          />
        </div>
        <p className="mt-1.5 text-[10px] font-semibold tracking-wide text-neutral-400">
          BYD HARMONY GROUP · DMS
        </p>
      </div>

      <div className="px-4 pb-3">
        <RoleBadge role={role} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {role.sections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-2 pb-1.5 text-[10px] font-bold tracking-widest text-neutral-400">
              {section.title.toUpperCase()}
            </p>
            <ul className="space-y-0.5">
              {section.links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavListItem
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    icon={<Icon className="h-4 w-4 shrink-0" />}
                    activeBg={a.navActiveBg}
                    activeText={a.navActiveText}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-neutral-200 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-[12px] font-medium text-neutral-500 hover:text-neutral-800"
        >
          <LogOut className="h-4 w-4" />
          Switch workstation
        </Link>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
          <span className="inline-block h-3.5 w-3.5 rounded-sm bg-neutral-200" />
          Good Showroom DMS
        </p>
      </div>
    </aside>
  );
}
