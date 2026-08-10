import { accentMap } from "@/lib/accent";
import type { RoleConfig } from "@/lib/types";

export function RoleBadge({ role }: { role: RoleConfig }) {
  const a = accentMap[role.accent];
  const Icon = role.roleIcon;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border ${a.badgeBorder} ${a.badgeBg} px-3 py-2.5`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${a.badgeText}`} />
      <div className="min-w-0 leading-tight">
        <p className={`truncate text-xs font-bold tracking-wide ${a.badgeText}`}>
          {role.roleLabel.toUpperCase()}
        </p>
        {role.scopeLine && (
          <p className="truncate text-[11px] text-neutral-500">{role.scopeLine}</p>
        )}
      </div>
    </div>
  );
}
